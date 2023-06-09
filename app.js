var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import flash dan session
const flash = require("connect-flash");
const session = require("express-session");

// mengimport mongoose
const mongoose = require("mongoose");

// mengimpor method override
const methodOverride = require("method-override");

// ConnectMongoDB
mongoose.connect("mongodb://127.0.0.1:27017/apotek", {
  // untuk pengertian fungsi dibawah ini di dokumentasi resminya sangat dijelaskan, jangan lupa dibaca.
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// mengambil fungsi router
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const transaksiRouter = require('./routes/transaksi');

// const userController = require('./controllers/userController');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// menggunakan method override
app.use(methodOverride("_method"));

// menggunakan session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: null},// umur cookies 1 jam
  })
)

// menggunakan flash
app.use(flash());

// default
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

const checkLoggedIn = (req, res, next) => {
  if (req.session.loggedIn) {
    // Jika pengguna sudah login, lanjutkan ke rute berikutnya
    next();
  } else {
    console.log("=============== SESSION END ===================");
    res.redirect("/");
  }
};


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// Router Path
app.use('/', loginRouter);
app.use('/user', checkLoggedIn,userRouter);
app.use('/transaksi', checkLoggedIn,transaksiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
