"""Update profile constraint table

Revision ID: 51096cdce971
Revises: 2aecfae9e54c
Create Date: 2024-08-17 07:22:11.864489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '51096cdce971'
down_revision: Union[str, None] = '2aecfae9e54c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('profileconstraint', sa.Column('type', sa.String(), nullable=False))
    op.add_column('profileconstraint', sa.Column('mode', sa.String(), nullable=False))
    op.add_column('profileconstraint', sa.Column('operator', sa.String(), nullable=False))
    op.add_column('profileconstraint', sa.Column('literal_unit_id', sa.String(), nullable=True))
    op.add_column('profileconstraint', sa.Column('literal_value', sa.Float(), nullable=True))
    op.create_foreign_key(None, 'profileconstraint', 'unit', ['literal_unit_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'profileconstraint', type_='foreignkey')
    op.drop_column('profileconstraint', 'literal_value')
    op.drop_column('profileconstraint', 'literal_unit_id')
    op.drop_column('profileconstraint', 'operator')
    op.drop_column('profileconstraint', 'mode')
    op.drop_column('profileconstraint', 'type')
    # ### end Alembic commands ###
