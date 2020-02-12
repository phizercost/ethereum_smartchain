const { GENESIS_DATA } = require("../config");
const { keccakHash } = require("../util");
const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt("f".repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64;

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  static calculateBlockTargetHash({ lastBlock }) {
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(
      16
    );

    if (value.length > HASH_LENGTH) {
      //Internal to JavaScript, the MAX_HASH_VALUE is a big number which through conversion ends up adding an additional character.
      //The risk here is to end up having a Hash of 65 characters. So in the worst case scenario we will return the highest value of the hexadeximal 'f' repeated 64 times
      return "f".repeat(HASH_LENGTH);
    }
    //As we are dividing the MAX_HASH_VALUE with the difficulty, the more difficult the level becomes the smaller will the target hash become
    //With a risk of having the length of the target hash smaller than 64 characters
    return "0".repeat(HASH_LENGTH - value.length) + value;
  }

  static mineBlock({ lastBlock, beneficiary }) {
    const target = Block.calculateBlockTargetHash({ lastBlock });

    let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

    //Randomly generating a nonce until the value of the underTargetHash is less than the target.
    //Need to have powerful CPU and enough power for that
    do {
      timestamp = Date.now();

      //can be used to calculate a temporary header value
      truncatedBlockHeaders = {
        parentHash: keccakHash(lastBlock.blockHeaders),
        beneficiary,
        difficulty: lastBlock.blockHeaders.difficulty + 1,
        number: lastBlock.blockHeaders.number + 1,
        timestamp
      };

      header = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);

      underTargetHash = keccakHash(header + nonce);
    } while (underTargetHash > target);

    return new this({
      blockHeaders: {
        ...truncatedBlockHeaders,
        nonce
      }
    });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

module.exports = Block;

const block = Block.mineBlock({
  lastBlock: Block.genesis(),
  beneficiary: "foo"
});

