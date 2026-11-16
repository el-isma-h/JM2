# Dockerfile — image unique pour l'API et l'ingestion. APP_DIR = starter (par défaut) ou solution.
FROM python:3.12-slim
ARG APP_DIR=starter
ARG EXTRAS="psycopg[binary]>=3.2 anthropic>=2.0"
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY ${APP_DIR}/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt ${EXTRAS}
# Pour des embeddings réels : ajoutez sentence-transformers à EXTRAS et pré-téléchargez le modèle ici
# (sinon le premier appel prend une minute) — RAG_EMBEDDINGS=sentence-transformers.
COPY ${APP_DIR}/rag ./rag
COPY tests.jsonl ./tests.jsonl
RUN mkdir -p /app/procedures /app/var
EXPOSE 8080
CMD ["uvicorn", "rag.api:app", "--host", "0.0.0.0", "--port", "8080"]
