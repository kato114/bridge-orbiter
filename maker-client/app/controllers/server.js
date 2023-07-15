const axios = require("axios");

const { SERVER } = require("../config/constants");

exports.getLastBlockNumber = async (chainId) => {
  try {
    let retData = await axios
      .get(SERVER + "/api/transactions/block/" + chainId)
      .then((response) => {
        return response.data;
      });

    if(retData.status != 1) return undefined;
    return retData.data.prevBlock;
  } catch (error) {
    return { status: 0 };
  }
};

exports.registerTransaction = async (txnData) => {
  try {
    let retData = await axios
      .post(SERVER + "/api/transactions", txnData)
      .then((response) => {
        return response.data;
      });

    return retData;
  } catch (error) {
    return { status: 0 }
  }
};

exports.updateTransaction = async (id, txnData) => {
  let retData = await axios
    .put(SERVER + "/api/transactions/" + id, {
      toTxn: txnData.hash,
      endDate: Date.now(),
    })
    .then((response) => {
      return response.data;
    });

  return retData;
};

exports.getPendingTransaction = async () => {
  try {
    let retData = await axios
      .get(SERVER + "/api/transactions/pending/first")
      .then((response) => {
        return response.data;
      });

    if (retData.status != 1) return null;
    return retData.data;
  } catch (error) {
    return { status: 0 };
  }
};