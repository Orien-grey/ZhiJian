from __future__ import annotations

import re
from typing import Any


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

FIELD_WEIGHTS = {
    "airport": 15,
    "object_type": 15,
    "object_id": 10,
    "start_time": 10,
    "end_time": 10,
    "status": 15,
    "operational_impact": 15,
    "evidence": 10,
}

OBJECT_TYPE_SYNONYMS = {
    "RWY": {"RWY", "RUNWAY"},
    "TWY": {"TWY", "TAXIWAY"},
    "ILS": {"ILS"},
    "PAPI": {"PAPI"},
    "RESTRICTED_AREA": {"RESTRICTEDAREA", "RESTRICTED_AREA", "RESTRICTED AREA"},
    "APRON": {"APRON"},
}

STATUS_SYNONYMS = {
    "CLSD": {"CLSD", "CLOSED"},
    "U/S": {"U/S", "UNSERVICEABLE", "UNSERV"},
    "ACT": {"ACT", "ACTIVE"},
    "WIP": {"WIP", "WORK IN PROGRESS", "WORKINPROGRESS"},
}

IMPACT_KEYWORDS = {
    "CLSD": {"closed", "closure", "unavailable", "not available"},
    "U/S": {"unavailable", "unserviceable", "out of service", "not available"},
    "ACT": {"active", "avoid", "clearance", "restricted", "avoidance"},
    "WIP": {"caution", "work", "construction", "taxi", "care"},
}

ERROR_TO_ABILITY = {
    "MISSING_FIELD": ["字段结构化"],
    "VALUE_ERROR": ["缩写理解", "规则推理"],
    "TIME_FORMAT_ERROR": ["时间解析", "字段结构化"],
    "OBJECT_CONFUSION": ["地点/设施识别"],
    "IMPACT_ERROR": ["运行影响判断", "规则推理"],
    "EVIDENCE_MISSING": ["证据定位"],
    "FORMAT_ERROR": ["格式识别", "字段结构化"],
}


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().upper()


def _normalize_compact(value: Any) -> str:
    return re.sub(r"\s+", "", _normalize_text(value))


def _normalize_object_type(value: Any) -> str:
    compact = _normalize_compact(value)
    for canonical, synonyms in OBJECT_TYPE_SYNONYMS.items():
        normalized_synonyms = {re.sub(r"\s+", "", item.upper()) for item in synonyms}
        if compact in normalized_synonyms:
            return canonical
    return compact


def _normalize_status(value: Any) -> str:
    compact = _normalize_compact(value)
    for canonical, synonyms in STATUS_SYNONYMS.items():
        normalized_synonyms = {re.sub(r"\s+", "", item.upper()) for item in synonyms}
        if compact in normalized_synonyms:
            return canonical
    return compact


def _normalize_object_id(value: Any) -> str:
    text = _normalize_text(value)
    text = re.sub(r"\s+", " ", text)
    return text.replace("RUNWAY", "RWY").replace("TAXIWAY", "TWY")


def _is_valid_notam_time(value: Any) -> bool:
    text = _normalize_text(value)
    return text == "PERM" or bool(re.fullmatch(r"\d{10}", text))


def _impact_matches(student_value: Any, status_value: Any) -> bool:
    text = str(student_value or "").lower()
    status = _normalize_status(status_value)
    return any(keyword in text for keyword in IMPACT_KEYWORDS.get(status, set()))


def _add_error(
    errors: list[dict[str, Any]],
    error_type: str,
    field: str,
    message: str,
    expected: Any = None,
    actual: Any = None,
) -> None:
    errors.append(
        {
            "error_type": error_type,
            "field": field,
            "message": message,
            "expected": expected,
            "actual": actual,
            "abilities": ERROR_TO_ABILITY.get(error_type, []),
        }
    )


def grade_answer(student_answer: dict[str, Any], gold_answer: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(student_answer, dict):
        errors: list[dict[str, Any]] = []
        _add_error(errors, "FORMAT_ERROR", "student_answer", "Student answer must be a JSON object.", actual=student_answer)
        return {
            "total_score": 0,
            "field_scores": {field: 0 for field in FIELD_WEIGHTS},
            "errors": errors,
            "feedback": ["答案格式错误：需要按约定 schema 提交结构化字段。"],
            "ability_dimensions": ABILITY_DIMENSIONS,
        }

    field_scores: dict[str, int] = {field: 0 for field in FIELD_WEIGHTS}
    errors: list[dict[str, Any]] = []

    if not student_answer.get("airport"):
        _add_error(errors, "MISSING_FIELD", "airport", "Airport is required.", expected=gold_answer.get("airport"))
    elif _normalize_text(student_answer.get("airport")) == _normalize_text(gold_answer.get("airport")):
        field_scores["airport"] = FIELD_WEIGHTS["airport"]
    else:
        _add_error(errors, "VALUE_ERROR", "airport", "Airport does not match.", gold_answer.get("airport"), student_answer.get("airport"))

    if not student_answer.get("object_type"):
        _add_error(errors, "MISSING_FIELD", "object_type", "Object type is required.", expected=gold_answer.get("object_type"))
    elif _normalize_object_type(student_answer.get("object_type")) == _normalize_object_type(gold_answer.get("object_type")):
        field_scores["object_type"] = FIELD_WEIGHTS["object_type"]
    else:
        _add_error(errors, "OBJECT_CONFUSION", "object_type", "Object type does not match.", gold_answer.get("object_type"), student_answer.get("object_type"))

    if not student_answer.get("object_id"):
        _add_error(errors, "MISSING_FIELD", "object_id", "Object ID is required.", expected=gold_answer.get("object_id"))
    elif _normalize_object_id(student_answer.get("object_id")) == _normalize_object_id(gold_answer.get("object_id")):
        field_scores["object_id"] = FIELD_WEIGHTS["object_id"]
    else:
        _add_error(errors, "VALUE_ERROR", "object_id", "Object ID does not match.", gold_answer.get("object_id"), student_answer.get("object_id"))

    for field_name in ("start_time", "end_time"):
        value = student_answer.get(field_name)
        if not value:
            _add_error(errors, "MISSING_FIELD", field_name, f"{field_name} is required.", expected=gold_answer.get(field_name))
        elif not _is_valid_notam_time(value):
            _add_error(errors, "TIME_FORMAT_ERROR", field_name, f"{field_name} has invalid format.", gold_answer.get(field_name), value)
        elif _normalize_text(value) == _normalize_text(gold_answer.get(field_name)):
            field_scores[field_name] = FIELD_WEIGHTS[field_name]
        else:
            _add_error(errors, "VALUE_ERROR", field_name, f"{field_name} does not match.", gold_answer.get(field_name), value)

    if not student_answer.get("status"):
        _add_error(errors, "MISSING_FIELD", "status", "Status is required.", expected=gold_answer.get("status"))
    elif _normalize_status(student_answer.get("status")) == _normalize_status(gold_answer.get("status")):
        field_scores["status"] = FIELD_WEIGHTS["status"]
    else:
        _add_error(errors, "VALUE_ERROR", "status", "Status does not match.", gold_answer.get("status"), student_answer.get("status"))

    if not student_answer.get("operational_impact"):
        _add_error(errors, "MISSING_FIELD", "operational_impact", "Operational impact is required.", expected=gold_answer.get("operational_impact"))
    elif _impact_matches(student_answer.get("operational_impact"), gold_answer.get("status")):
        field_scores["operational_impact"] = FIELD_WEIGHTS["operational_impact"]
    else:
        _add_error(
            errors,
            "IMPACT_ERROR",
            "operational_impact",
            "Operational impact misses the key implication of the NOTAM.",
            gold_answer.get("operational_impact"),
            student_answer.get("operational_impact"),
        )

    evidence = student_answer.get("evidence")
    if not isinstance(evidence, list):
        _add_error(errors, "FORMAT_ERROR", "evidence", "Evidence must be an array.", expected=gold_answer.get("evidence"), actual=evidence)
    elif len([item for item in evidence if str(item).strip()]) == 0:
        _add_error(errors, "EVIDENCE_MISSING", "evidence", "Evidence array is empty.", expected=gold_answer.get("evidence"), actual=evidence)
    else:
        field_scores["evidence"] = FIELD_WEIGHTS["evidence"]

    feedback: list[str] = []
    if any(error["field"] in {"start_time", "end_time"} for error in errors):
        feedback.append("时间字段仍有缺失或格式问题。")
    if any(error["field"] in {"airport", "object_type", "object_id"} for error in errors):
        feedback.append("地点/设施识别存在偏差。")
    if any(error["field"] == "status" for error in errors):
        feedback.append("状态缩写理解需要加强。")
    if any(error["field"] == "operational_impact" for error in errors):
        feedback.append("运行影响判断仍需加强。")
    if any(error["field"] == "evidence" for error in errors):
        feedback.append("请补充可追溯的证据短语。")
    if not feedback:
        feedback.append("字段抽取完整，规则判定正确。")

    return {
        "total_score": sum(field_scores.values()),
        "field_scores": field_scores,
        "errors": errors,
        "feedback": feedback,
        "ability_dimensions": ABILITY_DIMENSIONS,
    }
