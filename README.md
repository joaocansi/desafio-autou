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

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
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
