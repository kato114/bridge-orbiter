const db = require("./db");

exports.selectBlocks = () => {
  return db.prepare("SELECT * FROM blocks").get();
};

exports.selectBlockByChainID = (chainID) => {
  return db.prepare("SELECT * FROM blocks WHERE chain = ?").get(chainID);
};

exports.insertBlock = (chainID, blockNumber) => {
  return db
    .prepare(`INSERT INTO blocks (chain, number) VALUES (?, ?)`)
    .run([chainID, blockNumber]);
};

exports.updateBlock = (chainID, blockNumber) => {
  return db
    .prepare(`UPDATE blocks SET number = ? WHERE chain = ?`)
    .run([blockNumber, chainID]);
};
