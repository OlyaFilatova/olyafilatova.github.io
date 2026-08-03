#!/bin/sh
set -e

echo "Checking Hugging Face cache..."

python -m translate.preload_model

echo "Starting API..."

exec uvicorn translate.api:app \
    --host 0.0.0.0 \
    --port 8001
