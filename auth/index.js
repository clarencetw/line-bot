const passport = require('passport');
const LineStrategy = require('passport-line-auth').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new LineStrategy({
    channelID: process.env['LINE_LOGIN_CHANNEL_ID'],
    channelSecret: process.env['LINE_LOGIN_CHANNEL_SECRET'],
    callbackURL: process.env['LINE_LOGIN_CALLBACK_URL'],
    scope: ['profile', 'openid', 'email'],
    botPrompt: 'normal'
  },
  function (accessToken, refreshToken, params, profile, cb) {
    const { email } = jwt.decode(params.id_token);
    profile.email = email;
    return cb(null, profile);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
