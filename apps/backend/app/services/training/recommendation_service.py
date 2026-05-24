from __future__ import annotations

from typing import Any


ABILITY_FIELD_HINTS = {
    "时间解析": ("time", "date", "start", "end", "valid", "from", "to"),
    "地点/设施识别": ("airport", "runway", "taxiway", "light", "facility", "object", "location"),
    "运行影响判断": ("impact", "status", "unavailable", "downgrade", "closure"),
    "证据定位": ("evidence", "source", "reference", "desc"),
    "字段结构化": (),
    "格式识别": (),
    "缩写理解": (),
    "规则推理": (),
}


def _extract_field_names(gold_answer: dict[str, Any]) -> set[str]:
    field_names: set[str] = set()
    for unit in gold_answer.get("gold_answer_units", []):
        fields = unit.get("fields", {})
        if isinstance(fields, dict):
            field_names.update(fields.keys())
    return field_names


def recommend_next_cases(
    profile: dict[str, Any],
    cases: list[dict[str, Any]],
    gold_answers: dict[str, dict[str, Any]],
    recent_case_ids: list[str] | None = None,
    current_case_id: str | None = None,
    limit: int = 3,
) -> list[dict[str, Any]]:
    if not cases:
        return []

    recent_case_ids = recent_case_ids or []
    recent_set = set(recent_case_ids)
    weak_abilities = profile.get("weakest_abilities", [])
    recommended: list[dict[str, Any]] = []
    seen_case_ids: set[str] = set()

    def available(case: dict[str, Any]) -> bool:
        case_id = case.get("case_id")
        return bool(case_id) and case_id != current_case_id and case_id not in recent_set and case_id not in seen_case_ids

    for ability in weak_abilities:
        hints = ABILITY_FIELD_HINTS.get(ability, ())
        for case in cases:
            if not available(case):
                continue
            case_id = case.get("case_id")
            gold_answer = gold_answers.get(case_id, {})
            field_names = _extract_field_names(gold_answer)
            if hints and not any(any(hint in field.lower() for hint in hints) for field in field_names):
                continue
            candidate = dict(case)
            candidate["recommend_reason"] = f"针对薄弱能力“{ability}”的练习"
            recommended.append(candidate)
            seen_case_ids.add(case_id)
            break
        if len(recommended) >= limit:
            return recommended

    for case in cases:
        if not available(case):
            continue
        candidate = dict(case)
        candidate["recommend_reason"] = "继续扩大题型覆盖范围"
        recommended.append(candidate)
        seen_case_ids.add(case["case_id"])
        if len(recommended) >= limit:
            break

    return recommended
