"""
AR Interaction Dashboard — ML Training Pipeline
------------------------------------------------
Run locally whenever you want to refresh the dashboard:
    cd ml
    python train_and_store.py

What this does:
  1. Pulls interactions + feedback from Supabase
  2. Aggregates interactions into session-level features
  3. Trains Logistic Regression + Random Forest
  4. Runs TextBlob sentiment on feedback comments
  5. Writes all results to model_runs + updates feedback rows
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client
from textblob import TextBlob
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, roc_curve, auc
)

warnings.filterwarnings("ignore")
load_dotenv()

# ─────────────────────────────────────────────
# 1. CONNECT TO SUPABASE
# ─────────────────────────────────────────────

url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(url, key)

print("✓ Connected to Supabase")


# ─────────────────────────────────────────────
# 2. PULL DATA
# ─────────────────────────────────────────────

def fetch_all(table: str) -> pd.DataFrame:
    """Fetch all rows from a Supabase table, handling pagination."""
    rows = []
    limit = 1000
    offset = 0
    while True:
        response = supabase.table(table).select("*").range(offset, offset + limit - 1).execute()
        batch = response.data
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
    return pd.DataFrame(rows)


print("Fetching interactions...")
interactions_df = fetch_all("interactions")
print(f"  → {len(interactions_df)} interaction events")

print("Fetching feedback...")
feedback_df = fetch_all("feedback")
print(f"  → {len(feedback_df)} feedback rows")


# ─────────────────────────────────────────────
# 3. AGGREGATE INTERACTIONS INTO SESSION FEATURES
# ─────────────────────────────────────────────

# Each session_start represents one user session.
# We count how many times each interaction type occurred per session,
# then label the session 1 if it contained any add_to_cart event.

FEATURE_TYPES = ["zoom", "rotate", "category_filter", "voice_command", "view_journey", "product_switch"]

# Pivot: one row per session, one column per interaction type
pivot = (
    interactions_df
    .groupby(["session_start", "type"])
    .size()
    .unstack(fill_value=0)
    .reset_index()
)

# Ensure all feature columns exist even if a type never appeared
for col in FEATURE_TYPES + ["add_to_cart"]:
    if col not in pivot.columns:
        pivot[col] = 0

# Build session-level ML dataframe
sessions = pivot[["session_start"] + FEATURE_TYPES].copy()
sessions["added_to_cart"] = (pivot["add_to_cart"] > 0).astype(int)

print(f"\n✓ Aggregated into {len(sessions)} sessions")
print(f"  Cart conversions : {sessions['added_to_cart'].sum()}")
print(f"  No cart          : {(sessions['added_to_cart'] == 0).sum()}")


# ─────────────────────────────────────────────
# 4. TRAIN MODELS
# ─────────────────────────────────────────────

X = sessions[FEATURE_TYPES]
y = sessions["added_to_cart"]

# With only 68 sessions we use a smaller test set to preserve training data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTraining on {len(X_train)} sessions, testing on {len(X_test)}")


def compute_metrics(model, X_test, y_test, model_name: str) -> dict:
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)
    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "accuracy"        : round(accuracy_score(y_test, y_pred), 4),
        "precision"       : round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall"          : round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1"              : round(f1_score(y_test, y_pred, zero_division=0), 4),
        "roc_auc"         : round(roc_auc, 4),
        "confusion_matrix": cm,
        "roc_curve"       : {
            "fpr": [round(v, 4) for v in fpr.tolist()],
            "tpr": [round(v, 4) for v in tpr.tolist()],
        },
    }
    print(f"\n{model_name}")
    print(f"  Accuracy  : {metrics['accuracy']}")
    print(f"  Precision : {metrics['precision']}")
    print(f"  Recall    : {metrics['recall']}")
    print(f"  F1        : {metrics['f1']}")
    print(f"  AUC       : {metrics['roc_auc']}")
    return metrics


# Logistic Regression
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train, y_train)
lr_metrics = compute_metrics(lr, X_test, y_test, "Logistic Regression")

# Store coefficients for the live predictor widget on the dashboard
lr_coefficients = {
    feature: round(float(coef), 6)
    for feature, coef in zip(FEATURE_TYPES, lr.coef_[0])
}
lr_intercept = round(float(lr.intercept_[0]), 6)
lr_metrics["coefficients"] = lr_coefficients
lr_metrics["intercept"]    = lr_intercept

# Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
rf_metrics = compute_metrics(rf, X_test, y_test, "Random Forest")

# Feature importances
rf_metrics["feature_importances"] = {
    feature: round(float(imp), 6)
    for feature, imp in zip(FEATURE_TYPES, rf.feature_importances_)
}


# ─────────────────────────────────────────────
# 5. CORRELATION MATRIX
# ─────────────────────────────────────────────

corr = sessions[FEATURE_TYPES + ["added_to_cart"]].corr().round(4)
correlation_matrix = corr.to_dict()

print("\n✓ Correlation matrix computed")


# ─────────────────────────────────────────────
# 6. SENTIMENT ANALYSIS ON FEEDBACK
# ─────────────────────────────────────────────

def get_sentiment(text: str) -> tuple[float, str]:
    if not text or not str(text).strip():
        return 0.0, "Neutral"
    score = TextBlob(str(text)).sentiment.polarity
    if score > 0.1:
        label = "Positive"
    elif score < -0.1:
        label = "Negative"
    else:
        label = "Neutral"
    return round(score, 4), label


feedback_df["sentiment_score"], feedback_df["sentiment_label"] = zip(
    *feedback_df["comment"].apply(get_sentiment)
)

print(f"\n✓ Sentiment analysis complete")
print(feedback_df["sentiment_label"].value_counts().to_string())


# ─────────────────────────────────────────────
# 7. TOP KEYWORDS (Enhancement B)
# ─────────────────────────────────────────────

STOPWORDS = {
    "i", "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
    "for", "of", "with", "is", "it", "my", "was", "this", "that", "are",
    "be", "so", "very", "really", "have", "has", "had", "can", "just",
    "its", "from", "by", "as", "me", "we", "they", "not", "do", "did",
    "would", "could", "should", "will", "s", "t", "re"
}


def extract_words(texts: pd.Series) -> dict:
    freq: dict = {}
    for text in texts:
        if not text or not str(text).strip():
            continue
        for word in str(text).lower().split():
            word = word.strip(".,!?\"'()-")
            if len(word) > 2 and word not in STOPWORDS:
                freq[word] = freq.get(word, 0) + 1
    # Return top 10 sorted by frequency
    return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True)[:10])


positive_texts = feedback_df.loc[feedback_df["sentiment_label"] == "Positive", "comment"]
negative_texts = feedback_df.loc[feedback_df["sentiment_label"] == "Negative", "comment"]

top_keywords = {
    "positive": extract_words(positive_texts),
    "negative": extract_words(negative_texts),
}

print(f"\n✓ Top keywords extracted")
print(f"  Positive words: {list(top_keywords['positive'].keys())}")
print(f"  Negative words: {list(top_keywords['negative'].keys())}")


# ─────────────────────────────────────────────
# 8. WRITE RESULTS TO SUPABASE
# ─────────────────────────────────────────────

print("\nWriting results to Supabase...")

# 8a. Insert new row into model_runs
model_run_payload = {
    "total_sessions"    : int(len(sessions)),
    "cart_sessions"     : int(sessions["added_to_cart"].sum()),
    "lr_metrics"        : lr_metrics,
    "rf_metrics"        : rf_metrics,
    "correlation_matrix": correlation_matrix,
    "top_keywords"      : top_keywords,
    "lr_coefficients"   : {
        "coefficients": lr_coefficients,
        "intercept"   : lr_intercept,
        "features"    : FEATURE_TYPES,
    },
}

run_response = supabase.table("model_runs").insert(model_run_payload).execute()
print(f"✓ model_runs row inserted (id: {run_response.data[0]['id']})")

# 8b. Update sentiment columns on each feedback row
updated = 0
for _, row in feedback_df.iterrows():
    supabase.table("feedback").update({
        "sentiment_score": row["sentiment_score"],
        "sentiment_label": row["sentiment_label"],
    }).eq("id", str(row["id"])).execute()
    updated += 1

print(f"✓ {updated} feedback rows updated with sentiment")

print("\n✅ Pipeline complete — dashboard will reflect new results on next page load")