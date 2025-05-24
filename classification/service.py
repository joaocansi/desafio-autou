from .core.model.classification_model import ClassificationModel

class ClassificationService:
    def __init__(self, model: ClassificationModel):
        self.model = model

    def classify(self, data):
        result = self.model.classify(data)
        if result == "1":
            return "produtivo"
        elif result == "-1":
            return "improdutivo"
        else:
            raise ValueError("Resultado inesperado do modelo de classificação.")