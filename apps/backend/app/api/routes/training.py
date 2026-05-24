from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps import require_permission
from app.db.models import User
from app.services.training_service import DEFAULT_TRAINING_USER, TrainingService


router = APIRouter(prefix="/training", tags=["training"])


class AnswerUnit(BaseModel):
    unit_id: str
    fields: dict[str, Any] = Field(default_factory=dict)


class TrainingSubmission(BaseModel):
    case_id: str
    student_answer_units: list[AnswerUnit] = Field(default_factory=list)


class TrainingResponse(BaseModel):
    status: str
    message: str
    data: Any = None


def _resolve_training_user(current_user: User | None) -> str:
    if current_user and getattr(current_user, "id", None):
        return str(current_user.id)
    return DEFAULT_TRAINING_USER


@router.get("/cases", response_model=TrainingResponse)
def list_cases(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    return TrainingResponse(
        status="success",
        message="Cases loaded.",
        data=service.list_cases(),
    )


@router.get("/cases/{case_id}", response_model=TrainingResponse)
def get_case(case_id: str, current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    try:
        case_bundle = service.get_case_bundle(case_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return TrainingResponse(status="success", message="Case loaded.", data=case_bundle)


@router.post("/submit", response_model=TrainingResponse)
def submit_exercise(
    submission: TrainingSubmission,
    current_user: User = Depends(require_permission("notam")),
) -> TrainingResponse:
    service = TrainingService()
    try:
        result = service.submit(
            _resolve_training_user(current_user),
            submission.case_id,
            [unit.model_dump() for unit in submission.student_answer_units],
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return TrainingResponse(
        status="success",
        message="Training submission processed.",
        data=result,
    )


@router.get("/mistakes", response_model=TrainingResponse)
def list_mistakes(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    data = service.list_mistakes(_resolve_training_user(current_user))
    return TrainingResponse(status="success", message="Mistakes loaded.", data=data)


@router.get("/progress", response_model=TrainingResponse)
def training_progress(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    data = service.get_progress(_resolve_training_user(current_user))
    return TrainingResponse(status="success", message="Progress loaded.", data=data)


@router.get("/profile", response_model=TrainingResponse)
def training_profile(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    data = service.get_profile(_resolve_training_user(current_user))
    return TrainingResponse(status="success", message="Profile loaded.", data=data)
