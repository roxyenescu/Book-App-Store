from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

# 1) Zero-shot pipeline for identifying aspects in text
aspect_classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

# 2) Classic feeling pipeline
sentiment_analyzer = pipeline("sentiment-analysis")

# 3) Define the list of relevant aspects for reviews
ASPECTS = ["story", "characters", "writing style", "translation", 
           "pacing", "plot", "suspense", "dialogue", "themes", "book"]

app = FastAPI()

class ReviewIn(BaseModel):
    text: str

@app.post("/analyze_aspects")
async def analyze_aspects(input: ReviewIn):
    text = input.text.lower()

    # 4) Zero-shot classification: find out which aspects from the list appear in the text
    zs = aspect_classifier(text, candidate_labels=ASPECTS)
    chosen = [
        label for label, score in zip(zs["labels"], zs["scores"])
        if score > 0.1  # confidence threshold
    ]

    # 5) For each selected aspect, run sentiment analysis
    results = {}
    for aspect in chosen:
        # 5a) Find the sentences that contain exactly the word-aspect
        sentences = [s.strip() for s in text.split(".") if aspect in s]
        if not sentences:
            # If there is none, omit this aspect
            continue

        # 5b) Take the first sentence and, optionally, cut after the comma for clarity
        first = sentences[0]
        parts = [p.strip() for p in first.replace(";", ",").split(",")]
        chunk = next((p for p in parts if aspect in p), first)

        # 6) Analyze the feeling of that fragment
        pol = sentiment_analyzer(chunk)[0]
        results[aspect] = pol["label"].lower()

    return {"aspects": results}