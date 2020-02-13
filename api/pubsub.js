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
  constructor({ blockchain }) {
    this.pubnub = new PubNub(credentials);
    this.blockchain = blockchain;
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
        const { channel, message } = messageObject;
        const parsedMessage = JSON.parse(message);
        console.log("Message received. Channel:", channel);
        
        switch (channel) {
          case CHANNELS_MAP.BLOCK:
            console.log("block message", message);
            this.blockchain
              .addBlock({ block: parsedMessage })
              .then(() => console.log("New block accepted"))
              .catch(error =>
                console.error("New block rejected:", error.message)
              );
            break;
          default:
            return;
        }
      }
    });
  }

  broadcastBlock(block) {
    this.publish({
      channel: CHANNELS_MAP.BLOCK,
      message: JSON.stringify(block)
    });
  }
}
module.exports = PubSub;
