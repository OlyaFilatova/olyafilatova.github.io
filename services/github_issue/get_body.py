import requests


def get_issue_body(url: str, token: str) -> str:
  headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {token}",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  response = requests.get(url, headers=headers)

  return response.json().get("body")
