from .core.model.suggestion_model import SuggestionModel

class SuggestionService:
    def __init__(self, model: SuggestionModel):
        self.model = model

    def suggest(self, email_to_answer: str, customizations: list[str]) -> str:
        result = self.model.suggest(email_to_answer, customizations)
        if not result:
            raise ValueError("Resultado inesperado do modelo de sugestão.")
        return result

    