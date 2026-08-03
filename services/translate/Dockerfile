FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models \
    TRANSFORMERS_CACHE=/models

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        gcc \
        g++ \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/translate/pyproject.toml translate/
# Install only this package and its dependencies
RUN uv sync \
    --package translate \
    --no-dev \
    --frozen

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8001

COPY services/translate/docker-entrypoint.sh translate/

RUN chmod +x translate/docker-entrypoint.sh

COPY services/translate/*.py translate/

ENTRYPOINT ["/app/translate/docker-entrypoint.sh"]