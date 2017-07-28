const model = require('../models/database');

const saveNotificationsToDatabase = function(req){
    
    req.io.once('connection', async function(socket) {
        socket.on('new like', function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'like', req);
        });
        socket.on('new view', function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'view', req);
        });
        socket.on('new message', function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'message', req);
        });
        socket.on('new match', function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'match', req);
            saveNotificationAlertOther(data['to'], req.session.login, 'match', req);
        });
        socket.on('new dislike', function(data){
            saveNotificationAlertOther(req.session.login, data['to'], 'dislike', req);
        });
    });
}

const saveNotificationAlertOther = async function(sender, receiver, type, req){
    let db = await model.connectToDatabase();
    let blocked = await db.collection('blockedUsers').findOne({ userOnline: receiver, userBlocked: sender });

    if (blocked === null) {
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
}

module.exports = {
    saveNotificationsToDatabase: saveNotificationsToDatabase
}