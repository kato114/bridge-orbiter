const sql = require("./db.js");

// constructor
const Transaction = function (transaction) {
  this.sender = transaction.sender;
  this.maker = transaction.maker;
  this.receiver = transaction.receiver;
  this.token = transaction.token;
  this.token2 = transaction.token2;
  this.slippage = transaction.slippage;
  this.fromChain = transaction.fromChain;
  this.fromTxn = transaction.fromTxn;
  this.fromAmount = transaction.fromAmount;
  this.toChain = transaction.toChain;
  this.toTxn = transaction.toTxn;
  this.toAmount = transaction.toAmount;
  this.startDate = transaction.startDate;
  this.endDate = transaction.endDate;
  this.blockNumber = transaction.blockNumber;
};

Transaction.create = (newTransaction, result) => {
  sql.query("INSERT INTO transactions SET ?", newTransaction, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created transaction: ", {
      id: res.insertId,
      ...newTransaction,
    });
    result(null, { id: res.insertId, ...newTransaction });
  });
};

Transaction.updateById = (id, transaction, result) => {
  sql.query(
    "UPDATE transactions SET toTxn = ?, endDate = ? WHERE id = ?",
    [transaction.toTxn, transaction.endDate, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Transaction with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated transaction: ", { id: id, ...transaction });
      result(null, { id: id, ...transaction });
    }
  );
};

Transaction.findByFromTxn = (fromTxn, result) => {
  sql.query(
    `SELECT * FROM transactions WHERE fromTxn = "${fromTxn}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found transaction: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Transaction with the fromTxn
      result({ kind: "not_found" }, null);
    }
  );
};

Transaction.findLastBlockNumberByChainId = (chainId, result) => {
  sql.query(
    `SELECT MAX(blockNumber) as prevBlock FROM transactions WHERE fromChain = "${chainId}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found transaction: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Transaction with the fromTxn
      result({ kind: "not_found" }, null);
    }
  );
};

Transaction.findPendingTxn = (result) => {
  sql.query(
    `SELECT * FROM transactions WHERE toTxn is NULL ORDER BY id`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found transaction: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Transaction with the fromTxn
      result({ kind: "not_found" }, null);
    }
  );
};

Transaction.getAll = (address, page, result) => {
  let query = "SELECT * FROM transactions";

  if (address) {
    query += ` WHERE sender LIKE '%${address}%'`;
  }
  let offset = (page - 1) * 10;
  query += ` ORDER BY startDate DESC LIMIT 10 OFFSET ${offset}`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Transaction.getTotalCount = (address, result) => {
  sql.query(
    `SELECT count(*) as total FROM transactions WHERE sender LIKE '%${address}%'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found transaction: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Transaction with the fromTxn
      result({ kind: "not_found" }, null);
    }
  );
};

Transaction.getAllPublished = (result) => {
  sql.query("SELECT * FROM transactions WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("transactions: ", res);
    result(null, res);
  });
};

Transaction.remove = (id, result) => {
  sql.query("DELETE FROM transactions WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Transaction with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted transaction with id: ", id);
    result(null, res);
  });
};

Transaction.removeAll = (result) => {
  sql.query("DELETE FROM transactions", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} transactions`);
    result(null, res);
  });
};

module.exports = Transaction;
