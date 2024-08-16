"""Add nutrient values table

Revision ID: c5a17883e285
Revises: cd0c80a8dc08
Create Date: 2024-08-15 19:45:10.725818

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5a17883e285'
down_revision: Union[str, None] = 'cd0c80a8dc08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('profilenutrientvalue',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('profile_id', sa.Integer(), nullable=False),
    sa.Column('nutrient_id', sa.Integer(), nullable=False),
    sa.Column('gross_energy', sa.Float(), nullable=True),
    sa.Column('digestible_energy', sa.Float(), nullable=True),
    sa.Column('metabolizable_energy', sa.Float(), nullable=True),
    sa.Column('net_energy', sa.Float(), nullable=True),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['nutrient_id'], ['nutrient.id'], ),
    sa.ForeignKeyConstraint(['profile_id'], ['profile.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_profilenutrientvalue_archived'), 'profilenutrientvalue', ['archived'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_profilenutrientvalue_archived'), table_name='profilenutrientvalue')
    op.drop_table('profilenutrientvalue')
    # ### end Alembic commands ###
