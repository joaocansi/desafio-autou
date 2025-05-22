import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from fastapi import Depends, FastAPI
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()

from models.classifier import BertClassifier, get_model
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
def predict(request: PredictRequest, model: BertClassifier = Depends(get_model)):
    print(request.email)
    response = model.predict(request.email)
    return {"prediction": str(response)}

@app.post('/suggest')
def predict(request: SuggestRequest, model: GPTSuggestion = Depends(get_gpt_model)):
    print(request.email)
    response = model.suggest(request.email)
    return {"prediction": str(response)}

if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")