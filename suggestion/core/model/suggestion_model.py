from abc import ABC, abstractmethod

class SuggestionModel(ABC):
    @abstractmethod
    def suggest(self, email_to_answer: str, customizations: list[str]) -> str:
        pass