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
