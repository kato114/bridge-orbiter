const axios = require("axios");
const { TXNTYPE } = require("../config/constants");
const { chains } = require("../config/chains");

exports.generateUrl = (
  apiInfo,
  urlType,
  address,
  startBlock,
  endBlock,
  contractAddr
) => {
  let url = apiInfo["url"];
  url += "?module=account";
  url += "&action=" + (urlType == TXNTYPE.Native ? "txlist" : "tokentx");
  url += urlType == TXNTYPE.Native ? "" : "&contractaddress=" + contractAddr;
  url += "&page=1&offset=1000&sort=asc";
  url += "&address=" + address;
  url += "&startblock=" + startBlock;
  url += "&endblock=" + endBlock;
  url += "&apikey=" + apiInfo["key"];

  return url;
};

exports.generateDetailUrl = (apiInfo, txnHash) => {
  let url = apiInfo["url"];
  url += "?module=proxy&action=eth_getTransactionByHash";
  url += "&txhash=" + txnHash;
  url += "&apikey=" + apiInfo["key"];

  return url;
};

exports.callAPI = async (url) => {
  return await axios.get(url).then((response) => {
    return response.data;
  });
};

exports.findChain = (code) => {
  for (let i = 0; i < chains.length; i++) {
    if (code == 9000 + Number(chains[i].internalId)) return chains[i];
  }
};
