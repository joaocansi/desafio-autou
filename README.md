# Desafio Técnico Autou - API

Este projeto é uma aplicação Python para o desafio técnico da Autou. A aplicação implementa uma API para atender aos requisitos do desafio.

## Requisitos

- Python 3.10 ou superior

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/joaocansi/desafio-autou.git
   cd desafio-autou/
   ```

2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

3. Configure as variáveis de ambiente:

Para usar este projeto, você precisa configurar as variáveis de ambiente a seguir:
- OPENAI_API_KEY: Gere sua chave de acesso na [OpenAI Plataform](https://platform.openai.com/api-keys).
- HUGGINGFACE_SPACE: Informe o nome do espaço que você criou no [HuggingFace Space](https://huggingface.co/spaces) (É recomendável utilizar **joaocansi/autou**)

Se preferir criar um espaço privado no HuggingFace, você pode usar este repositório com o código do modelo: https://huggingface.co/spaces/joaocansi/autou/tree/main

Exemplo de configuração no arquivo `.env`:
   ```bash
   OPENAI_API_KEY=chave_de_acesso_da_openai
   HUGGINGFACE_SPACE=nome_do_espaco_no_hugging_face
   ```

## Uso

1. Execute a aplicação:

   ```bash
   uvicorn main:app --reload
   ```

2. Acesse a API em `http://localhost:8000`.

## Estrutura do Projeto
```
desafio-autou/
├─ classification/                     # módulo de classificação de e-mails
│  ├─ core/                            
│  │  ├─ model/                        
│  │  │  ├─ hugging_face.py            # implementação do modelo de classificação (HuggingfaceSpace + Bert)
│  │  │  ├─ classification_mode.py     # interface do modelo de classificação
│  ├─ controller.py
│  ├─ service.py
├─ suggestion/                         # módulo de segestão de e-mails
│  ├─ core/
│  │  ├─ model/
│  │  │  ├─ openai.py                  # implementação do modelo de sugestão (GPT 4o-mini)
│  │  │  ├─ suggestion_model.py        # interface do modelo de sugestão
│  ├─ controller.py
│  ├─ service.py
├─ static/                             # arquivos da interface web
├─ terraform/                          # arquivos para deploy automático no Render
├─ main.py                             # inicializa a aplicação
├─ requirements.py                     # arquivo com todos os requisitos da aplicação
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
