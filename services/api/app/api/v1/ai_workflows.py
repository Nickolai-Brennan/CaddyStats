"""API routes — AI workflow operations."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.dependencies.auth import get_optional_user, require_permission
from app.models.auth import User
from app.schemas.operations import AIWorkflowRunIn, AIWorkflowRunOut, AIWorkflowStatusOut
from app.services.ai import AIWorkflowService

router = APIRouter(prefix="/ai/workflows", tags=["ai"])


@router.post(
    "/run",
    response_model=AIWorkflowRunOut,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(require_permission("admin.ingestion"))],
)
async def run_workflow(
    payload: AIWorkflowRunIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User | None, Depends(get_optional_user)],
) -> AIWorkflowRunOut:
    svc = AIWorkflowService(db)
    workflow = await svc.run_workflow(payload, user_id=str(user.id) if user else None)
    await db.commit()
    return workflow


@router.get("/status/{workflow_id}", response_model=AIWorkflowStatusOut)
async def get_workflow_status(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> AIWorkflowStatusOut:
    svc = AIWorkflowService(db)
    workflow = await svc.get_workflow_status(workflow_id)
    if workflow is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return workflow


@router.get("/prompt-versions/list", response_model=list[dict[str, Any]])
async def list_prompt_versions(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=50, ge=1, le=200),
) -> list[dict[str, Any]]:
    return await AIWorkflowService(db).list_prompt_versions(limit=limit)
