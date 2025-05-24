from fastapi import APIRouter, HTTPException

from .service import ClassificationService
from .core.model.classification_model import ClassificationModel
from .core.model.hugging_face import HuggingFaceClassifier

from pydantic import BaseModel

class ClassifyRequest(BaseModel):
    email: str

huggingface = HuggingFaceClassifier()
classification_service = ClassificationService(huggingface)

router = APIRouter()

@router.post('/classify')
def classify(request: ClassifyRequest):
    try:
        prediction = classification_service.classify(request.email)
        return {"classification": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno, tente novamente mais tarde.")

