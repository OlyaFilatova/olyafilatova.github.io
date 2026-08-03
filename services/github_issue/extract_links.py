import re

def extract_links(body: str) -> list[str]:
  """This function assumes that line has only one link and the link is always last element of a text line."""
  pattern = r"(https?:\/\/.+)\n?"

  return [match.group(1) for match in re.finditer(pattern, body)]
