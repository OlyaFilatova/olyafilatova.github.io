import asyncio

from translate.config import MODEL_EN_TO_UK, MODEL_UK_TO_EN
from translate.loader import async_loader

models = { MODEL_EN_TO_UK, MODEL_UK_TO_EN }

async def preload():
  await asyncio.gather(*[async_loader(model) for model in models])

asyncio.run(
  preload()
)
