# Matcha
Tinder-like app made by 42 Students

### Need to do
* Put filter by in homepage
* Check Location / javascript is enough ?

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

#### At 42
* Check all urls (check function)
* Check PORT