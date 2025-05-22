class BertClassifier:
    def __init__(self):
        from transformers import BertTokenizer, AutoModel
        from sklearn.ensemble import IsolationForest
        self.tokenizer = BertTokenizer.from_pretrained("neuralmind/bert-base-portuguese-cased")
        self.model = AutoModel.from_pretrained("neuralmind/bert-base-portuguese-cased")
        self.isoforest = IsolationForest(contamination=0.1, random_state=42)
        self.isoforest.fit(self._load_embeddings())

    # Carrega os embeddings gerados pelo BERT
    def _load_embeddings(self):
        import numpy as np
        embeddings = np.load('models/bert-embedding.npy')
        return embeddings

    def encode(self, text):
        return self.tokenizer(text, padding=True, truncation=True, return_tensors='pt', max_length=256)

    def predict(self, text):
        import torch
        with torch.no_grad():
            text = str(text)
            inputs = self.encode(text)
            outputs = self.model(**inputs)
            cls_embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
        pred = self.isoforest.predict(cls_embedding)[0]
        return pred
    
bert = BertClassifier()

def get_model():
    return bert