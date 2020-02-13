const { GENESIS_DATA, MINE_RATE } = require("../config");
const { keccakHash } = require("../util");
const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt("f".repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64;

class Block {
  constructor({ blockHeaders, transactionSeries }) {
    this.blockHeaders = blockHeaders;
    this.transactionSeries = transactionSeries;
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

  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock.blockHeaders;
    if (timestamp - lastBlock.blockHeaders.timestamp > MINE_RATE) {
      return difficulty - 1;
    }

    if (difficulty < 1) {
      return 1;
    }
    return difficulty + 1;
  }

  static mineBlock({ lastBlock, beneficiary, transactionSeries }) {
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
        difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
        number: lastBlock.blockHeaders.number + 1,
        timestamp,

        /*
        Not final. will be refactored once tries are implemented
        */
        transactionRoot: keccakHash(transactionSeries)
      };

      header = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);

      underTargetHash = keccakHash(header + nonce);
    } while (underTargetHash > target);

    return new this({
      blockHeaders: {
        ...truncatedBlockHeaders,
        nonce
      }, transactionSeries
    });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static validateBlock({ lastBlock, block }) {
    return new Promise((resolve, reject) => {
      //Check if block is genesis and resolve
      if (keccakHash(block) === keccakHash(Block.genesis())) {
        return resolve();
      }

      //Check if the headers were not manipulated
      if (
        keccakHash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash
      ) {
        return reject(
          new Error("The parent hash must be hash of the last block's headers")
        );
      }

      if (block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
        return reject(new Error("The block must increment the number by 1"));
      }

      if (
        Math.abs(
          lastBlock.blockHeaders.difficulty - block.blockHeaders.difficulty
        ) > 1
      ) {
        return reject(new Error("The difficulty must only adjust by 1"));
      }

      const target = Block.calculateBlockTargetHash({ lastBlock });
      const { blockHeaders } = block;
      const { nonce } = blockHeaders;
      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;

      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);

      if (underTargetHash > target) {
        return reject(
          new Error("The block does not meet the proof of work requirement")
        );
      }

      return resolve();
    });
  }
}

module.exports = Block;
