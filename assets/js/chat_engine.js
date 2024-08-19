class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // Establish connection to the server
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        // Handle the connection event
        this.socket.on('connect', function () {
            console.log('Connection established using sockets!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function (data) {
                console.log('A user joined!', data);
            });
        });

        // Send a message on clicking the send button
        $('#send-message').click(function () {
            let msg = $('#chat-message-input').val();

            if (msg.trim() !== '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
                $('#chat-message-input').val(''); // Clear the input field after sending
            }
        });

        // Listen for incoming messages
        self.socket.on('receive_message', function (data) {
            console.log('Message received:', data.message);

            let newMessage = $('<li>').addClass(data.user_email === self.userEmail ? 'self-message' : 'other-message');

            newMessage.append($('<span>').text(data.message));
            newMessage.append($('<sub>').text(data.user_email));

            $('#chat-messages-list').append(newMessage);

            console.log('Message appended to chatbox.');
        });
    }
}
