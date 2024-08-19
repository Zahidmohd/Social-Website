const express = require('express');
const env = require('./config/environment');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const io = require('socket.io')(chatServer, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const chatSockets = require('./config/chat_sockets').chatSockets(io);

chatServer.listen(5000, () => {
    console.log('Chat server is listening on port 5000');
});
const path = require('path');

app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded());

app.use(cookieParser());
app.use(express.static('env.asset_path'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

(async function() {
    try {
        const store = MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/codeial',
            autoRemove: 'disabled'
        });

        app.use(session({
            name: 'codeial',
            secret: env.session_cookie_key,
            saveUninitialized: false,
            resave: false,
            cookie: {
                maxAge: (1000 * 60 * 100)
            },
            store: store
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(passport.setAuthenticatedUser);

        app.use(flash());
        app.use(customMware.setFlash);

        app.use('/', require('./routes'));

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (err) {
        console.error('Error in setting up session store', err);
    }
})();
