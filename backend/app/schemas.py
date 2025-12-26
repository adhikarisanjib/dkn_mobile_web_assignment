from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, computed_field
from fastapi import File, UploadFile, Form

from models import ArtifactStatus, Region, SystemRole, ArtifactReviewStatus


class LoginForm(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    refresh_token: str
    access_token: str
    token_type: str


class UserForm(BaseModel):
    email: str
    password: str
    name: str
    role: SystemRole
    region: Region
    is_trusted_contributor: Optional[bool] = False


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    role: SystemRole
    region: Region
    is_trusted_contributor: Optional[bool] = False
    created_on: datetime

    class Config:
        from_attributes = True


class KnowledgeArtifactForm(BaseModel):
    title: str
    summary: str
    content: str
    status: ArtifactStatus | None = ArtifactStatus.DRAFT
    file: UploadFile | None = None

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        summary: str = Form(...),
        content: str = Form(...),
        status: ArtifactStatus = Form(ArtifactStatus.DRAFT),
        file: UploadFile = File(None),
    ):
        return cls(
            title=title,
            summary=summary,
            content=content,
            status=status,
            file=file,
        )


class KnowledgeArtifactResponse(BaseModel):
    id: UUID
    title: str
    summary: str
    content: str
    status: Optional[ArtifactStatus] = ArtifactStatus.DRAFT
    file: Optional[str] = None
    created_by: UUID
    created_on: datetime

    @computed_field
    @property
    def file_url(self) -> str | None:
        if self.file:
            return f"http://localhost:8000/api/files/{self.created_by}/artifacts/{self.file}"
        return None

    class Config:
        from_attributes = True



class ArtifactTagForm(BaseModel):
    id: UUID
    tag: str


class ArtifactTagResponse(ArtifactTagForm):
    id: UUID 

    class Config:
        from_attributes = True


class RatingForm(BaseModel):
    artifact_id: UUID
    rating_value: int
    comment: Optional[str] = None


class RatingResponse(RatingForm):
    rating_id: UUID
    user_id: UUID
    rated_on: str

    class Config:
        from_attributes = True


class ArtifactReviewStatusForm(BaseModel):
    artifact_id: UUID
    comments: Optional[str] = None


class ArtifactReviewStatusResponse(ArtifactReviewStatusForm):
    review_id: UUID
    decision: Optional[str] = None
    reviewed_by: Optional[str] = None
    submitted_on: str

    class Config:
        from_attributes = True


class CommunityForm(BaseModel):
    name: str
    description: Optional[str] = None


class CommunityResponse(CommunityForm):
    community_id: UUID

    class Config:
        from_attributes = True
        