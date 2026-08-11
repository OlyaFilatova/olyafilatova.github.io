FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY services/job_skills/*.toml services/job_skills/

# Install only this package and its dependencies
RUN uv sync \
    --package job-skills \
    --no-dev \
    --frozen

COPY services/job_parser/models/*.py services/job_parser/models/
COPY services/skills/models/*.py services/skills/models/
COPY shared ./shared
COPY services/job_skills/*.py services/job_skills/
COPY services/job_skills/database/*.py services/job_skills/database/
COPY services/job_skills/repositories/*.py services/job_skills/repositories/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 9004

CMD ["uvicorn", "services.job_skills.api:app", "--host", "0.0.0.0", "--port", "9004", "--workers", "2"]
