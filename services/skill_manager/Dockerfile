FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/skill_manager/*.toml services/skill_manager/

# Install only this package and its dependencies
RUN uv sync \
    --package skill-manager \
    --no-dev \
    --frozen

COPY shared ./shared
COPY services/skill_manager/*.py services/skill_manager/
COPY services/skill_manager/database/*.py services/skill_manager/database/
COPY services/skill_manager/models/*.py services/skill_manager/models/
COPY services/skill_manager/repositories/*.py services/skill_manager/repositories/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9002

CMD ["uvicorn", "services.skill_manager.api:app", "--host", "0.0.0.0", "--port", "9002", "--workers", "2"]
