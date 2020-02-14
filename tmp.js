const Trie = require('./store/trie')
const {keccakHash} = require('./util')

const trie = new Trie();
const accountData = {balance:1000};
const transaction = {data:accountData};

trie.put({key:'foo', value: transaction});
const retrievedTran = trie.get({key: 'foo'});
const hash1 = keccakHash(retrievedTran);
console.log('hash1', hash1)

accountData.balance += 50;

const hash2 = keccakHash(retrievedTran);
console.log('hash2', hash2)
