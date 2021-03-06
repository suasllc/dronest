from werkzeug.security import generate_password_hash
from app.models import db, Post, Category, Album, Equipment, Location
from faker import Faker
from random import randint
fake = Faker()
from .data import mediadata, albums
from datetime import datetime


# Adds a demo post, you can add other posts here if you want
def seed_posts():

    # demo = Post(userId=1, locationId=1, captionRawData='{"blocks":[{"key":"a12d1","text":"A cup of Joe and Java Script","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo)

    # demo1 = Post(userId=2, locationId=1, captionRawData='{"blocks":[{"key":"br8hm","text":"Congrats my friends!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo1)

    # demo2 = Post(userId=3, locationId=1, captionRawData='{"blocks":[{"key":"3q4gs","text":"Neon signs are only cool if they are red","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo2)

    # demo3 = Post(userId=4, locationId=1, captionRawData='{"blocks":[{"key":"d0qlp","text":"Me at a party! ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo3)

    # demo4 = Post(userId=5, locationId=1, captionRawData='{"blocks":[{"key":"7ahvi","text":"Just a couple of friends!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo4)

    locations = Location.query.all()
    for i in range(len(mediadata)):
        text = fake.sentence(nb_words=10)
        userid = randint(1,20)
        albums = Album.query.filter(Album.userId == userid).all()
        album = albums[randint(0, len(albums)-1)]
        albumid = album.id
        equipments = Equipment.query.all()
        equip = equipments[randint(0, len(equipments)-1)]
        equipmentid = equip.id

        month = randint(1,12)
        maxday = 28
        if(month in [1, 3, 5, 7, 8, 10, 12]): maxday = 31
        elif(month in [4, 6, 9, 11]): maxday = 30
        day = randint(1,maxday)

        post = Post(userId = userid, locationId=randint(1,len(locations)),
                captionRawData='{"blocks":[{"key":"a12d1","text":' + f'"{text}"' + ',"type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
                categoryId = mediadata[i]['catid'],
                albumId = albumid,
                equipmentId = equipmentid,
                createdAt = datetime(year=randint(2016, 2021), month=month, day=day, hour=randint(0,23), minute=randint(0,59), second=randint(0, 59)),
                updatedAt = datetime(year=randint(2016, 2021), month=month, day=day, hour=randint(0,23), minute=randint(0,59), second=randint(0, 59))
            )
        db.session.add(post)
        

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the posts table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_posts():
    db.session.execute('TRUNCATE posts;')
    db.session.commit()
