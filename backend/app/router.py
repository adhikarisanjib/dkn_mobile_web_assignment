import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from database import get_db
from settings import settings
from models import (
    ArtifactReviewStatus,
    SystemRole,
    User,
    KnowledgeArtifact, 
    Rating,
    Community,
    CommunityFollow
)
from schemas import (
    UserForm, 
    UserResponse,
    LoginForm,
    TokenResponse,
    KnowledgeArtifactForm,
    KnowledgeArtifactResponse,
    RatingForm,
    RatingResponse,
    ArtifactReviewStatusForm,
    ArtifactReviewStatusResponse,
    CommunityForm,
    CommunityResponse
)
from auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token, 
    create_refresh_token, 
    auth_user, 
    decode_token
)
from settings import settings

router = APIRouter(prefix="/api")


@router.get("/files/{user_id}/{file_model_type}/{filename}")
async def get_file(user_id: str, file_model_type: str, filename: str):
    file_path = os.path.join(settings.MEDIA_DIR, user_id, file_model_type, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename)
    return {"error": "File not found", "status_code": 404}


@router.post("/register", response_model=UserResponse)
async def register(data: UserForm, db=Depends(get_db)):

    if db.query(User).filter(User.email == data.email).first():
        return {"error": "Email already registered", "status_code": 400}

    new_user = User(
        name=data.name,
        email=data.email,
        role=data.role,
        region=data.region,
        is_trusted_contributor=data.is_trusted_contributor,
        password=get_password_hash(data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginForm, db=Depends(get_db)):

    user = authenticate_user(db, data.email, data.password)
    if not user:
        return {"error": "Invalid credentials", "status_code": 401}

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_access_token(refresh_token: dict):
    payload = decode_token(refresh_token['refresh_token'])
    user_id = payload.get("sub")

    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(auth_user)):
    return current_user


@router.get("/artifacts", response_model=list[KnowledgeArtifactResponse])
async def list_artifacts(db=Depends(get_db)):
    artifacts = db.query(KnowledgeArtifact).all()
    return artifacts


@router.get("/artifacts/my-artifacts", response_model=list[KnowledgeArtifactResponse])
async def list_my_artifacts(
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    artifacts = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.created_by == current_user.id).all()
    return artifacts


@router.post("/create-artifact", response_model=KnowledgeArtifactResponse)
async def create_artifact(
    data: KnowledgeArtifactForm = Depends(KnowledgeArtifactForm.as_form),
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    try:
        new_artifact = KnowledgeArtifact(
            title=data.title,
            content=data.content,
            summary=data.summary,
            status=data.status,
            created_by=current_user.id,
        )

        # Handle file upload if present
        if data.file:
            file_location = f"{settings.MEDIA_DIR}/{current_user.id}/artifacts/{data.file.filename}"
            os.makedirs(os.path.dirname(file_location), exist_ok=True)
            with open(file_location, "wb+") as file_object:
                file_object.write(data.file.file.read())
            new_artifact.file = data.file.filename

        db.add(new_artifact)
        db.commit()
        db.refresh(new_artifact)

        return new_artifact
    
    except Exception as e:
        return {"error": str(e)}
    

@router.get("/artifacts/{artifact_id}", response_model=KnowledgeArtifactResponse)
async def get_artifact(artifact_id: str, db=Depends(get_db)):
    artifact = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.id == uuid.UUID(artifact_id)).first()
    if not artifact:
        return {"error": "Artifact not found", "status_code": 404}
    return artifact
    

@router.put("/artifacts/{artifact_id}", response_model=KnowledgeArtifactResponse)
async def update_artifact(
    artifact_id: str,
    data: KnowledgeArtifactForm = Depends(KnowledgeArtifactForm.as_form),
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    artifact = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.id == artifact_id).first()
    if not artifact:
        return {"error": "Artifact not found", "status_code": 404}

    if artifact.created_by != current_user.id:
        return {"error": "Unauthorized", "status_code": 403}

    artifact.title = data.title
    artifact.content = data.content
    artifact.summary = data.summary
    artifact.status = data.status
    artifact.last_updated = datetime.now(timezone.utc)

    # Handle file upload if present and also remove old file
    if data.file:
        # Remove old file if exists
        if artifact.file:
            old_file_path = os.path.join(settings.MEDIA_DIR, str(current_user.id), "artifacts", artifact.file)
            if os.path.exists(old_file_path):
                os.remove(old_file_path)

        file_location = f"{settings.MEDIA_DIR}/{current_user.id}/artifacts/{data.file.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb+") as file_object:
            file_object.write(data.file.file.read())
        artifact.file = data.file.filename

    db.commit()
    db.refresh(artifact)

    return artifact

@router.delete("/artifacts/{artifact_id}")
async def delete_artifact(
    artifact_id: str,
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    artifact = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.id == artifact_id).first()
    if not artifact:
        return {"error": "Artifact not found", "status_code": 404}

    if artifact.created_by != current_user.id:
        return {"error": "Unauthorized", "status_code": 403}

    db.delete(artifact)
    db.commit()

    return {"message": "Artifact deleted successfully"}

@router.post("/rate-artifact/{artifact_id}", response_model=RatingResponse)
async def rate_artifact(
    artifact_id: str,
    data: RatingForm,
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    artifact = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.id == artifact_id).first()
    if not artifact:
        return {"error": "Artifact not found", "status_code": 404}

    new_rating = Rating(
        artifact_id=artifact_id,
        user_id=current_user.id,
        score=data.rating_value,
        comment=data.comment,
    )

    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)

    return new_rating


@router.post("/review-artifact/{artifact_id}", response_model=ArtifactReviewStatusResponse)
async def review_artifact(
    artifact_id: str,
    data: ArtifactReviewStatusForm,
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    artifact = db.query(KnowledgeArtifact).filter(KnowledgeArtifact.id == artifact_id).first()
    if not artifact:
        return {"error": "Artifact not found", "status_code": 404}
    
    if not current_user.role in [SystemRole.KNOWLEDGE_CHAMPION, SystemRole.ADMIN]:
        return {"error": "Permission denied. Only Knowledge Champions and Admins can review artifacts.", "status_code": 403}

    new_review = ArtifactReviewStatus(
        artifact_id=artifact_id,
        reviewed_by=current_user.id,
        decision=None,  # Decision can be set later
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review

@router.post("/communities", response_model=CommunityResponse)
async def create_community(
    data: CommunityForm,
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    if current_user.role != SystemRole.ADMIN:
        return {"error": "Permission denied. Only Admins can create communities.", "status_code": 403}

    new_community = Community(
        name=data.name,
        description=data.description,
    )

    db.add(new_community)
    db.commit()
    db.refresh(new_community)

    return new_community


@router.get("/communities", response_model=list[CommunityResponse])
async def list_communities(db=Depends(get_db)):
    communities = db.query(Community).all()
    return communities

@router.post("/communities/{community_id}/follow")
async def follow_community(
    community_id: str,
    current_user: User = Depends(auth_user),
    db=Depends(get_db)
):
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        return {"error": "Community not found", "status_code": 404}

    if db.query(CommunityFollow).filter(
        CommunityFollow.community_id == community_id,
        CommunityFollow.user_id == current_user.id
    ).first():
        return {"error": "Already following this community", "status_code": 400}

    new_follow = CommunityFollow(
        community_id=community_id,
        user_id=current_user.id,
    )

    db.add(new_follow)
    db.commit()

    return {"message": "Successfully followed the community"}

