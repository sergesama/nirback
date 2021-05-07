var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var bookRouter = require('./routes/bookRouter');
var competenceRouter = require('./routes/competenceRouter');
var competenceprofileRouter = require('./routes/competenceprofileRouter');
var commentRouter = require('./routes/commentRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const testRouter = require('./routes/testRouter');
var config = require('./config');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

var passport = require('passport');
var authenticate = require('./authenticate');

// Connection URL
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/books',bookRouter);
app.use('/competences',competenceRouter);
app.use('/competence_profiles',competenceprofileRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoriteRouter);
app.use('/comments',commentRouter);
app.use('/test',testRouter);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
