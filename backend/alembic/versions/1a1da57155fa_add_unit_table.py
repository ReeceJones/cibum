"""Add unit table

Revision ID: 1a1da57155fa
Revises: ea2e475d225a
Create Date: 2024-08-08 20:20:24.212077

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "1a1da57155fa"
down_revision: Union[str, None] = "ea2e475d225a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "unit",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("base_unit_multiplier", sa.Float(), nullable=False),
        sa.Column("base_unit_offset", sa.Float(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_unit_archived"), "unit", ["archived"], unique=False)
    op.create_table(
        "ingredientnutrient",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ingredient_id", sa.Integer(), nullable=False),
        sa.Column("nutrient_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.String(), nullable=True),
        sa.Column("amount", sa.Float(), nullable=True),
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["ingredient_id"],
            ["ingredient.id"],
        ),
        sa.ForeignKeyConstraint(
            ["nutrient_id"],
            ["nutrient.id"],
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organization.id"],
        ),
        sa.ForeignKeyConstraint(
            ["unit"],
            ["unit.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_ingredientnutrient_archived"),
        "ingredientnutrient",
        ["archived"],
        unique=False,
    )
    op.create_table(
        "ingredientnutrientoverride",
        sa.Column("ingredient_nutrient_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.String(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=True),
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["ingredient_nutrient_id"],
            ["ingredientnutrient.id"],
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organization.id"],
        ),
        sa.ForeignKeyConstraint(
            ["unit"],
            ["unit.id"],
        ),
        sa.PrimaryKeyConstraint("ingredient_nutrient_id", "organization_id"),
    )
    op.create_index(
        op.f("ix_ingredientnutrientoverride_archived"),
        "ingredientnutrientoverride",
        ["archived"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        op.f("ix_ingredientnutrientoverride_archived"),
        table_name="ingredientnutrientoverride",
    )
    op.drop_table("ingredientnutrientoverride")
    op.drop_index(
        op.f("ix_ingredientnutrient_archived"), table_name="ingredientnutrient"
    )
    op.drop_table("ingredientnutrient")
    op.drop_index(op.f("ix_unit_archived"), table_name="unit")
    op.drop_table("unit")
    # ### end Alembic commands ###
