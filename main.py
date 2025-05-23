import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()

from models.classifier import HuggingFaceClassifier, get_model
from models.suggestion import GPTSuggestion, get_model as get_gpt_model

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    email: str

class SuggestRequest(BaseModel):
    email: str

@app.post('/classify')
def classify(request: PredictRequest, model: HuggingFaceClassifier = Depends(get_model)):
    try:
        prediction = model.predict(request.email)
        match prediction:
            case "1":
                return {"classification": "productive"}
            case "-1":
                return {"classification": "unproductive"}
            case _:
                raise HTTPException(status_code=500, detail="Invalid model output")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post('/suggest')
def predict(request: SuggestRequest, model: GPTSuggestion = Depends(get_gpt_model)):
    response = model.suggest(request.email)
    if response is None:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    else:
        return {"suggestion": str(response)}

if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")