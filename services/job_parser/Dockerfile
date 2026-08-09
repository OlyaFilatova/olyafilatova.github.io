FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/job_parser/*.toml job_parser/

# Install only this package and its dependencies
RUN uv sync \
    --package parse-job-posting \
    --no-dev \
    --frozen

COPY shared ./shared
COPY services/job_parser/*.py job_parser/
COPY services/job_parser/database/*.py job_parser/database/
COPY services/job_parser/models/*.py job_parser/models/
COPY services/job_parser/repositories/*.py job_parser/repositories/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9001

CMD ["uvicorn", "job_parser.api:app", "--host", "0.0.0.0", "--port", "9001", "--workers", "2"]
