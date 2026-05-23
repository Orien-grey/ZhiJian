from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


USER_RECORDS_PATH = Path(__file__).resolve().parent.parent / "data" / "user_records.json"
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


def _load_payload() -> dict[str, Any]:
    if not USER_RECORDS_PATH.exists():
        return {"users": {}}
    with USER_RECORDS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def _save_payload(payload: dict[str, Any]) -> None:
    with USER_RECORDS_PATH.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)


def append_user_record(user_id: str, record: dict[str, Any]) -> None:
    payload = _load_payload()
    users = payload.setdefault("users", {})
    user_bucket = users.setdefault(user_id, {"records": []})
    user_bucket.setdefault("records", []).append(record)
    _save_payload(payload)


def get_user_profile(user_id: str) -> dict[str, Any]:
    payload = _load_payload()
    records = payload.get("users", {}).get(user_id, {}).get("records", [])
    ability_counter: Counter[str] = Counter({ability: 0 for ability in ABILITY_DIMENSIONS})
    total_errors = 0

    for record in records:
        for error in record.get("grading", {}).get("errors", []):
            total_errors += 1
            for ability in error.get("abilities", []):
                ability_counter[ability] += 1

    return {
        "user_id": user_id,
        "records_count": len(records),
        "total_errors": total_errors,
        "ability_error_counts": dict(ability_counter),
        "weak_abilities": [ability for ability, count in ability_counter.most_common() if count > 0][:3],
        "recent_case_ids": [record.get("case_id") for record in records[-5:]],
    }
