const model = require('../models/database');

const saveNotificationsToDatabase = function(req){
    req.io.once('connection', function(socket) {
        socket.on('new like', async function(data){
            saveNotificationAlertOther(req, data, 'like');
        });
        socket.on('new view', async function(data){
            saveNotificationAlertOther(req, data, 'view');            
        });
        socket.on('new message', async function(data){
            saveNotificationAlertOther(req, data, 'message');            
        });
        socket.on('new match', async function(data){
            saveNotificationAlertOther(req, data, 'match');
        });
        socket.on('new dislike', async function(data){
            saveNotificationAlertOther(req, data, 'dislike');
        });
    });
}

const saveNotificationAlertOther = async function(req, data, type){
    let db = await model.connectToDatabase();
    let sender = await db.collection('users').findOne( { login: req.session.login } );
    let receiver = await db.collection('users').findOne( { login: data['to'] } );           
    model.insertData('notifications', {
        from: req.session.login,
        to: data['to'],
        type: type,
        date: new Date(),
        seen: false
    });
    req.io.sockets.emit('Show ' + type + ' to user', {
        from: req.session.login,
        to: data['to']
    });
}

module.exports = {
    saveNotificationsToDatabase: saveNotificationsToDatabase
}