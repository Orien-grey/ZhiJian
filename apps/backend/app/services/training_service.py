from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.services.training.diagnosis_service import diagnose_errors
from app.services.training.grading_service import grade_answer
from app.services.training.knowledge_service import retrieve_knowledge_cards
from app.services.training.profile_service import append_user_record, get_user_profile
from app.services.training.recommendation_service import recommend_next_case


CASES_PATH = Path(__file__).resolve().parent.parent / "data" / "cases.json"
GOLD_ANSWERS_PATH = Path(__file__).resolve().parent.parent / "data" / "gold_answers.json"


class TrainingService:
    def _load_cases(self) -> list[dict[str, Any]]:
        with CASES_PATH.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _load_gold_answers(self) -> list[dict[str, Any]]:
        with GOLD_ANSWERS_PATH.open("r", encoding="utf-8") as file:
            return json.load(file)

    def list_cases(self) -> list[dict[str, Any]]:
        return self._load_cases()

    def get_case(self, case_id: str) -> dict[str, Any]:
        for case in self._load_cases():
            if case.get("case_id") == case_id:
                return case
        raise KeyError(f"Case not found: {case_id}")

    def _get_gold_answer(self, case_id: str) -> dict[str, Any]:
        for answer in self._load_gold_answers():
            if answer.get("case_id") == case_id:
                return answer
        raise KeyError(f"Gold answer not found: {case_id}")

    def submit(self, user_id: str, case_id: str, student_answer: dict[str, Any]) -> dict[str, Any]:
        case = self.get_case(case_id)
        gold_answer = self._get_gold_answer(case_id)
        grading = grade_answer(student_answer, gold_answer)
        diagnosis = diagnose_errors(grading.get("errors", []))
        knowledge_cards = retrieve_knowledge_cards(grading.get("errors", []))
        append_user_record(
            user_id,
            {
                "case_id": case_id,
                "student_answer": student_answer,
                "grading": grading,
                "diagnosis": diagnosis,
            },
        )
        profile = get_user_profile(user_id)
        next_case = recommend_next_case(profile, self.list_cases(), current_case_id=case_id)
        return {
            "case": case,
            "gold_answer": gold_answer,
            "grading": grading,
            "diagnosis": diagnosis,
            "knowledge_cards": knowledge_cards,
            "profile": profile,
            "next_case": next_case,
        }
