from contextlib import contextmanager
from time import perf_counter


@contextmanager
def profile(name: str):
  start = perf_counter()
  try:
    yield
  finally:
    elapsed = perf_counter() - start
    if elapsed * 1000 > 1:
      print(f"{name}: {elapsed * 1000:.2f} ms")
