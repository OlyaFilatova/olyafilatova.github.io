# Pytools

format_notes.py script is used to format and translate notes created by chrome extension "Page notes" (chrome-extensions/page-notes)

- The script uses "translate" service. Start the service using command `docker compose up translate`.
- Put notes.json file exported from the extension into the ./notes folder.
- Make sure dependencies have been installed.
- run `python format_notes.py`.