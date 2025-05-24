from openai import OpenAI
from .suggestion_model import SuggestionModel

import os

class OpenAISuggestionModel(SuggestionModel):
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def suggest(self, email_to_answer: str, customizations: list[str]) -> str:
        prompt = f"""
            Abaixo está o conteúdo do e-mail recebido:

            ---

            [INÍCIO DO E-MAIL]
            {email_to_answer}
            [FIM DO E-MAIL]

            ---

            Com base no conteúdo acima, gere **apenas a resposta** para este e-mail, mantendo um tom claro, educado e objetivo. Deve ser um e-mail com tom corporativo.

            Inclua as seguintes informações personalizadas, se forem relevantes:
            {chr(10).join(f"- {c}" for c in customizations)}

            A resposta deve ser diretamente relacionada ao conteúdo do e-mail e não deve repetir o que foi enviado, apenas responder de forma adequada.
        """
        completion = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            messages=[
                {"role": "system", "content": "Você é um assistente que gera resposta para emails baseado em seu conteúdo."},
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content
