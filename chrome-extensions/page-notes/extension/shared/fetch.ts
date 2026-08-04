export async function fetchGithubIssueData(url: string) {
  const queryParams = new URLSearchParams({
    url
  });
  const response = await fetch(`http://localhost:8000/issue-links?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  return (await response.json())["links"] as Array<[string, string]>;
}
