require('dotenv').config();

const express = require('express');
const router = express.Router();

const line = require('@line/bot-sdk');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const ithome = require('../models/ithome');

const baseURL = process.env['BASE_URL'];
const lineImgURL = 'https://d.line-scdn.net/n/line_lp/img/ogimage.png';

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
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log('Test hook recieved: ' + JSON.stringify(event.message));
  }
  console.log(`User ID: ${event.source.userId}`);

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken, event.source);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      console.log(`Followed this bot: ${JSON.stringify(event)}`);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'Got followed event'
      });

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      console.log(`Joined: ${JSON.stringify(event)}`);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `Joined ${event.source.type}`
      });

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'memberJoined':
      console.log(`MemberJoined: ${JSON.stringify(event)}`);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `MemberJoined ${event.source.type}`
      });

    case 'memberLeft':
      return console.log(`MemberLeft: ${JSON.stringify(event)}`);

    case 'postback':
      let data = querystring.parse(event.postback.data);
      if (data.action === 'url' && data.item === 'clarence') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'https://ithelp.ithome.com.tw/users/20117701/ironman/2634'
        });
      }
      if (data.action === 'buy' && data.itemid === '123') {
        return request.post({
          url: `https://api.line.me/v2/bot/user/${event.source.userId}/richmenu/${process.env['RICHMENUID_CONTROLLER']}`,
          auth: {
            bearer: process.env['CHANNEL_ACCESS_TOKEN']
          }
        }, function (err, httpResponse, body) {
          console.log(body);
        });
      }
      if (data.action === 'btn' && data.message === 'a') {
        return request.post({
          url: 'https://api.line.me/v2/bot/richmenu/bulk/link',
          auth: {
            bearer: process.env['CHANNEL_ACCESS_TOKEN']
          },
          body: {
            richMenuId: process.env['RICHMENUID_DEFAULT'],
            userIds: [event.source.userId]
          },
          json: true
        }, function (err, httpResponse, body) {
          console.log(body);
        });
      }
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `Got postback: ${JSON.stringify(data)}`
      });

    case 'beacon':
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `Got beacon: ${event.beacon.hwid}`
      });

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

async function handleText(message, replyToken, source) {
  switch (message.text) {
    case '測試1':
      return client.replyMessage(replyToken, [
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

    case '測試2':
      return client.replyMessage(replyToken, [
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

    case 'Buttons template':
      return client.replyMessage(replyToken,
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

    case 'Confirm template':
      return client.replyMessage(replyToken,
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

    case 'Carousel template':
      return client.replyMessage(replyToken,
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

    case 'Image carousel template':
      return client.replyMessage(replyToken,
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

    case 'quick reply':
      return client.replyMessage(replyToken,
        {
          type: 'text',
          text: 'Quick reply sample 😁',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ithome Clarence 鐵人賽',
                  data: 'action=url&item=clarence',
                  text: 'ithome Clarence 鐵人賽'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ithome Clarence',
                  text: 'https://ithelp.ithome.com.tw/users/20117701'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'camera',
                  label: 'Send camera'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'cameraRoll',
                  label: 'Send camera roll'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'location',
                  label: 'Send location'
                }
              }
            ]
          },
        }
      );

    default:
      switch (true) {
        case /^鐵人賽/.test(message.text):
          const parseTemp = /^鐵人賽(\d\d)/.exec(message.text);
          if (parseTemp) {
            const res = await ithome.ithome2020api(parseTemp[1]);

            return client.replyMessage(replyToken, {
              type: 'flex',
              altText: `鐵人賽組別：${res.teams.title}`,
              contents: {
                type: 'bubble',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'image',
                          url: 'https://ithelp.ithome.com.tw/images/ironman/11th/event/kv_event/kv-bg-addfly.png',
                          aspectMode: 'cover',
                          aspectRatio: '2:1',
                          flex: 1,
                          size: 'full'
                        }
                      ]
                    }
                  ],
                  paddingAll: '0px'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              contents: [],
                              size: 'xl',
                              wrap: true,
                              text: res.teams.title,
                              color: '#ffffff',
                              weight: 'bold'
                            },
                            {
                              type: 'text',
                              text: res.teams.desc,
                              color: '#ffffffcc',
                              size: 'sm',
                              wrap: true
                            }
                          ],
                          spacing: 'sm'
                        },
                        {
                          type: 'text',
                          text: `${res.teams.bar}%`,
                          color: '#ffffffde',
                          margin: 'lg',
                          size: 'xs'
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'filler'
                                }
                              ],
                              width: `${res.teams.bar}%`,
                              height: '6px',
                              backgroundColor: '#ffffff5A'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'sm',
                                  wrap: true,
                                  margin: 'lg',
                                  color: '#ffffffde',
                                  text: `累計文章：${res.teams.cumulativeArticle}`
                                },
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'sm',
                                  wrap: true,
                                  margin: 'lg',
                                  color: '#ffffffde',
                                  text: `團隊人數：${res.teams.numberTeams}人`
                                },
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'sm',
                                  wrap: true,
                                  margin: 'lg',
                                  color: '#ffffffde',
                                  text: `團隊狀態：${res.teams.teamStatus}`
                                }
                              ]
                            }
                          ],
                          paddingAll: '13px',
                          backgroundColor: '#ffffff1A',
                          cornerRadius: '2px',
                          margin: 'xl'
                        }
                      ]
                    }
                  ],
                  paddingAll: '20px',
                  backgroundColor: '#464F69'
                }
              }
            });
          }

        default:
          console.log(`Echo message to ${replyToken}: ${message.text}`);
          const echo = {
            type: 'text',
            text: message.text
          };
          return client.replyMessage(replyToken, echo);
      }
  }
}

function handleImage(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.jpg`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
        };
      });
  } else if (message.contentProvider.type === 'external') {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'image',
          originalContentUrl,
          previewImageUrl,
        }
      );
    });
}

function handleVideo(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.mp4`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: lineImgURL,
        };
      });
  } else if (message.contentProvider.type === 'external') {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'video',
          originalContentUrl,
          previewImageUrl,
        }
      );
    });
}

function handleAudio(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.m4a`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
        };
      });
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'audio',
          originalContentUrl,
          duration: message.duration,
        }
      );
    });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId)
    .then((stream) => new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(downloadPath);
      stream.pipe(writable);
      stream.on('end', () => resolve(downloadPath));
      stream.on('error', reject);
    }));
}

function handleLocation(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'location',
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude,
    }
  );
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'sticker',
      packageId: message.packageId,
      stickerId: message.stickerId,
    }
  );
}

module.exports = router;
