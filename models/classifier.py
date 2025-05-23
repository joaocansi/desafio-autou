from gradio_client import Client

class HuggingFaceClassifier:
    def __init__(self):
        self.client = Client("joaocansi/autou")

    def predict(self, text):
        result = self.client.predict(
            text,
            api_name="/predict",
        )
        return result
        
huggingface = HuggingFaceClassifier()

def get_model():
    return huggingface