# Matcha

## Introduction
Tinder-like app made by 42 Students.
Online dating website made with NodeJS, Express JS, MongoDB, EJS Template and Bootstrap.



#### Commands to import Users - Database


## Installation

### Install dependencies
Before installing make sure you have [downloaded and installed Node.js](https://nodejs.org/en/).
``` shell
$ npm install
```

### Import database using MongoDB
Before entering all the commands below, make sure you have [installed MongoDB](https://www.mongodb.com/download-center?ct=atlasheader#community)
``` shell
$ /usr/local/mongodb/mongoimport --db matcha --collection users --drop --file /mnt/c/42/matcha/public/dump/users.json --jsonArray
$ /usr/local/mongodb/mongo
$ /usr/local/mongodb/bin/mongod --dbpath ~/42/matcha/
$ /usr/local/mongodb/bin/mongoimport --db matcha --collection users --drop --file /*PROJECT_PATH*/public/dump/users.json
$ /usr/local/mongodb/bin/mongoimport --db matcha --collection views --drop --file /*PROJECT_PATH*/public/dump/views.json
$ /usr/local/mongodb/bin/mongo
$ use matcha
$ db.users.createIndex({location: "2dsphere"});
```
### Start 
``` shell
$ npm start
```