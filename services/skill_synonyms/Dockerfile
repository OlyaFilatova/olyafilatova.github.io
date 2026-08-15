FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/skill_synonyms/*.toml services/skill_synonyms/

# Install only this package and its dependencies
RUN uv sync \
    --package skill-synonyms \
    --no-dev \
    --frozen

COPY shared ./shared
COPY services/skill_synonyms/*.py services/skill_synonyms/
COPY services/skill_synonyms/database/*.py services/skill_synonyms/database/
COPY services/skill_synonyms/models/*.py services/skill_synonyms/models/
COPY services/skill_synonyms/generated/*.py services/skill_synonyms/generated/
COPY services/skill_synonyms/repositories/*.py services/skill_synonyms/repositories/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9005

CMD ["uvicorn", "services.skill_synonyms.api:app", "--host", "0.0.0.0", "--port", "9005", "--workers", "2"]
