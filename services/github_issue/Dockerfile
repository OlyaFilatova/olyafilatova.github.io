FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./

COPY services/github_issue/*.py github_issue/
COPY services/github_issue/*.toml github_issue/
COPY shared ./shared

# Install only this package and its dependencies
RUN uv sync \
    --package parse-github-issue \
    --no-dev \
    --frozen

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "github_issue.api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
