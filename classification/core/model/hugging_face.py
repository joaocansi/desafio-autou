from .classification_model import ClassificationModel
from gradio_client import Client

import os

class HuggingFaceClassifier(ClassificationModel):
    def __init__(self):
        self.client = Client(os.getenv("HUGGINGFACE_SPACE"))

    def classify(self, text: str) -> str:
        """
        Classifica o texto fornecido como produtivo ou improdutivo.

        Args:
            text (str): A mensagem de texto a ser classificada.

        Returns:
            int: Retorna 1 se a mensagem for produtiva e -1 se for improdutiva.
        """
        result = self.client.predict(text, api_name="/predict")
        return result