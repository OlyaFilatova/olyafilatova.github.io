FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/skills/*.toml services/skills/

# Install only this package and its dependencies
RUN uv sync \
    --package skills \
    --no-dev \
    --frozen

COPY shared ./shared
COPY services/skills/*.py services/skills/
COPY services/skills/database/*.py services/skills/database/
COPY services/skills/models/*.py services/skills/models/
COPY services/skills/repositories/*.py services/skills/repositories/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9002

CMD ["uvicorn", "services.skills.api:app", "--host", "0.0.0.0", "--port", "9002", "--workers", "2"]
