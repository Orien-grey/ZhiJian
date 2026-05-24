from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.training.diagnosis_service import diagnose_answer
from app.services.training.grading_service import grade_answer
from app.services.training.profile_service import (
    get_answered_case_ids,
    get_latest_records_by_case,
    get_progress_snapshot,
    get_user_profile,
    upsert_user_record,
)
from app.services.training.recommendation_service import recommend_next_cases


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CASES_PATH = DATA_DIR / "cases.json"
GOLD_ANSWERS_PATH = DATA_DIR / "gold_answers.json"
DEFAULT_TRAINING_USER = "demo_user"


class TrainingService:
    @staticmethod
    def _diagnosis_items(record: dict[str, Any]) -> list[dict[str, Any]]:
        diagnosis_result = record.get("diagnosis_result", {})
        if not isinstance(diagnosis_result, dict):
            return []
        diagnosis_items = diagnosis_result.get("diagnosis_items", [])
        return diagnosis_items if isinstance(diagnosis_items, list) else []

    def _load_cases(self) -> list[dict[str, Any]]:
        with CASES_PATH.open("r", encoding="utf-8") as file:
            cases = json.load(file)
        return cases if isinstance(cases, list) else []

    def _load_gold_answers(self) -> dict[str, dict[str, Any]]:
        with GOLD_ANSWERS_PATH.open("r", encoding="utf-8") as file:
            gold_answers = json.load(file)
        return gold_answers if isinstance(gold_answers, dict) else {}

    def _case_index(self) -> dict[str, dict[str, Any]]:
        return {case["case_id"]: case for case in self._load_cases() if case.get("case_id")}

    def _normalize_category(self, value: str | None) -> str:
        text = (value or "unknown").strip()
        return text or "unknown"

    def _category_matches(self, case: dict[str, Any], category: str | None) -> bool:
        if category is None or category == "all":
            return True
        return self._normalize_category(case.get("category")) == category

    def list_cases(
        self,
        user_id: str,
        category: str | None = None,
        include_answered: bool = False,
        limit: int = 50,
        random_order: bool = True,
    ) -> dict[str, Any]:
        return self.list_practice_cases(
            user_id=user_id,
            category=category,
            include_answered=include_answered,
            limit=limit,
            random_order=random_order,
        )

    def list_categories(self, user_id: str) -> dict[str, Any]:
        answered_case_ids = get_answered_case_ids(user_id)
        buckets: dict[str, dict[str, int | str]] = {}

        for case in self._load_cases():
            category = self._normalize_category(case.get("category"))
            bucket = buckets.setdefault(
                category,
                {
                    "category": category,
                    "total_count": 0,
                    "answered_count": 0,
                    "remaining_count": 0,
                },
            )
            bucket["total_count"] += 1
            if case.get("case_id") in answered_case_ids:
                bucket["answered_count"] += 1

        categories = []
        for category_name in sorted(buckets.keys()):
            bucket = buckets[category_name]
            bucket["remaining_count"] = max(0, int(bucket["total_count"]) - int(bucket["answered_count"]))
            categories.append(bucket)

        return {
            "categories": categories,
            "total_categories": len(categories),
        }

    def list_practice_cases(
        self,
        user_id: str,
        category: str | None = None,
        include_answered: bool = False,
        limit: int = 50,
        random_order: bool = True,
    ) -> dict[str, Any]:
        cases = [case for case in self._load_cases() if self._category_matches(case, category)]
        answered_case_ids = get_answered_case_ids(user_id)
        if not include_answered:
            cases = [case for case in cases if case.get("case_id") not in answered_case_ids]

        if random_order:
            cases = list(cases)
            random.shuffle(cases)

        safe_limit = max(1, min(limit, 200))
        returned_cases = cases[:safe_limit]
        return {
            "cases": returned_cases,
            "total": len(cases),
            "returned": len(returned_cases),
            "include_answered": include_answered,
            "category": category or "all",
        }

    def get_next_case(
        self,
        user_id: str,
        category: str | None = None,
        current_case_id: str | None = None,
    ) -> dict[str, Any]:
        pool = self.list_practice_cases(
            user_id=user_id,
            category=category,
            include_answered=False,
            limit=200,
            random_order=True,
        )
        candidate_cases = [
            case for case in pool["cases"] if case.get("case_id") and case.get("case_id") != current_case_id
        ]
        remaining_count = pool["total"]
        if current_case_id and any(case.get("case_id") == current_case_id for case in pool["cases"]):
            remaining_count -= 1
        remaining_count = max(0, remaining_count)

        if not candidate_cases:
            return {
                "case": None,
                "gold_answer": None,
                "remaining_count": remaining_count,
            }

        selected_case = candidate_cases[0]
        return {
            "case": selected_case,
            "gold_answer": self._get_gold_answer(selected_case["case_id"]),
            "remaining_count": remaining_count,
        }

    def get_case(self, case_id: str) -> dict[str, Any]:
        case = self._case_index().get(case_id)
        if case is None:
            raise KeyError(f"Case not found: {case_id}")
        return case

    def _get_gold_answer(self, case_id: str) -> dict[str, Any]:
        gold_answer = self._load_gold_answers().get(case_id)
        if gold_answer is None:
            raise KeyError(f"Gold answer not found: {case_id}")
        return gold_answer

    def get_case_bundle(self, case_id: str) -> dict[str, Any]:
        return {
            "case": self.get_case(case_id),
            "gold_answer": self._get_gold_answer(case_id),
        }

    def _recommended_cases(self, user_id: str, current_case_id: str | None = None) -> list[dict[str, Any]]:
        answered_case_ids = get_answered_case_ids(user_id)
        cases = [case for case in self._load_cases() if case.get("case_id") not in answered_case_ids]
        gold_answers = self._load_gold_answers()
        profile = get_user_profile(user_id)
        return recommend_next_cases(
            profile,
            cases,
            gold_answers,
            recent_case_ids=[],
            current_case_id=current_case_id,
        )

    def get_progress(self, user_id: str) -> dict[str, Any]:
        return get_progress_snapshot(user_id, len(self._load_cases()))

    def get_profile(self, user_id: str) -> dict[str, Any]:
        profile = get_user_profile(user_id)
        profile["recommended_cases"] = self._recommended_cases(user_id)
        return profile

    def list_mistakes(self, user_id: str) -> dict[str, Any]:
        case_index = self._case_index()
        mistake_records: list[dict[str, Any]] = []
        for record in get_latest_records_by_case(user_id):
            diagnosis_items = self._diagnosis_items(record)
            if int(record.get("score", 0)) >= 100 and not diagnosis_items:
                continue
            enriched = dict(record)
            enriched["case"] = case_index.get(record.get("case_id"))
            mistake_records.append(enriched)
        mistake_records.sort(key=lambda item: str(item.get("created_at") or ""), reverse=True)
        return {"records": mistake_records}

    def submit(
        self,
        user_id: str,
        case_id: str,
        student_answer_units: list[dict[str, Any]],
    ) -> dict[str, Any]:
        case = self.get_case(case_id)
        gold_answer = self._get_gold_answer(case_id)
        grading_result = grade_answer(student_answer_units, gold_answer.get("gold_answer_units", []))
        grading_result["case_id"] = case_id
        diagnosis_result = diagnose_answer(
            case=case,
            student_answer_units=student_answer_units,
            gold_answer_units=gold_answer.get("gold_answer_units", []),
        )

        record = {
            "record_id": str(uuid.uuid4()),
            "case_id": case_id,
            "student_answer_units": student_answer_units,
            "grading_result": grading_result,
            "diagnosis_result": diagnosis_result,
            "score": grading_result["total_score"],
            "created_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        }
        upsert_user_record(user_id, record)

        progress = self.get_progress(user_id)
        profile = self.get_profile(user_id)
        recommended_cases = self._recommended_cases(user_id, current_case_id=case_id)
        profile["recommended_cases"] = recommended_cases

        return {
            "case": case,
            "grading_result": grading_result,
            "diagnosis_result": diagnosis_result,
            "record": record,
            "progress": progress,
            "profile": profile,
            "recommended_cases": recommended_cases,
        }
