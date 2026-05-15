"""Service layer for AI workflow operations."""

from __future__ import annotations

import json

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.operations import AIWorkflowRunIn, AIWorkflowRunOut, AIWorkflowStatusOut


class AIWorkflowService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def run_workflow(self, payload: AIWorkflowRunIn, user_id: str | None) -> AIWorkflowRunOut:
        query = text(
            """
            INSERT INTO ai.output_logs (
                prompt_version_id,
                user_id,
                model_identifier,
                grounding_status,
                output_status,
                reviewer_state,
                input_summary
            )
            VALUES (
                :prompt_version_id::uuid,
                :user_id::uuid,
                :model_identifier,
                'unverified',
                'pending',
                'pending',
                CAST(:input_summary AS jsonb)
            )
            RETURNING id::text, created_at
            """
        )
        result = await self._db.execute(
            query,
            {
                "prompt_version_id": payload.prompt_version_id,
                "user_id": user_id,
                "model_identifier": payload.model_identifier,
                "input_summary": json.dumps(payload.input_summary),
            },
        )
        row = result.mappings().one()
        return AIWorkflowRunOut(
            workflow_id=row["id"],
            workflow_name=payload.workflow_name,
            status="queued",
            created_at=row["created_at"],
        )

    async def get_workflow_status(self, workflow_id: str) -> AIWorkflowStatusOut | None:
        query = text(
            """
            SELECT
                id::text AS workflow_id,
                COALESCE((input_summary->>'workflow_name'), 'generic_workflow') AS workflow_name,
                grounding_status,
                output_status,
                reviewer_state,
                model_identifier,
                created_at
            FROM ai.output_logs
            WHERE id = :workflow_id::uuid
            """
        )
        result = await self._db.execute(query, {"workflow_id": workflow_id})
        row = result.mappings().one_or_none()
        if row is None:
            return None
        return AIWorkflowStatusOut.model_validate(row)

    async def list_prompt_versions(self, limit: int = 50) -> list[dict[str, str | bool | None]]:
        query = text(
            """
            SELECT
                id::text AS id,
                name,
                version,
                purpose,
                model_hint,
                is_active
            FROM ai.prompt_versions
            ORDER BY created_at DESC
            LIMIT :limit
            """
        )
        result = await self._db.execute(query, {"limit": limit})
        return [dict(row) for row in result.mappings().all()]
