from __future__ import annotations

import json
from pathlib import Path
from typing import Any


USER_RECORDS_PATH = Path(__file__).resolve().parents[2] / "data" / "user_records.json"
ABILITY_DIMENSIONS = [
    "格式识别",
    "时间解析",
    "地点/设施识别",
    "缩写理解",
    "字段结构化",
    "规则推理",
    "运行影响判断",
    "证据定位",
]


def _default_payload() -> dict[str, Any]:
    return {"users": {}}


def _load_payload() -> dict[str, Any]:
    if not USER_RECORDS_PATH.exists():
        return _default_payload()
    with USER_RECORDS_PATH.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    if not isinstance(payload, dict):
        return _default_payload()
    payload.setdefault("users", {})
    return payload


def _save_payload(payload: dict[str, Any]) -> None:
    USER_RECORDS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with USER_RECORDS_PATH.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)


def _normalize_user_bucket(payload: dict[str, Any], user_id: str) -> list[dict[str, Any]]:
    users = payload.setdefault("users", {})
    bucket = users.get(user_id, [])
    if isinstance(bucket, list):
        return bucket
    if isinstance(bucket, dict):
        records = bucket.get("records", [])
        if isinstance(records, list):
            return records
    return []


def _set_user_records(payload: dict[str, Any], user_id: str, records: list[dict[str, Any]]) -> None:
    payload.setdefault("users", {})[user_id] = records


def get_user_records(user_id: str) -> list[dict[str, Any]]:
    payload = _load_payload()
    return list(_normalize_user_bucket(payload, user_id))


def _record_sort_key(record: dict[str, Any], index: int) -> tuple[str, int]:
    created_at = str(record.get("created_at") or "")
    return created_at, index


def get_latest_records_by_case(user_id: str) -> list[dict[str, Any]]:
    latest_by_case: dict[str, tuple[tuple[str, int], dict[str, Any]]] = {}
    for index, record in enumerate(get_user_records(user_id)):
        case_id = record.get("case_id")
        if not case_id:
            continue
        sort_key = _record_sort_key(record, index)
        existing = latest_by_case.get(case_id)
        if existing is None or sort_key >= existing[0]:
            latest_by_case[case_id] = (sort_key, record)
    latest_records = [item[1] for item in latest_by_case.values()]
    latest_records.sort(key=lambda item: str(item.get("created_at") or ""), reverse=True)
    return latest_records


def get_answered_case_ids(user_id: str) -> set[str]:
    return {record.get("case_id") for record in get_latest_records_by_case(user_id) if record.get("case_id")}


def upsert_user_record(user_id: str, record: dict[str, Any]) -> dict[str, Any]:
    payload = _load_payload()
    records = list(_normalize_user_bucket(payload, user_id))
    case_id = record.get("case_id")
    replaced = False

    if case_id:
        for index, existing in enumerate(records):
            if existing.get("case_id") == case_id:
                records[index] = record
                replaced = True
                break

    if not replaced:
        records.append(record)

    _set_user_records(payload, user_id, records)
    _save_payload(payload)
    return record


def get_progress_snapshot(user_id: str, total_cases: int) -> dict[str, Any]:
    records = get_latest_records_by_case(user_id)
    if not records:
        return {
            "total_cases": total_cases,
            "answered_count": 0,
            "correct_count": 0,
            "mistake_count": 0,
            "average_score": 0,
            "latest_score": None,
        }

    scores = [int(record.get("score", 0)) for record in records]
    correct_count = sum(
        1
        for record in records
        if int(record.get("score", 0)) >= 100 and len(record.get("errors", [])) == 0
    )
    mistake_count = sum(
        1
        for record in records
        if int(record.get("score", 0)) < 100 or len(record.get("errors", [])) > 0
    )
    latest_record = max(
        enumerate(records),
        key=lambda item: _record_sort_key(item[1], item[0]),
    )[1]
    return {
        "total_cases": total_cases,
        "answered_count": len(records),
        "correct_count": correct_count,
        "mistake_count": mistake_count,
        "average_score": round(sum(scores) / len(scores), 2),
        "latest_score": int(latest_record.get("score", 0)),
    }


def _mastery_level(mastery: float, has_records: bool) -> str:
    if not has_records:
        return "暂无数据"
    if mastery >= 0.85:
        return "熟练掌握"
    if mastery >= 0.7:
        return "基本掌握"
    if mastery >= 0.5:
        return "需要巩固"
    return "薄弱"


def get_user_profile(user_id: str) -> dict[str, Any]:
    records = get_latest_records_by_case(user_id)
    answered_count = len(records)
    error_counts = {ability: 0 for ability in ABILITY_DIMENSIONS}

    for record in records:
        for error in record.get("errors", []):
            ability = error.get("ability")
            if ability in error_counts:
                error_counts[ability] += 1

    abilities = []
    for ability in ABILITY_DIMENSIONS:
        mastery = 1.0 if answered_count == 0 else max(0.0, 1 - (error_counts[ability] / answered_count))
        abilities.append(
            {
                "ability": ability,
                "mastery": round(mastery, 2),
                "level": _mastery_level(mastery, answered_count > 0),
                "error_count": error_counts[ability],
            }
        )

    weakest = [
        item["ability"]
        for item in sorted(abilities, key=lambda item: (-item["error_count"], item["mastery"], item["ability"]))
        if item["error_count"] > 0
    ][:2]

    return {
        "abilities": abilities,
        "weakest_abilities": weakest,
        "recommended_cases": [],
    }
