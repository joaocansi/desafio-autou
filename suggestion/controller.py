from fastapi import APIRouter, HTTPException
from .service import SuggestionService
from .core.model.openai import OpenAISuggestionModel

from pydantic import BaseModel

class SuggestRequest(BaseModel):
    email: str
    customizations: list[str] = []

openai_suggestion_model = OpenAISuggestionModel()
suggestion_service = SuggestionService(openai_suggestion_model)

router = APIRouter()

@router.post('/suggest')
def classify(request: SuggestRequest):
    try:
        suggestion = suggestion_service.suggest(request.email, request.customizations)
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno, tente novamente mais tarde.")

