#!/bin/sh
set -e

echo "Checking Hugging Face cache..."

python -m services.translate.preload_model

echo "Starting API..."

exec uvicorn services.translate.api:app \
    --host 0.0.0.0 \
    --port 8001
