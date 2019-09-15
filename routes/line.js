require('dotenv').config();

const express = require('express');
const router = express.Router();

const line = require('@line/bot-sdk');

// create LINE SDK client
const client = new line.Client({
  channelAccessToken: process.env['CHANNEL_ACCESS_TOKEN'],
  channelSecret: process.env['CHANNEL_SECRET']
});

router.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`));

router.post('/', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.replyToken === '00000000000000000000000000000000' || event.replyToken === 'ffffffffffffffffffffffffffffffff') {
    return Promise.resolve(null);
  }
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  if (event.message.text === '測試1') {
    return client.replyMessage(event.replyToken, [
      {
        type: 'sticker',
        packageId: '1',
        stickerId: '1'
      },
      {
        type: 'image',
        originalContentUrl: 'https://developers.line.biz/media/messaging-api/messages/image-full-04fbba55.png',
        previewImageUrl: 'https://developers.line.biz/media/messaging-api/messages/image-167efb33.png'
      },
      {
        type: 'video',
        originalContentUrl: 'https://www.sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
        previewImageUrl: 'https://www.sample-videos.com/img/Sample-jpg-image-50kb.jpg'
      },
      {
        type: 'audio',
        originalContentUrl: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3',
        duration: '27000'
      },
      {
        type: 'location',
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203
      }
    ]);
  }
  if (event.message.text === '測試2') {
    return client.replyMessage(event.replyToken, [
      {
        type: 'imagemap',
        baseUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/rich',
        altText: 'Imagemap alt text',
        baseSize: {
          width: 1040,
          height: 1040
        },
        actions: [
          {
            area: {
              x: 0,
              y: 0,
              width: 520,
              height: 520
            },
            type: 'uri',
            linkUri: 'https://store.line.me/family/manga/en'
          },
          {
            area: {
              x: 520,
              y: 0,
              width: 520,
              height: 520
            },
            type: 'uri',
            linkUri: 'https://store.line.me/family/music/en'
          },
          {
            area: {
              x: 0,
              y: 520,
              width: 520,
              height: 520
            },
            type: 'uri',
            linkUri: 'https://store.line.me/family/play/en'
          },
          {
            area: {
              x: 520,
              y: 520,
              width: 520,
              height: 520
            },
            type: 'message',
            text: 'URANAI!'
          },
        ],
        video: {
          originalContentUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/imagemap/video.mp4',
          previewImageUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/imagemap/preview.jpg',
          area: {
            x: 280,
            y: 385,
            width: 480,
            height: 270,
          },
          externalLink: {
            linkUri: 'https://line.me',
            label: 'LINE'
          }
        },
      },
      {
        type: 'template',
        altText: 'Buttons alt text',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/buttons/1040.jpg',
          title: 'My button sample',
          text: 'Hello, my button',
          actions: [
            {
              label: 'Go to line.me',
              type: 'uri',
              uri: 'https://line.me'
            },
            {
              label: 'Say hello1',
              type: 'postback',
              data: 'hello こんにちは'
            },
            {
              label: '言 hello2',
              type: 'postback',
              data: 'hello こんにちは',
              text: 'hello こんにちは'
            },
            {
              label: 'Say message',
              type: 'message',
              text: 'Rice=米'
            },
          ],
        },
      },
      {
        type: 'flex',
        altText: 'this is a flex message',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'hello'
              },
              {
                type: 'text',
                text: 'world'
              }
            ]
          }
        }
      }
    ]);
  }
  if (event.message.text === 'Buttons template') {
    return client.replyMessage(event.replyToken,
      {
        type: 'template',
        altText: 'This is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
          title: 'Menu',
          text: 'Please select',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'message',
              label: 'it 邦幫忙鐵人賽',
              text: 'it 邦幫忙鐵人賽',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'https://ithelp.ithome.com.tw/2020ironman',
            },
          ],
        },
      });
  }
  if (event.message.text === 'Confirm template') {
    return client.replyMessage(event.replyToken,
      {
        type: 'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        },
      });
  }
  if (event.message.text === 'Carousel template') {
    return client.replyMessage(event.replyToken,
      {
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [
            {
              thumbnailImageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
              imageBackgroundColor: '#FFFFFF',
              title: 'this is menu',
              text: 'description',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://ithelp.ithome.com.tw/2020ironman',
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=111',
                },
                {
                  type: 'message',
                  label: 'it 邦幫忙鐵人賽',
                  text: 'it 邦幫忙鐵人賽',
                },
                {
                  type: 'uri',
                  label: 'View detail',
                  uri: 'https://ithelp.ithome.com.tw/2020ironman',
                },
              ],
            },
            {
              thumbnailImageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
              imageBackgroundColor: '#000000',
              title: 'this is menu',
              text: 'description',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://ithelp.ithome.com.tw/2020ironman',
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=222',
                },
                {
                  type: 'message',
                  label: 'it 邦幫忙鐵人賽',
                  text: 'it 邦幫忙鐵人賽',
                },
                {
                  type: 'uri',
                  label: 'View detail',
                  uri: 'https://ithelp.ithome.com.tw/2020ironman',
                },
              ],
            },
          ],
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
        },
      });
  }
  if (event.message.text === 'Image carousel template') {
    return client.replyMessage(event.replyToken,
      {
        type: 'template',
        altText: 'this is a image carousel template',
        template: {
          type: 'image_carousel',
          columns: [
            {
              imageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
              action: {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
            },
            {
              imageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
              action: {
                type: 'message',
                label: 'Yes',
                text: 'yes',
              },
            },
            {
              imageUrl: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
              action: {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            },
          ],
        },
      });
  }

  // create a echoing text message
  const echo = {
    type: 'text',
    text: event.message.text
  };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

module.exports = router;