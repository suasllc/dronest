from .db import db
from .userfollower import UserFollower
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import Table, Column, Integer, ForeignKey, or_
from .directmessage import DirectMessage
from .userequipment import UserEquipment
from .equipment import Equipment
from .message import Message
from .messagereceiver import MessageReceiver
from sqlalchemy.orm import validates


class User(db.Model, UserMixin):
  __tablename__ = 'Users'

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  name = db.Column(db.String(100), nullable=True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  bio = db.Column(db.Text, nullable=True)
  websiteUrl = db.Column(db.Text, nullable=False, default="www.google.com")
  userType = db.Column(db.Integer, nullable=True, default=0)
  profilePicUrl = db.Column(db.Text, nullable=True)
  createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
  updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())


  ownPosts = db.relationship('Post', foreign_keys='Post.userId')
  ownComments = db.relationship('Comment', foreign_keys='Comment.userId')
  taggedInPosts = db.relationship('Post', secondary='taggedusers')
  likedPosts = db.relationship('Post', secondary='likedposts')
  savedPosts = db.relationship('Post', secondary='savedposts')
  sentMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.senderId')
  receivedMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.receiverId')
  likedComments = db.relationship('Comment', secondary='commentlikes')
  taggedInComments = db.relationship('Comment', secondary='commenttaggedusers')
  followers = [] #db.relationship('User', secondary='userfollowers', foreign_keys='UserFollower.followerId')
  following = [] #db.relationship('User', secondary='userfollowers', foreign_keys='UserFollower.userId')
  allMessages = []
  # equipmentList = []
  equipmentList = db.relationship('Equipment', secondary="UserEquipments")


  # @validates('username', 'email')
  # def convert_lower(self, key, value):
  #   return value.lower()

  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def get_followers(self):
    ufs = UserFollower.query.filter(UserFollower.userId == self.id).all()
    self.followers = [uf.follower for uf in ufs]


  def get_following(self):
    ufs = UserFollower.query.filter(UserFollower.followerId == self.id).all()
    self.following = [uf.person for uf in ufs]

  def get_messages(self):
    msgs = DirectMessage.query\
      .filter(or_(DirectMessage.senderId == self.id, \
        DirectMessage.receiverId == self.id)).order_by(DirectMessage.id).all()
    self.allMessages = msgs

  def get_conversations(self):
    convos = MessageReceiver.query\
      .filter(or_(MessageReceiver.senderId == self.id, \
        MessageReceiver.receiverId == self.id)).order_by(MessageReceiver.id).all()
    uniqueConvos = []
    if len(convos):
      messageIdSet = set()
      for convo in convos:
        if convo.senderId != self.id:
          uniqueConvos.append(convo)
        else:
          if convo.messageId not in messageIdSet:
            uniqueConvos.append(convo)
            messageIdSet.add(convo.messageId)


    self.allMessages = uniqueConvos

  def get_last_conversation(self):
    convo = MessageReceiver.query\
      .filter(or_(MessageReceiver.senderId == self.id, \
        MessageReceiver.receiverId == self.id)).order_by(-MessageReceiver.id).first()
    self.allMessages = [convo]


  def to_dict(self):
    return {
      "id": self.id,
      "name": self.name,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_with_posts_and_follows(self):
    self.get_followers()
    self.get_following()    
    return {
      "id": self.id,
      "name": self.name,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "followers": [user.to_dict() for user in self.followers],
      "following": [user.to_dict() for user in self.following],
      "ownPosts": [post.to_dict() for post in self.ownPosts],
      "equipmentList": [equipment.to_dict() for equipment in self.equipmentList],      
    }

  def to_dict_with_posts(self):
    return {
      "id": self.id,
      "name": self.name,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "ownPosts": [post.to_dict() for post in self.ownPosts],
    }

  def to_dict_with_posts_fast(self):
    user_as_dict_basic = {
      "id": self.id,
      "name": self.name,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

    user_as_dict = user_as_dict_basic.copy()
    user_as_dict["ownPosts"] = [post.to_dict_fast_own_user(user_as_dict_basic) for post in self.ownPosts]
    return user_as_dict
      # "ownPosts": [post.to_dict_fast() for post in self.ownPosts],

  def to_dict_feed(self):
    self.get_following()
    return {
      "followingIds": [int(follow.id) for follow in self.following]
    }

  def to_dict_for_mentions(self):
    return {
      "id": self.id,
      "displayName": self.name,
      "name": self.username,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_no_posts(self):
  #no posts so if a post has this user, there is no infinite circular references
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_for_self(self):
    self.get_followers()
    self.get_following()
    # self.get_messages()
    self.get_conversations()
    return {
      "id": self.id,
      "username": self.username,
      "name": self.name,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "userType": self.userType,
      "ownPosts": [post.to_dict() for post in self.ownPosts],
      "likedPosts": [post.to_dict() for post in self.likedPosts],
      "savedPosts": [post.to_dict() for post in self.savedPosts],
      "taggedInPosts": [post.to_dict() for post in self.taggedInPosts],
      "messages": [m.to_dict() for m in self.allMessages], #[sentMsg.to_dict() for sentMsg in self.sentMessages] + [recvdMsg.to_dict() for recvdMsg in self.receivedMessages],
      "followers": [user.to_dict() for user in self.followers],
      "following": [user.to_dict() for user in self.following],
      "likedComments": [comment.to_dict() for comment in self.likedComments],
      "taggedInComments": [comment.to_dict() for comment in self.taggedInComments],
      "equipmentList": [equipment.to_dict() for equipment in self.equipmentList],
    }

  def to_dict_as_generic_profile(self):
    '''
    compared to "for_self" this does not include:
      - messages
      and more later
    '''
    self.get_followers()
    self.get_following()
    return {
      "id": self.id,
      "username": self.username,
      "name": self.name,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "ownPosts": [post.to_dict() for post in self.ownPosts],
      "likedPosts": [post.to_dict() for post in self.likedPosts],
      "savedPosts": [post.to_dict() for post in self.savedPosts],
      "taggedInPosts": [post.to_dict() for post in self.taggedInPosts],
      "followers": [user.to_dict() for user in self.followers],
      "following": [user.to_dict() for user in self.following],
      "likedComments": [comment.to_dict() for comment in self.likedComments],
      "taggedInComments": [comment.to_dict() for comment in self.taggedInComments],
      "equipmentList": [equipment.to_dict() for equipment in self.equipmentList],
    }


'''
mapper(
    User, t_users,
    properties={
        'followers': relation(
            User,
            secondary=t_follows,
            primaryjoin=(t_follows.c.followee_id==t_users.c.id),
            secondaryjoin=(t_follows.c.follower_id==t_users.c.id),
        ),
        'followees': relation(
            User,
            secondary=t_follows,
            primaryjoin=(t_follows.c.follower_id==t_users.c.id),
            secondaryjoin=(t_follows.c.followee_id==t_users.c.id),
        ),
    },
)
'''
