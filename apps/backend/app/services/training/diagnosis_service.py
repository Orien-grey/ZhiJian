from __future__ import annotations

import json
import re
from typing import Any


ABILITY_FORMAT = "格式识别"
ABILITY_TIME = "时间解析"
ABILITY_OBJECT = "地点/设施识别"
ABILITY_ABBREVIATION = "缩写理解"
ABILITY_STRUCTURE = "字段结构化"
ABILITY_REASONING = "规则推理"
ABILITY_IMPACT = "运行影响判断"
ABILITY_EVIDENCE = "证据定位"

TIME_FIELD_HINTS = ("time", "date", "start", "end", "valid", "from", "to")
OBJECT_FIELD_HINTS = ("airport", "runway", "taxiway", "light", "facility", "object", "location")
IMPACT_FIELD_HINTS = ("impact", "status", "effect", "unavailable", "downgrade", "closure")
EVIDENCE_FIELD_HINTS = ("evidence", "source", "reference", "desc")

DIAGNOSIS_RULES = (
    (
        "TIME_FORMAT_ERROR",
        ABILITY_TIME,
        "时间字段与标准答案不一致，可能存在时间格式或时间解析错误。",
        "优先核对生效时间、失效时间、有效期等字段，并统一成题目要求的时间表达。",
    ),
    (
        "OBJECT_CONFUSION",
        ABILITY_OBJECT,
        "地点或设施字段与标准答案不一致，可能存在设施对象混淆。",
        "先定位 RWY/TWY/ALS 等设施缩写，再填写结构化字段。",
    ),
    (
        "IMPACT_ERROR",
        ABILITY_IMPACT,
        "运行影响字段与标准答案不一致，可能存在影响范围或状态判断错误。",
        "先识别关闭、降级、不可用等状态词，再判断对运行的具体影响。",
    ),
    (
        "EVIDENCE_MISSING",
        ABILITY_EVIDENCE,
        "证据相关字段与标准答案不一致，说明证据定位或引用不足。",
        "回到原文定位支持该字段的关键词或原句，再补全结构化答案。",
    ),
    (
        "MISSING_FIELD",
        ABILITY_STRUCTURE,
        "该字段为空或缺失，说明结构化抽取不完整。",
        "逐字段检查必填项，避免遗漏标准答案中已有的信息。",
    ),
    (
        "VALUE_ERROR",
        ABILITY_STRUCTURE,
        "该字段与标准答案不一致，说明结构化结果仍需修正。",
        "按字段逐项对照标准答案，优先修正值不一致的核心字段。",
    ),
)


def _normalize_scalar(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, sort_keys=True)
    return re.sub(r"\s+", " ", str(value).strip()).upper()


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, list):
        return len(value) == 0
    return False


def _rule_from_field(field_name: str, student_value: Any) -> tuple[str, str, str, str]:
    lowered = field_name.lower()
    if _is_empty(student_value):
        return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "MISSING_FIELD")
    if any(hint in lowered for hint in TIME_FIELD_HINTS):
        return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "TIME_FORMAT_ERROR")
    if any(hint in lowered for hint in OBJECT_FIELD_HINTS):
        return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "OBJECT_CONFUSION")
    if any(hint in lowered for hint in IMPACT_FIELD_HINTS):
        return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "IMPACT_ERROR")
    if any(hint in lowered for hint in EVIDENCE_FIELD_HINTS):
        return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "EVIDENCE_MISSING")
    return next(rule for rule in DIAGNOSIS_RULES if rule[0] == "VALUE_ERROR")


def _build_summary(diagnosis_items: list[dict[str, Any]]) -> str:
    if not diagnosis_items:
        return "本题答案与标准答案基本一致，未识别到明显错因。"
    top_ability = diagnosis_items[0].get("ability") or ABILITY_STRUCTURE
    return f"本题主要问题集中在{top_ability}。"


def diagnose_answer(
    case: dict[str, Any],
    student_answer_units: list[dict[str, Any]],
    gold_answer_units: list[dict[str, Any]],
) -> dict[str, Any]:
    del case

    diagnosis_items: list[dict[str, Any]] = []
    weak_abilities: list[str] = []
    suggestions: list[str] = []
    seen_keys: set[tuple[str, str]] = set()
    max_len = max(len(student_answer_units or []), len(gold_answer_units or []))

    for index in range(max_len):
        student_unit = student_answer_units[index] if index < len(student_answer_units) else {}
        gold_unit = gold_answer_units[index] if index < len(gold_answer_units) else {}
        student_fields = student_unit.get("fields", {}) if isinstance(student_unit, dict) else {}
        gold_fields = gold_unit.get("fields", {}) if isinstance(gold_unit, dict) else {}
        field_names = list(dict.fromkeys([*gold_fields.keys(), *student_fields.keys()]))

        for field_name in field_names:
            student_value = student_fields.get(field_name) if isinstance(student_fields, dict) else None
            gold_value = gold_fields.get(field_name) if isinstance(gold_fields, dict) else None

            if _normalize_scalar(student_value) == _normalize_scalar(gold_value):
                continue

            diagnosis_type, ability, message, suggestion = _rule_from_field(field_name, student_value)
            item_key = (field_name, diagnosis_type)
            if item_key in seen_keys:
                continue
            seen_keys.add(item_key)

            diagnosis_items.append(
                {
                    "field": field_name,
                    "diagnosis_type": diagnosis_type,
                    "ability": ability,
                    "message": message,
                }
            )
            if ability not in weak_abilities:
                weak_abilities.append(ability)
            if suggestion not in suggestions:
                suggestions.append(suggestion)

    return {
        "summary": _build_summary(diagnosis_items),
        "diagnosis_items": diagnosis_items,
        "weak_abilities": weak_abilities,
        "suggestions": suggestions,
    }
