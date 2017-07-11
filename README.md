# Matcha
Tinder made by 42 Students

### Need to do
* Reset password (need to check if we have to do it)
* Upload photos
* Like
* Match / Swipe
* Chat (socket.io)
* Notifications

### Things done
* Sign In
* Templates (HTML/CSS/Bootstrap)
* Sign up
* Location

#### Details
* Babel
* Use of classes

#### Commands to import Users - Database
* mongoimport --db matcha --collection users --drop --file /mnt/c/42/matcha/public/dump/users.json --jsonArray
* mongo
* use matcha
* db.users.createIndex({location: "2dsphere"});
* db.users.getIndexes()
* [
        {
                "v" : 1,
                "key" : {
                        "_id" : 1
                },
                "ns" : "matcha.users",
                "name" : "_id_"
        },
        {
                "v" : 1,
                "key" : {
                        "location" : "2dsphere"
                },
                "ns" : "matcha.users",
                "name" : "location_2dsphere"
        }
]