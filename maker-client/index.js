const { Web3 } = require("web3");
const axios = require("axios");

const TXNTYPE = Object.freeze({
  Native: Symbol(1),
  Token: Symbol(2),
});

require("dotenv").config();
const PRVKEY = process.env.PRVKEY;

const chains = require("./config/chains.json");
const ERC20ABI = require("./config/abis/ERC20.json");

const monitorBalance = async (web3, chainName, account, tokenList) => {
  const ethBalance = await web3.eth.getBalance(account);
  console.log(chainName + " ETH : " + ethBalance);

  for (const key in tokenList) {
    tokenList[key].contract.methods
      .balanceOf(account)
      .call()
      .then((res) => {
        console.log(chainName + " " + key + ":" + res);
      });
  }
};

const monitorChain = async (chain) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(chain["rpc"][0]));
  const account = web3.eth.accounts.privateKeyToAccount(PRVKEY).address;

  generateUrl(chain["api"], TXNTYPE.Native, account);

  let tokenList = {};
  for (let i = 0; i < chain["tokens"].length; i++) {
    let contract = new web3.eth.Contract(
      ERC20ABI,
      chain["tokens"][i]["address"]
    );
    tokenList[chain["tokens"][i]["name"]] = {
      ...chain["tokens"][i],
      contract: contract,
    };

    generateUrl(
      chain["api"],
      TXNTYPE.Token,
      account,
      chain["tokens"][i]["address"]
    );
  }

//   setInterval(monitorBalance, 60000, web3, chain["name"], account, tokenList);
};

const generateUrl = (apiInfo, urlType, address, contractAddr) => {
  let url = apiInfo["url"];
  url += "?module=account";
  url += "&action=" + (urlType == TXNTYPE.Native ? "txlist" : "tokentx");
  url += urlType == TXNTYPE.Native ? "" : "&contractaddress=" + contractAddr;
  url += "&page=1&offset=100&sort=asc";
  url += "&address=" + address;
  url += "&startblock=" + 0;
  url += "&endblock=latest";
  url += "&apikey=" + apiInfo["key"];

  console.log(url);
};

const callAPI = async (url) => {
  let retData = await axios.get(url).then(function (response) {
    return response.data;
  });

  return retData;
};

const init = async () => {
//   console.log(
//     await callAPI(
//       "https://api.etherscan.io/api?module=account&action=txlist&address=0xb64Ac149cB3b6ca2Fa08F103252F1ceCe03C962B&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=U6B1T739U9D1CCR54H783CQF5MYI2QHC3K"
//     )
//   );

    chains.forEach((chain) => {
      monitorChain(chain);
    });
};

init();
0;
