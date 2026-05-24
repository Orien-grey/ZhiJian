from __future__ import annotations

import re
from typing import Any


ABILITY_FORMAT = "格式识别"
ABILITY_TIME = "时间解析"
ABILITY_OBJECT = "地点/设施识别"
ABILITY_STRUCTURE = "字段结构化"
ABILITY_IMPACT = "运行影响判断"
ABILITY_EVIDENCE = "证据定位"

ERROR_TO_ABILITY = {
    "MISSING_FIELD": ABILITY_STRUCTURE,
    "VALUE_ERROR": ABILITY_STRUCTURE,
    "TIME_FORMAT_ERROR": ABILITY_TIME,
    "OBJECT_CONFUSION": ABILITY_OBJECT,
    "IMPACT_ERROR": ABILITY_IMPACT,
    "EVIDENCE_MISSING": ABILITY_EVIDENCE,
    "FORMAT_ERROR": ABILITY_FORMAT,
}

TIME_FIELD_HINTS = ("time", "date", "start", "end", "valid", "from", "to")
OBJECT_FIELD_HINTS = ("airport", "runway", "taxiway", "light", "facility", "object", "location")
IMPACT_FIELD_HINTS = ("impact", "status", "effect", "unavailable", "downgrade", "closure")
EVIDENCE_FIELD_HINTS = ("evidence", "source", "reference", "desc")


def _normalize_scalar(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return value
    compact = re.sub(r"\s+", " ", str(value).strip())
    return compact.upper()


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, list):
        return len(value) == 0
    return False


def _is_time_field(field_name: str) -> bool:
    lowered = field_name.lower()
    return any(hint in lowered for hint in TIME_FIELD_HINTS)


def _guess_error_type(field_name: str, student_value: Any, gold_value: Any) -> str:
    lowered = field_name.lower()
    if _is_time_field(field_name):
        if isinstance(student_value, str) and student_value.strip():
            candidate = student_value.strip().upper()
            if not re.fullmatch(r"\d{10}|PERM", candidate):
                return "TIME_FORMAT_ERROR"
        return "VALUE_ERROR"
    if any(hint in lowered for hint in OBJECT_FIELD_HINTS):
        return "OBJECT_CONFUSION"
    if any(hint in lowered for hint in IMPACT_FIELD_HINTS):
        return "IMPACT_ERROR"
    if any(hint in lowered for hint in EVIDENCE_FIELD_HINTS):
        return "EVIDENCE_MISSING"
    if isinstance(gold_value, (dict, list)) or isinstance(student_value, (dict, list)):
        return "FORMAT_ERROR"
    return "VALUE_ERROR"


def _build_field_result(
    field: str,
    student_value: Any,
    gold_value: Any,
    is_correct: bool,
    error_type: str | None = None,
    message: str | None = None,
) -> dict[str, Any]:
    return {
        "field": field,
        "student_value": student_value,
        "gold_value": gold_value,
        "score": 100 if is_correct else 0,
        "is_correct": is_correct,
        "error_type": error_type,
        "message": message or ("Correct" if is_correct else "Value does not match the gold answer"),
    }


def _build_error(field: str, error_type: str, message: str) -> dict[str, Any]:
    return {
        "field": field,
        "error_type": error_type,
        "message": message,
        "ability": ERROR_TO_ABILITY.get(error_type),
    }


def _summary_from_score(score: int, errors: list[dict[str, Any]]) -> dict[str, Any]:
    if score >= 95:
        level = "excellent"
        message = "The answer is almost fully correct."
    elif score >= 80:
        level = "good"
        message = "The answer is mostly correct with a few issues."
    elif score >= 60:
        level = "partial"
        message = "The answer is partially correct and needs revision."
    else:
        level = "weak"
        message = "The answer differs significantly from the gold answer."

    related_abilities = sorted({error["ability"] for error in errors if error.get("ability")})
    return {
        "level": level,
        "message": message,
        "error_count": len(errors),
        "related_abilities": related_abilities,
    }


def _feedback_from_errors(errors: list[dict[str, Any]]) -> tuple[list[str], list[str]]:
    if not errors:
        return (
            ["Field extraction is complete and matches the gold answer."],
            ["Move to the next case to broaden coverage."],
        )

    feedback: list[str] = []
    suggestions: list[str] = []
    error_types = {error["error_type"] for error in errors}

    if "TIME_FORMAT_ERROR" in error_types:
        feedback.append("Time fields contain formatting issues.")
        suggestions.append("Normalize time values to YYMMDDHHMM or PERM before submitting.")
    if "OBJECT_CONFUSION" in error_types:
        feedback.append("Location or facility recognition is unstable.")
        suggestions.append("Anchor the airport and facility first, then decide the status.")
    if "IMPACT_ERROR" in error_types:
        feedback.append("Operational impact judgment is inaccurate.")
        suggestions.append("Read status words and impact words together before structuring the answer.")
    if "EVIDENCE_MISSING" in error_types:
        feedback.append("Evidence is missing or cannot support the submitted answer.")
        suggestions.append("Add direct text snippets that support the extracted fields.")
    if "MISSING_FIELD" in error_types:
        feedback.append("Some required fields are empty or missing.")
        suggestions.append("Check each field before submitting.")
    if not feedback:
        feedback.append("Some field values still differ from the gold answer.")
    if not suggestions:
        suggestions.append("Revise the incorrect fields and submit again.")
    return feedback, suggestions


def grade_answer(
    student_answer_units: list[dict[str, Any]],
    gold_answer_units: list[dict[str, Any]],
) -> dict[str, Any]:
    if not isinstance(student_answer_units, list):
        errors = [
            _build_error(
                "student_answer_units",
                "FORMAT_ERROR",
                "student_answer_units must be a list.",
            )
        ]
        summary = _summary_from_score(0, errors)
        feedback, suggestions = _feedback_from_errors(errors)
        return {
            "case_id": "",
            "total_score": 0,
            "summary": summary,
            "unit_results": [],
            "errors": errors,
            "feedback": feedback,
            "suggestions": suggestions,
            "student_answer_units": [],
            "gold_answer_units": gold_answer_units or [],
        }

    unit_results: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    total_fields = 0
    correct_fields = 0
    max_len = max(len(student_answer_units), len(gold_answer_units))

    for index in range(max_len):
        student_unit = student_answer_units[index] if index < len(student_answer_units) else None
        gold_unit = gold_answer_units[index] if index < len(gold_answer_units) else None
        unit_id = (student_unit or {}).get("unit_id") or (gold_unit or {}).get("unit_id") or f"unit_{index}"
        field_results: list[dict[str, Any]] = []

        student_fields = (student_unit or {}).get("fields", {})
        gold_fields = (gold_unit or {}).get("fields", {})
        field_names = list(dict.fromkeys([*gold_fields.keys(), *student_fields.keys()]))

        if not field_names and (student_unit or gold_unit):
            field_names = ["fields"]

        for field_name in field_names:
            total_fields += 1
            student_value = student_fields.get(field_name) if isinstance(student_fields, dict) else None
            gold_value = gold_fields.get(field_name) if isinstance(gold_fields, dict) else None

            if gold_unit is None:
                error_type = "FORMAT_ERROR"
                message = "Submitted answer has more units than the gold answer."
                field_results.append(
                    _build_field_result(field_name, student_value, None, False, error_type, message)
                )
                errors.append(_build_error(field_name, error_type, message))
                continue

            if _is_empty(student_value):
                error_type = "MISSING_FIELD"
                message = "The field is missing or empty."
                field_results.append(
                    _build_field_result(field_name, student_value, gold_value, False, error_type, message)
                )
                errors.append(_build_error(field_name, error_type, message))
                continue

            if _normalize_scalar(student_value) == _normalize_scalar(gold_value):
                correct_fields += 1
                field_results.append(_build_field_result(field_name, student_value, gold_value, True))
                continue

            error_type = _guess_error_type(field_name, student_value, gold_value)
            message = "Value does not match the gold answer."
            if error_type == "TIME_FORMAT_ERROR":
                message = "Time field format is invalid or does not match the gold answer."
            elif error_type == "OBJECT_CONFUSION":
                message = "Location or facility field is incorrect."
            elif error_type == "IMPACT_ERROR":
                message = "Operational impact field is incorrect."
            elif error_type == "EVIDENCE_MISSING":
                message = "Evidence field is missing or unsupported."
            elif error_type == "FORMAT_ERROR":
                message = "Field format does not match the gold answer."

            field_results.append(
                _build_field_result(field_name, student_value, gold_value, False, error_type, message)
            )
            errors.append(_build_error(field_name, error_type, message))

        unit_results.append({"unit_id": unit_id, "field_results": field_results})

    total_score = 0 if total_fields == 0 else round((correct_fields / total_fields) * 100)
    summary = _summary_from_score(total_score, errors)
    feedback, suggestions = _feedback_from_errors(errors)

    return {
        "case_id": "",
        "total_score": total_score,
        "summary": summary,
        "unit_results": unit_results,
        "errors": errors,
        "feedback": feedback,
        "suggestions": suggestions,
        "student_answer_units": student_answer_units,
        "gold_answer_units": gold_answer_units,
    }
