from __future__ import annotations

import json
from pathlib import Path
from typing import Any


KNOWLEDGE_CARDS_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_cards.json"


def retrieve_knowledge_cards(errors: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not errors:
        return []

    with KNOWLEDGE_CARDS_PATH.open("r", encoding="utf-8") as file:
        cards: list[dict[str, Any]] = json.load(file)

    matches: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for error in errors:
        abilities = set(error.get("abilities", []))
        for card in cards:
            tags = set(card.get("tags", []))
            if (
                card.get("error_type") == error.get("error_type")
                or card.get("field") == error.get("field")
                or error.get("field") in tags
                or bool(abilities.intersection(tags))
            ):
                card_id = card.get("card_id")
                if card_id and card_id not in seen_ids:
                    matches.append(card)
                    seen_ids.add(card_id)
    return matches[:5]
