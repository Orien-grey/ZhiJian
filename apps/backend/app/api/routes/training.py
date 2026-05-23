from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.deps import require_permission
from app.db.models import User
from app.services.training.profile_service import get_user_profile
from app.services.training_service import TrainingService


router = APIRouter(prefix="/training", tags=["training"])


class TrainingSubmission(BaseModel):
    case_id: str
    student_answer: dict[str, Any]


class TrainingResponse(BaseModel):
    status: str
    message: str
    data: Any = None


@router.get("/cases", response_model=TrainingResponse)
def list_cases(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    return TrainingResponse(status="success", message="Cases loaded.", data=service.list_cases())


@router.get("/cases/{case_id}", response_model=TrainingResponse)
def get_case(case_id: str, current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    service = TrainingService()
    try:
        case = service.get_case(case_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return TrainingResponse(status="success", message="Case loaded.", data=case)


@router.post("/submit", response_model=TrainingResponse)
def submit_exercise(
    submission: TrainingSubmission,
    current_user: User = Depends(require_permission("notam")),
) -> TrainingResponse:
    service = TrainingService()
    try:
        result = service.submit(str(current_user.id), submission.case_id, submission.student_answer)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return TrainingResponse(status="success", message="Training submission processed.", data=result)


@router.get("/profile", response_model=TrainingResponse)
def training_profile(current_user: User = Depends(require_permission("notam"))) -> TrainingResponse:
    return TrainingResponse(status="success", message="Profile loaded.", data=get_user_profile(str(current_user.id)))
