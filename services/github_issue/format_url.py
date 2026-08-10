import re


def format_issue_url(original_url: str) -> str:
  pattern = r"https://github.com/([^/]+)/([^/]+)/issues/(.+)"

  match = re.search(pattern, original_url)
  if not match:
    raise Exception("Wrong url format.")

  owner = match.group(1)
  repo = match.group(2)
  issue_number = match.group(3)

  if not (owner and repo and issue_number):
    raise Exception("Wrong url format.")

  return f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
