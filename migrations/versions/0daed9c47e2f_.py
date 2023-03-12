"""empty message

Revision ID: 0daed9c47e2f
Revises: 216dbe11c774
Create Date: 2022-05-29 20:43:10.668914

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0daed9c47e2f'
down_revision = '216dbe11c774'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exercise__data', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), server_default='1', nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_exercise__data_user_id_signup__data'), 'signup__data', ['user_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exercise__data', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_exercise__data_user_id_signup__data'), type_='foreignkey')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###
