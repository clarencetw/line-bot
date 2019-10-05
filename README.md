# LINE BOT

LINE BOT express example

## How to use

### Install

``` shell
$ npm install
```

### Add env file

``` shell
touch .env
```

### Set file

```
CHANNEL_SECRET=YOUR_CHANNEL_SECRET
CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
```

### Change baseURL
Change baseURL if need to support image, video, audio.

```
BASE_URL=https://your.base.url:3000
```

### Run webhook server

``` shell
$ npm start
```

webhook listens on `http://your.base.url:3000/line/callback`.

## Use change richmenu
```
RICHMENUID_DEFAULT=richmenu-e97b71914d6ffffffffac0da43445966
```
Image URL: https://static.line-scdn.net/biz-app/16bd9ea9e03/manager/static/LINE_rich_menu_design_template.zip
```JSON
{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": false,
  "name": "Nice richmenu",
  "chatBarText": "Tap here",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 2500,
        "height": 1686
      },
      "action": {
        "type": "postback",
        "data": "action=buy&itemid=123"
      }
    }
  ]
}
```

```
RICHMENUID_CONTROLLER=richmenu-e97b71914d6ffffffffac0da43445966
```
Image URL: https://developers.line.biz/media/messaging-api/rich-menu/controller-rich-menu-image-e1734c7d.jpg
```JSON
{
    "size":{
        "width":2500,
        "height":1686
    },
    "selected":false,
    "name":"Controller",
    "chatBarText":"Controller",
    "areas":[
        {
          "bounds":{
              "x":551,
              "y":325,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"up"
          }
        },
        {
          "bounds":{
              "x":876,
              "y":651,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"right"
          }
        },
        {
          "bounds":{
              "x":551,
              "y":972,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"down"
          }
        },
        {
          "bounds":{
              "x":225,
              "y":651,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"left"
          }
        },
        {
          "bounds":{
              "x":1433,
              "y":657,
              "width":367,
              "height":367
          },
          "action":{
              "type":"message",
              "text":"btn b"
          }
        },
        {
          "bounds":{
              "x":1907,
              "y":657,
              "width":367,
              "height":367
          },
	        "action": {
	          "type": "postback",
	          "data": "action=btn&message=a"
	        }
        }
    ]
  }
```

### Use line login
```
LINE_LOGIN_CHANNEL_ID=YOUR_LINE_LOGIN_CHANNEL_ID
LINE_LOGIN_CHANNEL_SECRET=YOUR_LINE_LOGIN_CHANNEL_SECRET
LINE_LOGIN_CALLBACK_URL=http://localhost:3000/login/line/return
```

### Use line notify
```
LINE_NOTIFY_CLIENT_ID=YOUR_LINE_NOTIFY_CLIENT_ID
LINE_NOTIFY_CLIENT_SECRET=YOUR_LINE_NOTIFY_CLIENT_SECRET
LINE_NOTIFY_CALLBACK_URL=http://localhost:3000/login/line_notify/callback
```