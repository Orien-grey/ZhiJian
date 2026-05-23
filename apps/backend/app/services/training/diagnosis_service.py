from __future__ import annotations

from collections import Counter
from typing import Any


def diagnose_errors(errors: list[dict[str, Any]]) -> dict[str, Any]:
    if not errors:
        return {
            "summary": "本次作答没有识别到规则错误。",
            "weak_abilities": [],
            "error_clusters": {},
            "suggestions": ["继续下一题，扩大题型覆盖范围。"],
        }

    ability_counter: Counter[str] = Counter()
    for error in errors:
        for ability in error.get("abilities", []):
            ability_counter[ability] += 1

    summary_parts: list[str] = []
    if any(error.get("error_type") == "TIME_FORMAT_ERROR" for error in errors):
        summary_parts.append("时间字段提取不稳定")
    if any(error.get("error_type") == "OBJECT_CONFUSION" for error in errors):
        summary_parts.append("设施类型识别存在混淆")
    if any(error.get("error_type") == "IMPACT_ERROR" for error in errors):
        summary_parts.append("运行影响判断没有落到操作层面")
    if any(error.get("error_type") == "EVIDENCE_MISSING" for error in errors):
        summary_parts.append("证据引用不足")
    if not summary_parts:
        summary_parts.append("错误主要集中在结构化字段填写与规则细节")

    return {
        "summary": "；".join(summary_parts),
        "weak_abilities": [ability for ability, count in ability_counter.most_common() if count > 0][:3],
        "error_clusters": dict(Counter(error.get("error_type", "UNKNOWN") for error in errors)),
        "suggestions": [f"优先补强：{ability}" for ability, count in ability_counter.most_common(3) if count > 0],
    }
