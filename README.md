# Matcha
Tinder-like app made by 42 Students

#### Commands to import Users - Database
* mongoimport --db matcha --collection users --drop --file /mnt/c/42/matcha/public/dump/users.json --jsonArray
* mongo

#### At 42
* npm install --save
* /usr/local/mongodb/bin/mongod --dbpath ~/42/matcha/
* /usr/local/mongodb/bin/mongoimport --db matcha --collection users --drop --file /tmp/dzheng/public/dump/users.json
* /usr/local/mongodb/bin/mongoimport --db matcha --collection views --drop --file /tmp/dzheng/public/dump/views.json
* /usr/local/mongodb/bin/mongo
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