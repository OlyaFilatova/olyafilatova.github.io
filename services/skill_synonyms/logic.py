from dataclasses import dataclass
import re
import unicodedata

from .generated.skills_models import SkillWithSynonyms


@dataclass
class SynonymSkill:
  normalized_text: str
  display_text: str
  match_texts: list[str]


@dataclass
class SynonymGroup:
  id: str
  skills: list[SynonymSkill]
  score: float


SIMILARITY_THRESHOLD = 0.95


def calculate_suggested_synonym_groups(
  aggregates: list[SkillWithSynonyms], ignored_suggested_group_ids: list[str]
) -> list[SynonymGroup]:
  skills = [
    SynonymSkill(
      normalized_text=aggregate.originNormalizedText,
      display_text=aggregate.displayText,
      match_texts=get_suggested_synonym_match_texts(aggregate.displayText, aggregate.synonymTexts),
    )
    for aggregate in aggregates
  ]

  pair_scores: dict[str, float] = {}

  for outer_index in range(len(skills)):
    for inner_index in range(outer_index + 1, len(skills)):
      first = skills[outer_index]
      second = skills[inner_index]
      score = get_skill_similarity_score(first, second)

      if score > 0:
        pair_scores[pair_key(first.normalized_text, second.normalized_text)] = score

  candidate_groups: list[list[SynonymSkill]] = []

  for outer_index in range(len(skills)):
    for inner_index in range(outer_index + 1, len(skills)):
      first = skills[outer_index]
      second = skills[inner_index]

      if pair_key(first.normalized_text, second.normalized_text) not in pair_scores:
        continue

      group = [first, second]

      for candidate in skills:
        if any(skill.normalized_text == candidate.normalized_text for skill in group):
          continue

        if all(
          pair_key(skill.normalized_text, candidate.normalized_text) in pair_scores
          for skill in group
        ):
          group.append(candidate)

      candidate_groups.append(sorted(group, key=lambda skill: skill.display_text))

  groups = [
    SynonymGroup(
      id=group_key(group),
      skills=group,
      score=get_suggested_synonym_group_score(group, pair_scores),
    )
    for group in get_maximal_groups(candidate_groups)
    if group_key(group) not in ignored_suggested_group_ids
  ]

  return sorted(
    groups,
    key=lambda group: (
      -group.score,
      group.skills[0].display_text if group.skills else "",
    ),
  )


### =======================================================


def get_maximal_groups(
  groups: list[list[SynonymSkill]],
) -> list[list[SynonymSkill]]:
  unique_groups: list[list[SynonymSkill]] = []

  for group in groups:
    if not has_existing_group(group, unique_groups):
      unique_groups.append(group)

  return [
    group
    for group in unique_groups
    if not any(is_subset_of_group(group, other) for other in unique_groups)
  ]


def get_suggested_synonym_group_score(
  group: list[SynonymSkill],
  pair_scores: dict[str, float],
) -> float:
  score = 0.0

  for outer_index in range(len(group)):
    for inner_index in range(outer_index + 1, len(group)):
      score = max(
        score,
        pair_scores.get(
          pair_key(
            group[outer_index].normalized_text,
            group[inner_index].normalized_text,
          ),
          0.0,
        ),
      )

  return score


def get_suggested_synonym_match_texts(display_text: str, synonym_texts: list[str]) -> list[str]:
  values = [display_text, *synonym_texts]
  return list(dict.fromkeys(text.strip() for text in values if text.strip()))


def get_skill_similarity_score(
  first: SynonymSkill,
  second: SynonymSkill,
) -> float:
  score = 0.0

  for first_text in first.match_texts:
    for second_text in second.match_texts:
      score = max(
        score,
        get_skill_name_similarity_score(first_text, second_text),
      )

  return score


def is_subset_of_group(
  group: list[SynonymSkill],
  other: list[SynonymSkill],
) -> bool:
  if len(other) <= len(group):
    return False

  other_texts = {skill.normalized_text for skill in other}
  return all(skill.normalized_text in other_texts for skill in group)


def has_existing_group(
  group: list[SynonymSkill],
  groups: list[list[SynonymSkill]],
) -> bool:
  key = group_key(group)
  return any(group_key(existing_group) == key for existing_group in groups)


def group_key(group: list[SynonymSkill]) -> str:
  return "|".join(sorted(skill.normalized_text for skill in group))


def get_skill_name_similarity_score(first: str, second: str) -> float:
  comparable_first = normalize_comparable_skill_name(first)
  comparable_second = normalize_comparable_skill_name(second)

  if not comparable_first["compact"] or not comparable_second["compact"]:
    return 0

  if (
    text_similarity(
      comparable_first["compact"],
      comparable_second["compact"],
    )
    >= SIMILARITY_THRESHOLD
  ):
    return 3

  if text_includes_text(comparable_first, comparable_second):
    return 2

  return (
    1
    if is_abbreviation_of(comparable_first, comparable_second)
    or is_abbreviation_of(comparable_second, comparable_first)
    else 0
  )


def normalize_comparable_skill_name(text: str) -> dict:
  transliterated = transliterate_cyrillic(text)
  transliterated = unicodedata.normalize("NFD", transliterated)
  transliterated = re.sub(r"[\u0300-\u036f]", "", transliterated)

  # Split camelCase/PascalCase and then on non-alphanumeric characters.
  spaced = re.sub(r"([a-z])([A-Z])", r"\1 \2", transliterated)
  words = [word for word in re.split(r"[^A-Za-z0-9]+", spaced) if word]
  compact = "".join(words).lower()

  abbreviations: set[str] = set()

  if len(words) > 1:
    abbreviations.add("".join(word[0] for word in words).lower())

  uppercase_abbreviation = re.sub(r"[^A-Z0-9]", "", transliterated).lower()
  if len(uppercase_abbreviation) > 1:
    abbreviations.add(uppercase_abbreviation)

  alpha_text = re.sub(r"[^A-Za-z]", "", transliterated)
  is_acronym_like = len(alpha_text) > 1 and alpha_text == alpha_text.upper()

  return {
    "compact": compact,
    "words": [word.lower() for word in words],
    "abbreviations": list(abbreviations),
    "is_acronym_like": is_acronym_like,
  }


def pair_key(first: str, second: str) -> str:
  return "|".join(sorted((first, second)))


def text_includes_text(first: dict, second: dict) -> bool:
  return word_sequence_includes(first, second) or word_sequence_includes(second, first)


def word_sequence_includes(maybe_longer: dict, maybe_shorter: dict) -> bool:
  longer_words = maybe_longer["words"]
  shorter_words = maybe_shorter["words"]

  if not shorter_words or len(shorter_words) > len(longer_words):
    return False

  if len(shorter_words) == 1:
    short_word = shorter_words[0]

    if len(short_word) <= 2:
      if len(short_word) == 1:
        return False

      return not maybe_shorter["is_acronym_like"] and any(
        word.startswith(short_word) for word in longer_words
      )

  for index in range(len(longer_words) - len(shorter_words) + 1):
    if all(
      longer_words[index + offset] == short_word for offset, short_word in enumerate(shorter_words)
    ):
      return True

  return False


def text_similarity(first: str, second: str) -> float:
  max_length = max(len(first), len(second))

  if max_length == 0:
    return 1.0

  return (max_length - levenshtein_distance(first, second)) / max_length


def levenshtein_distance(first: str, second: str) -> int:
  previous = list(range(len(second) + 1))

  for first_index, first_char in enumerate(first, start=1):
    current = [first_index]

    for second_index, second_char in enumerate(second, start=1):
      substitution_cost = 0 if first_char == second_char else 1

      current.append(
        min(
          current[second_index - 1] + 1,
          previous[second_index] + 1,
          previous[second_index - 1] + substitution_cost,
        )
      )

    previous = current

  return previous[-1]


def is_abbreviation_of(
  possible_abbreviation: dict,
  possible_full_name: dict,
) -> bool:
  compact = possible_abbreviation["compact"]
  return len(compact) > 1 and compact in possible_full_name["abbreviations"]


CYRILLIC_TRANSLITERATION = {
  "а": "a",
  "б": "b",
  "в": "v",
  "г": "h",
  "ґ": "g",
  "д": "d",
  "е": "e",
  "є": "ie",
  "ж": "zh",
  "з": "z",
  "и": "y",
  "і": "i",
  "ї": "i",
  "й": "i",
  "к": "k",
  "л": "l",
  "м": "m",
  "н": "n",
  "о": "o",
  "п": "p",
  "р": "r",
  "с": "s",
  "т": "t",
  "у": "u",
  "ф": "f",
  "х": "kh",
  "ц": "ts",
  "ч": "ch",
  "ш": "sh",
  "щ": "shch",
  "ь": "",
  "ю": "iu",
  "я": "ia",
}


def transliterate_cyrillic(text: str) -> str:
  result: list[str] = []

  for character in text:
    lower = character.lower()
    transliterated = CYRILLIC_TRANSLITERATION.get(lower)

    if transliterated is None:
      result.append(character)
      continue

    result.append(transliterated if character == lower else capitalize(transliterated))

  return "".join(result)


def capitalize(text: str) -> str:
  return text[:1].upper() + text[1:]
