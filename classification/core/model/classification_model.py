from abc import ABC, abstractmethod

class ClassificationModel(ABC):
    @abstractmethod
    def classify(self, email: str) -> str:
        pass