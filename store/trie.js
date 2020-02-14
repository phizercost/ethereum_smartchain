const {keccakHash} = require('../util');
const _ = require('lodash');

class Node {
  constructor() {
    this.value = null;
    this.childMap = {};
  }
}

class Trie {
  constructor() {
    this.head = new Node();
    this.generateRootHash()
  }

  generateRootHash(){
      this.rootHash = keccakHash(this.head);
  }
  get({ key }) {
      let node = this.head;

      for(let char of key){
          if(node.childMap[char]){
              node= node.childMap[char]
          }
      }
      return _.cloneDeep(node.value);
  }

  put({ key, value }) {
    let node = this.head;

    for (let char of key) {
      if (!node.childMap[char]) {
          node.childMap[char] = new Node();
      }
      node = node.childMap[char];
    }
    node.value = value;

    this.generateRootHash();
  }
}

module.exports = Trie;
