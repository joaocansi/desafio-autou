import os

class GPTSuggestion:
    def __init__(self):
        from openai import OpenAI
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_TOKEN"))

    def suggest(self, text):
        completion = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            messages=[
                {"role": "system", "content": "Você é um assistente que gera resposta para emails baseado em seu conteúdo."},
                {"role": "user", "content": text}
            ]
        )
        return completion.choices[0].message.content
        
gpt = GPTSuggestion()

def get_model():
    return gpt