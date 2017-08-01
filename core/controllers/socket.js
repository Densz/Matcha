const model = require('../models/database');

const connexionChat = function(req){
    req.io.once('connection', function(socket) {
        // Connection to chat - set user online or offline
        if (req.session.login !== undefined) {
            model.updateData('users', { login: req.session.login }, { $set: { status: 'online', lastConnection: new Date() } });
            req.io.sockets.emit('new user connection', req.session.login);
        } else {
            model.updateData('users', { login: req.session.login }, { $set: { status: 'offline', lastConnection: new Date() } });
            req.io.sockets.emit('user disconnected', req.session.login);           
        }
        socket.on('disconnect', function(socket) {
            req.io.sockets.emit('user disconnected', req.session.login);            
            model.updateData('users', { login: req.session.login }, { $set: { status: 'offline', lastConnection: new Date() } });
        })
        
        getMessagesFromChat(req, socket);
    });
}

const getMessagesFromChat = async function(req, socket) {
    socket.on('send message to back', async function(data){
        let db = await model.connectToDatabase();
        let receiver = await db.collection('users').findOne({ login: data['to'] });
        let sender = await db.collection('users').findOne({ login: data['from'] });
        req.io.sockets.emit('Alert people new message', {
            to: receiver,
            from: sender,
            message: data['message']
        });
        model.insertData('conversations', { from: req.session.login, to: data['to'], message: data['message'], date: new Date() })
        let value = {
            from: sender,
            to: receiver,
            message: data['message']
        };
        req.io.emit('send message response back', value);
    })
}

module.exports = {
    connexionChat: connexionChat
}