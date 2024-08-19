module.exports.chatSockets = function(socketServer) {
    const io = require('socket.io')(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.sockets.on('connection', function(socket) {
        console.log('New connection received:', socket.id);

        socket.on('disconnect', function() {
            console.log('Socket disconnected:', socket.id);
        });

        socket.on('join_room', function(data) {
            console.log('Joining request received:', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', {
                user: data.user_email, // Adjusted to match the emitted data
                chatroom: data.chatroom
            });
        });

        socket.on('send_message', function(data) {
            console.log('Send message received:', data); // Debugging line
            io.in(data.chatroom).emit('receive_message', {
                message: data.message,
                user_email: data.user_email,
                chatroom: data.chatroom
            });
        });
        
    });
}
