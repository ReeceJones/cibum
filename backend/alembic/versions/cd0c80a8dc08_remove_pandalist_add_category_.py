"""Remove pandalist, add category constraints to profile

Revision ID: cd0c80a8dc08
Revises: cb3e331b245d
Create Date: 2024-08-14 19:35:27.403232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cd0c80a8dc08'
down_revision: Union[str, None] = 'cb3e331b245d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('profileingredientconstraint', sa.Column('reference_ingredient_category_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'profileingredientconstraint', 'ingredientcategory', ['reference_ingredient_category_id'], ['id'])
    op.add_column('profilenutrientconstraint', sa.Column('reference_nutrient_category_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'profilenutrientconstraint', 'nutrientcategory', ['reference_nutrient_category_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'profilenutrientconstraint', type_='foreignkey')
    op.drop_column('profilenutrientconstraint', 'reference_nutrient_category_id')
    op.drop_constraint(None, 'profileingredientconstraint', type_='foreignkey')
    op.drop_column('profileingredientconstraint', 'reference_ingredient_category_id')
    # ### end Alembic commands ###
