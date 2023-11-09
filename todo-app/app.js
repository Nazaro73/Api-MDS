let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const dotenv = require ('dotenv');
dotenv.config();
const middleware = require('./middleware');


let indexRouter = require('./routes/index');
let taskRouter = require('./routes/task2');
let userRouter = require('./routes/user2');
const { testMiddleware } = require('./middleware');
let app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
//app.use(middleware.testMiddleware)
app.use('/', indexRouter);
app.use('/task', taskRouter);



module.exports = app;
