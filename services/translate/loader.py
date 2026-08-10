import asyncio

from transformers import MarianMTModel, MarianTokenizer


def loader(model: str) -> None:
  print(f"Loading {model}...")

  MarianTokenizer.from_pretrained(model)
  MarianMTModel.from_pretrained(model)

  print("Model ready.")


async def async_loader(model_name: str):
  return await asyncio.to_thread(loader, model_name)
