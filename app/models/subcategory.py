from .db import db

class SubCategory(db.Model):
  __tablename__ = 'SubCategories' #Title-case plural for Sequelize-compatibility

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False, unique=True)

  createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
  updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())



  def to_dict(self):
    return {
      'id': self.id,
      "name": self.name,
      # "createdAt": self.createdAt,
      # "updatedAt": self.updatedAt,
    }
