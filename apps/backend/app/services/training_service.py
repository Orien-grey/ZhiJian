from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.training.grading_service import grade_answer
from app.services.training.profile_service import (
    append_user_record,
    get_progress_snapshot,
    get_user_profile,
    get_user_records,
)
from app.services.training.recommendation_service import recommend_next_cases


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CASES_PATH = DATA_DIR / "cases.json"
GOLD_ANSWERS_PATH = DATA_DIR / "gold_answers.json"
DEFAULT_TRAINING_USER = "demo_user"


class TrainingService:
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

    def list_cases(self) -> dict[str, Any]:
        cases = self._load_cases()
        return {"cases": cases, "total": len(cases)}

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

    def _recent_case_ids(self, user_id: str, limit: int = 10) -> list[str]:
        records = get_user_records(user_id)
        return [record.get("case_id") for record in records[-limit:] if record.get("case_id")]

    def get_progress(self, user_id: str) -> dict[str, Any]:
        total_cases = len(self._load_cases())
        return get_progress_snapshot(user_id, total_cases)

    def get_profile(self, user_id: str) -> dict[str, Any]:
        profile = get_user_profile(user_id)
        profile["recommended_cases"] = self._recommended_cases(user_id)
        return profile

    def list_mistakes(self, user_id: str) -> dict[str, Any]:
        records = get_user_records(user_id)
        case_index = self._case_index()
        mistake_records: list[dict[str, Any]] = []
        for record in reversed(records):
            if int(record.get("score", 0)) >= 100 and not record.get("errors"):
                continue
            enriched = dict(record)
            enriched["case"] = case_index.get(record.get("case_id"))
            mistake_records.append(enriched)
        return {"records": mistake_records}

    def _recommended_cases(self, user_id: str, current_case_id: str | None = None) -> list[dict[str, Any]]:
        cases = self._load_cases()
        gold_answers = self._load_gold_answers()
        profile = get_user_profile(user_id)
        return recommend_next_cases(
            profile,
            cases,
            gold_answers,
            recent_case_ids=self._recent_case_ids(user_id),
            current_case_id=current_case_id,
        )

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

        record = {
            "record_id": str(uuid.uuid4()),
            "case_id": case_id,
            "student_answer_units": student_answer_units,
            "grading_result": grading_result,
            "score": grading_result["total_score"],
            "errors": grading_result.get("errors", []),
            "created_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        }
        append_user_record(user_id, record)

        progress = self.get_progress(user_id)
        profile = self.get_profile(user_id)
        recommended_cases = self._recommended_cases(user_id, current_case_id=case_id)
        profile["recommended_cases"] = recommended_cases

        return {
            "case": case,
            "grading_result": grading_result,
            "record": record,
            "progress": progress,
            "profile": profile,
            "recommended_cases": recommended_cases,
        }
