from __future__ import annotations

from typing import Any


def recommend_next_case(
    profile: dict[str, Any],
    cases: list[dict[str, Any]],
    current_case_id: str | None = None,
) -> dict[str, Any]:
    if not cases:
        return {}

    weak_abilities = set(profile.get("weak_abilities", []))
    recent_case_ids = set(profile.get("recent_case_ids", []))

    def available(case: dict[str, Any]) -> bool:
        return case.get("case_id") != current_case_id and case.get("case_id") not in recent_case_ids

    if "时间解析" in weak_abilities:
        for case in cases:
            if available(case) and case.get("start_time") and case.get("end_time"):
                return case

    if "地点/设施识别" in weak_abilities:
        for case in cases:
            if available(case) and case.get("object_type") in {"RWY", "TWY", "ILS", "PAPI"}:
                return case

    if "运行影响判断" in weak_abilities:
        for case in cases:
            if available(case) and case.get("status") in {"CLSD", "U/S", "ACT", "WIP"}:
                return case

    for case in cases:
        if available(case):
            return case
    for case in cases:
        if case.get("case_id") != current_case_id:
            return case
    return cases[0]
