const model = require('../models/database');

const saveNotificationsToDatabase = function(req){
    req.io.once('connection', function(socket) {
        socket.on('new like', async function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'like', req);
        });
        socket.on('new view', async function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'view', req);
        });
        socket.on('new message', async function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'message', req);
        });
        socket.on('new match', async function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'match', req);
            saveNotificationAlertOther(data['to'], req.session.login, 'match', req);
        });
        socket.on('new dislike', async function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'dislike', req);
        });
    });
}

const saveNotificationAlertOther = async function(sender, receiver, type, req){
    model.insertData('notifications', {
        from: sender,
        to: receiver,
        type: type,
        date: new Date(),
        seen: false
    });
    req.io.sockets.emit('Show ' + type + ' to user', {
        from: sender,
        to: receiver
    });
}

module.exports = {
    saveNotificationsToDatabase: saveNotificationsToDatabase
}