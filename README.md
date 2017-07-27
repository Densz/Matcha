# Matcha
Tinder-like app made by 42 Students

### Need to do
* Reset password with email => Kneth
* Check Location / javascript is enough ?
* Search users Page - Show online user
* Block user and everything coming from him / Notifications / SearchPage 
* Upload photos => Arnaud
* L’utilisateur doit clairement voir si le profil consulté est connecté ou “like” le sien, et doit pouvoir “unlike”.

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