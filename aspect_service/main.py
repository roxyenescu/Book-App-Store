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
ASPECTS = ["story", "characters", "writing style", "translation", "pacing",
            "plot", "originality", "suspense", "dialogue", "themes"]

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

    # 4b) Fallback: include manually if the word actually appears
    for aspect in ASPECTS:
        if aspect not in chosen and aspect in text:
            chosen.append(aspect)

    # 5) For each selected aspect, run sentiment analysis
    results = {}
    for aspect in chosen:
        # 5a) Extract the sentences that contain the aspect
        sents = [s.strip() for s in text.split(".") if aspect in s]
        if not sents:
            chunk = text  # total fallback
        else:
            sent = sents[0]
            # 5b) Divide by commas and periods and select exactly the segment with the appearance
            parts = [p.strip() for p in sent.replace(";", ",").split(",")]
            segment = next((p for p in parts if aspect in p), sent)
            chunk = segment

        # 6) Analyze the sentiment of the fragment
        pol = sentiment_analyzer(chunk)[0]
        results[aspect] = pol["label"].lower()

    return {"aspects": results}