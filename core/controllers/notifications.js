const model = require('../models/database');

const saveNotificationsToDatabase = function(req){
    req.io.once('connection', function(socket) {
        socket.on('new like', async function(data){
            let db = await model.connectToDatabase();
            let sender = await db.collection('users').findOne( { login: req.session.login } );
            let receiver = await db.collection('users').findOne( { login: data['to'] } );           
            model.insertData('notifications', {
                from: req.session.login,
                to: data['to'],
                type: 'like',
                date: new Date(),
                seen: false
            });
            req.io.sockets.emit('Show like to user', {
                from: req.session.login,
                to: data['to']
            });
        });
        socket.on('new view', async function(data){});
        socket.on('new message', async function(data){});
        socket.on('new match', async function(data){});
        socket.on('new dislike', async function(data){});
    });
}

module.exports = {
    saveNotificationsToDatabase: saveNotificationsToDatabase
}