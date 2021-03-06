"""empty message

Revision ID: b8d49a3ac8a4
Revises: e0a3693c3822
Create Date: 2021-02-25 14:18:56.105557

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8d49a3ac8a4'
down_revision = 'e0a3693c3822'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rawData', sa.Text(), nullable=False),
    sa.Column('totalReceivers', sa.Integer(), nullable=False),
    sa.Column('receiverIdList', sa.String(length=255), nullable=False),
    sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('MessageReceivers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('senderId', sa.Integer(), nullable=False),
    sa.Column('messageId', sa.Integer(), nullable=False),
    sa.Column('receiverId', sa.Integer(), nullable=False),
    sa.Column('viewStatus', sa.Boolean(), nullable=False),
    sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['messageId'], ['Messages.id'], ),
    sa.ForeignKeyConstraint(['receiverId'], ['Users.id'], ),
    sa.ForeignKeyConstraint(['senderId'], ['Users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('MessageReceivers')
    op.drop_table('Messages')
    # ### end Alembic commands ###
