const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const line = require('@line/bot-sdk');

const lineRouter = require('./routes/line');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use('/line/callback', line.middleware({
    channelAccessToken: process.env["CHANNEL_ACCESS_TOKEN"],
    channelSecret: process.env["CHANNEL_SECRET"]
}), lineRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
