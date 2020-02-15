const { keccakHash } = require("../util");
const _ = require("lodash");

class Node {
  constructor() {
    this.value = null;
    this.childMap = {};
  }
}

class Trie {
  constructor() {
    this.head = new Node();
    this.generateRootHash();
  }

  generateRootHash() {
    this.rootHash = keccakHash(this.head);
  }
  get({ key }) {
    let node = this.head;

    for (let character of key) {
      if (!node.childMap[character]) {
        return null;
      } else {
        node = node.childMap[character];
      }
    }
    //Helps to get a consistent hash even when the value of the data has changed
    return _.cloneDeep(node.value);
  }

  put({ key, value }) {
    let node = this.head;

    for (let character of key) {
      if (!node.childMap[character]) {
        node.childMap[character] = new Node();
      }
      node = node.childMap[character];
    }
    node.value = value;
    this.generateRootHash();
  }
}

module.exports = Trie;
