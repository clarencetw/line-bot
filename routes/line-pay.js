const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const uuidv4 = require('uuid/v4');

router.get('/callback', async function (req, res, next) {
  const payments = await rp({
    method: 'POST',
    uri: `https://sandbox-api-pay.line.me/v2/payments/${req.query.transactionId}/confirm`,
    json: true,
    headers: {
      'X-LINE-ChannelId': process.env['LINE_PAY_CLIENT_ID'],
      'X-LINE-ChannelSecret': process.env['LINE_PAY_CLIENT_SECRET']
    },
    body: {
      "amount": 100,
      "currency": "TWD"
    }
  });

  res.send(`LINE pay transactionId: ${req.query.transactionId}</br> Confirm: ${JSON.stringify(payments)}`);
});

router.get('/payments/request', async function (req, res, next) {
  const payments = await rp({
    method: 'POST',
    uri: `https://sandbox-api-pay.line.me/v2/payments/request`,
    json: true,
    headers: {
      'X-LINE-ChannelId': process.env['LINE_PAY_CLIENT_ID'],
      'X-LINE-ChannelSecret': process.env['LINE_PAY_CLIENT_SECRET']
    },
    body: {
      "amount": 100,
      "productName": "ithome",
      "productImageUrl": "https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/bear-fly.svg",
      "confirmUrl": process.env['LINE_PAY_CONFIRM_URL'],
      "orderId": uuidv4(),
      "currency": "TWD"
    }
  });

  res.send(payments);
});

module.exports = router;
