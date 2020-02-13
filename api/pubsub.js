const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-d5df6c9e-638c-4951-9bbb-2dae8fdc443a",
  subscribeKey: "sub-c-e7ed0954-4e38-11ea-bf00-e20787371c02",
  secretKet: "sec-c-MGEyYjVhZGYtMjAzZC00YjI2LTg3ZjItOTFlODkwYTYyYzBk"
};

const CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK"
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);
    this.subscriberToChannels();
    this.listen();
  }

  subscriberToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP)
    });
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  listen() {
    this.pubnub.addListener({
      message: messageObject => {
        console.log("messageObject:", messageObject);
      }
    });
  }
}
module.exports = PubSub;

setTimeout(() => {
  const pubsub = new PubSub();
  pubsub.publish({
    channel: CHANNELS_MAP.TEST,
    message: "Augustin Matata Ponyo"
  });
}, 3000);
