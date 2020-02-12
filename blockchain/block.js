const { GENESIS_DATA } = require("../config");

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16);

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  static calculateBlockTargetHash({lastBlock}){
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);

    if (value.length > HASH_LENGTH){
        //Internal to JavaScript, the MAX_HASH_VALUE is a big number which through conversion ends up adding an additional character. 
        //The risk here is to end up having a Hash of 65 characters. So in the worst case scenario we will return the highest value of the hexadeximal 'f' repeated 64 times
        return 'f'.repeat(HASH_LENGTH);
    }
    //As we are dividing the MAX_HASH_VALUE with the difficulty, the more difficult the level becomes the smaller will the target hash become
    //With a risk of having the length of the target hash smaller than 64 characters
    return '0'.repeat(HASH_LENGTH - value.length) + value;
  }

  static mineBlock({ lastBlock, beneficiary }) {

  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

module.exports = Block;
