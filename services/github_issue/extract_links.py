import re
from enum import Enum


class Status(Enum):
  PLANNED = " "
  DONE = "x"


def extract_links(body: str) -> list[tuple[str, str]]:
  """This function assumes that line has only one link
  and the link is always last element of a text line."""
  pattern = r"- \[([ x])\].+(https?:\/\/.+)\n?"

  return [(Status(match.group(1)).name, match.group(2)) for match in re.finditer(pattern, body)]
