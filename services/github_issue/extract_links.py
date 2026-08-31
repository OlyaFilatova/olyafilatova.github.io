import re
from enum import Enum


class Status(Enum):
  PLANNED = " "
  DONE = "x"
  CANCELLED = "~"

def get_match_status(match: re.Match[str]) -> Status:
  if re.search(r"~+.+~+", match.group(0)):
    return Status.CANCELLED

  return Status(match.group(1))


def extract_links(body: str) -> list[tuple[str, str]]:
  """This function assumes that line has only one link
  and the link is always last element of a text line."""
  pattern = r"- \[([ x])\].+(~*https?:\/\/.+~*)\n?"

  return [(get_match_status(match).name, match.group(2).replace('~', '')) for match in re.finditer(pattern, body)]
