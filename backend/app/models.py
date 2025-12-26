from datetime import datetime, timezone
from enum import Enum
import uuid

from sqlalchemy import (
    Column, 
    String, 
    Enum as EnumField, 
    Boolean, 
    DateTime, 
    Text, 
    ForeignKey, 
    Integer,
    UUID
)

from sqlalchemy.orm import relationship

from database import Base 


class SystemRole(str, Enum):
    CONSULTANT = "CONSULTANT"
    KNOWLEDGE_CHAMPION = "KNOWLEDGE_CHAMPION"
    GOVERNANCE_COUNCIL = "GOVERNANCE_COUNCIL"
    ADMIN = "ADMIN"

class ArtifactStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    PUBLISHED = "PUBLISHED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"

class ReviewDecision(str, Enum):
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"

class Region(str, Enum):
    AFRICA = "AFRICA"
    ASIA = "ASIA"
    AUSTRALIA = "AUSTRALIA"
    EUROPE = "EUROPE"
    NORTH_AMERICA = "NORTH_AMERICA"
    SOUTH_AMERICA = "SOUTH_AMERICA"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(length=256))
    email = Column(String(length=256), unique=True)
    role = Column(EnumField(SystemRole), default=SystemRole.CONSULTANT)
    region = Column(EnumField(Region), default=Region.EUROPE)
    created_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    password = Column(String(length=256))

    is_trusted_contributor = Column(Boolean, default=False)

    artifacts = relationship("KnowledgeArtifact", back_populates="created_by_user")
    ratings = relationship("Rating", back_populates="rated_by_user")
    reviews = relationship("ArtifactReviewStatus", back_populates="reviewed_by_user")


class KnowledgeArtifact(Base):
    __tablename__ = "artifacts"

    id = Column(String(length=256), primary_key=True, default=lambda: uuid.uuid4().hex)
    title = Column(String(length=256))
    content = Column(Text)
    summary = Column(Text)
    status = Column(EnumField(ArtifactStatus), default=ArtifactStatus.DRAFT)

    file = Column(String(length=256), nullable=True)

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    created_by_user = relationship("User", back_populates="artifacts")
    tags = relationship("ArtifactTag", back_populates="artifact")
    ratings = relationship("Rating", back_populates="artifact")
    reviews = relationship("ArtifactReviewStatus", back_populates="artifact")


class ArtifactTag(Base):
    __tablename__ = "artifact_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("artifacts.id"))
    tag = Column(String(length=256))

    artifact = relationship("KnowledgeArtifact", back_populates="tags")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("artifacts.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    comment = Column(Text)
    score = Column(Integer)  # 0-5
    rated_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    artifact = relationship("KnowledgeArtifact", back_populates="ratings")
    rated_by_user = relationship("User", back_populates="ratings")


class ArtifactReviewStatus(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("artifacts.id"))
    decision = Column(EnumField(ReviewDecision))
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    submitted_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    artifact = relationship("KnowledgeArtifact", back_populates="reviews")
    reviewed_by_user = relationship("User", back_populates="reviews")


class Community(Base):
    __tablename__ = "communities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(length=256))
    description = Column(Text)

    followers = relationship("CommunityFollow", back_populates="community")


class CommunityFollow(Base):
    __tablename__ = "community_follows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    followed_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    community = relationship("Community", back_populates="followers")

    
