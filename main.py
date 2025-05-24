import os
from fastapi.staticfiles import StaticFiles

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()

from classification.controller import router as classification_router
from suggestion.controller import router as suggestion_router

app = FastAPI()
app.include_router(classification_router)
app.include_router(suggestion_router)

if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")