const { Web3 } = require("web3");

const { ZERO_ADDR, SLEEP_PERIOD } = require("../config/constants");

const { findChain } = require("./utils");
const { updateTransaction, getPendingTransaction } = require("./server");
const {
  sendNativeOnDestChain,
  sendTokenOnDestChain,
} = require("./transaction");

exports.process = async () => {
  while (true) {
    console.log("process");
    let txn = await getPendingTransaction();
    if (txn != null) {
      let toChain = findChain(9000 + Number(txn.toChain));

      let destTxn =
        txn.token == ZERO_ADDR
          ? await sendNativeOnDestChain(toChain, txn)
          : await sendTokenOnDestChain(toChain, txn);

      updateTransaction(txn.id, destTxn);
    } else {
      await new Promise((r) => setTimeout(r, SLEEP_PERIOD));
    }
  }
};
