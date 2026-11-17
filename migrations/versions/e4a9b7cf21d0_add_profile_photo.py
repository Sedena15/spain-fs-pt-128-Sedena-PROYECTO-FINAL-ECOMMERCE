"""Store uploaded user profile photos.

Revision ID: e4a9b7cf21d0
Revises: 2761b2f87dd5
"""
from alembic import op
import sqlalchemy as sa


revision = "e4a9b7cf21d0"
down_revision = "2761b2f87dd5"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("user", sa.Column("profile_photo", sa.LargeBinary(), nullable=True))


def downgrade():
    op.drop_column("user", "profile_photo")
