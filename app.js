const env = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const methodOverride = require('method-override');


var colors = require('colors');

colors.setTheme({
    info: 'bgGreen',
    help: 'cyan',
    warn: 'yellow',
    success: 'bgBlue',
    error: 'red'
});
var colors = require('colors');

colors.setTheme({
    info: 'bgGreen',
    help: 'cyan',
    warn: 'yellow',
    success: 'bgBlue',
    error: 'red'
});

// const multer = require('multer');



const sql = require('./database/mysql');

env.config();
const app = express();



app.use(cors());
app.use(methodOverride('_method'));

sql.connect();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // for parsing application/json


app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json({
    extended: true
})); // true : any type - false : string or array

app.use(express.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded






app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
const studentRoutes = require('./routes/student');
const homeRoutes = require('./routes/home');
const apiRoutes = require('./routes/api');
const apiNotificationRoutes = require('./routes/notification_api');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/files'));


app.use(cookieParser());



app.use('/admin', adminRoutes);
app.use('/staff', staffRoutes);

app.use('/student', studentRoutes);
app.use('/api', apiRoutes);
app.use('/notification_api', apiNotificationRoutes);
app.use('/', homeRoutes);
//app.use('/etude/edit/id=:id_projet_data', staffRoutes)
// Home Page
app.use(homeRoutes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

    console.log('  Phase :' + process.env.ENV_NAME.info);

    console.log(`  Server started @ ${PORT}`.warn);


    console.log(` platforme realisé par Mohamed Ali Barhoumi ! `.success);
    console.log('The value of PORT is:', PORT);
});