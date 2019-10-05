const express = require('express');
const router = express.Router();
const rp = require('request-promise');

router.get('/', function (req, res, next) {
  const state = 'state';
  res.redirect(`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${process.env['LINE_NOTIFY_CLIENT_ID']}&redirect_uri=${process.env['LINE_NOTIFY_CALLBACK_URL']}&scope=notify&state=${state}`);
});

router.get('/callback', async function (req, res, next) {
  const message = '2020 iT邦幫忙鐵人賽';
  const oauthToken = await rp({
    method: 'POST',
    uri: `https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env['LINE_NOTIFY_CALLBACK_URL']}&client_id=${process.env['LINE_NOTIFY_CLIENT_ID']}&client_secret=${process.env['LINE_NOTIFY_CLIENT_SECRET']}`,
    json: true
  });

  const notify = await rp({
    method: 'POST',
    url: 'https://notify-api.line.me/api/notify',
    auth: {
      'bearer': oauthToken.access_token
    },
    form: {
      message,
      imageThumbnail: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
      imageFullsize: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
      stickerPackageId: 2,
      stickerId: 150,
    },
    json: true
  });

  if (notify.status === 200) {
    return res.send('LINE notify send success!');
  }
  res.send('LINE notify send failed!');
});

module.exports = router;