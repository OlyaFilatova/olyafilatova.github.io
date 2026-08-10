FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/_skills_gateway/*.toml services/_skills_gateway/

# Install only this package and its dependencies
RUN uv sync \
    --package job-skills-gateway \
    --no-dev \
    --frozen

COPY services/_skills_gateway/*.py services/_skills_gateway/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9000

CMD ["uvicorn", "services._skills_gateway.api:app", "--host", "0.0.0.0", "--port", "9000", "--workers", "2"]
