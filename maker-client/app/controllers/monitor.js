const { Web3 } = require("web3");

const {
  PRVKEY,
  TXNTYPE,
  FUNCNAME,
  SWAPABI,
  ZERO_ADDR,
} = require("../config/constants");
const { chains } = require("../config/chains");

const {
  generateUrl,
  generateDetailUrl,
  callAPI,
  findChain,
} = require("./utils");
const { getLastBlockNumber, registerTransaction } = require("./server");

const { RLP } = require("ethers/lib/utils");

const monitorNative = async (chain, apiUrl, account) => {
  let data = await callAPI(apiUrl);

  if (data.status != 1) return;

  let txnList = data.result;
  for (let i = 0; i < txnList.length; i++) {
    let toChain = findChain(txnList[i].value.substr(-4));
    if (toChain == undefined || toChain.internalId == chain.internalId)
      continue;

    if (txnList[i].to.toLowerCase() == account.toLowerCase()) {
      let regData = {
        sender: txnList[i].from,
        maker: txnList[i].to,
        receiver: txnList[i].from,
        token: ZERO_ADDR,
        token2: ZERO_ADDR,
        slippage: 0,
        fromChain: chain.internalId,
        fromTxn: txnList[i].hash,
        fromAmount: txnList[i].value,
        toChain: toChain.internalId,
        toAmount: txnList[i].value,
        startDate: txnList[i].timeStamp,
        blockNumber: txnList[i].blockNumber,
      };

      await registerTransaction(regData);
    }
  }
};

const monitorToken = async (web3, chain, apiUrl, account) => {
  let data = await callAPI(apiUrl);

  if (data.status != 1) return;

  let txnList = data.result;
  for (let i = 0; i < txnList.length; i++) {
    if (txnList[i].to.toLowerCase() == account.toLowerCase()) {
      let detailAPIUrl = generateDetailUrl(chain["api"], txnList[i].hash);
      let detailData = await callAPI(detailAPIUrl);
      let inputData = detailData.result.input;

      let toChain;
      let regData = {
        sender: txnList[i].from,
        maker: txnList[i].to,
        receiver: txnList[i].from,
        token: txnList[i].contractAddress,
        token2: "",
        slippage: 0,
        fromChain: chain.internalId,
        fromTxn: txnList[i].hash,
        fromAmount: txnList[i].value,
        toChain: 0,
        toAmount: txnList[i].value,
        startDate: txnList[i].timeStamp,
        blockNumber: txnList[i].blockNumber,
      };

      if (inputData.substr(0, 10) == FUNCNAME.SWAP) {
        let decoded = web3.eth.abi.decodeParameters(
          SWAPABI,
          inputData.slice(10)
        );

        let callData = RLP.decode(decoded.data);
        regData.toChain = web3.utils.hexToNumberString(callData[0]);
        regData.token2 = callData[1];
        regData.receiver = callData[2];
        regData.toAmount = web3.utils.hexToNumberString(callData[3]);
        regData.slippage = web3.utils.hexToNumberString(callData[4]);

        toChain = findChain(9000 + Number(regData.toChain));
      } else if (inputData.substr(0, 10) == FUNCNAME.TRANSFER) {
        regData.toChain = regData.fromAmount.substr(-4) - 9000;

        let tokenName;
        let fromDecimal, toDecimal;
        for (let j = 0; j < chain.tokens.length; j++) {
          if (
            chain.tokens[j].address.toLowerCase() ==
            txnList[i].contractAddress.toLowerCase()
          ) {
            tokenName = chain.tokens[j].symbol;
            fromDecimal = chain.tokens[j].decimals;
          }
        }

        toChain = findChain(regData.fromAmount.substr(-4));
        if (toChain == undefined) continue;

        for (let j = 0; j < toChain.tokens.length; j++) {
          if (toChain.tokens[j].symbol == tokenName) {
            regData.token2 = toChain.tokens[j].address;
            toDecimal = toChain.tokens[j].decimals;
          }
        }

        if (fromDecimal != toDecimal) {
          regData.toAmount =
            (regData.toAmount * 10 ** toDecimal) / 10 ** fromDecimal;
          regData.toAmount = regData.toAmount.toFixed(0).toString();
        }
      } else {
        continue;
      }

      if (toChain == undefined || toChain.internalId == chain.internalId)
        continue;

      await registerTransaction(regData);
    }
  }
};

const monitorChain = async (chain) => {
  let web3 = new Web3(new Web3.providers.HttpProvider(chain["rpc"][0]));
  let account = web3.eth.accounts.privateKeyToAccount(PRVKEY).address;

  let currentBlock = await web3.eth.getBlockNumber();
  let prevBlock = await getLastBlockNumber(chain["internalId"]);
  if (prevBlock === undefined) return;
  if (prevBlock === null) prevBlock = 0;

  let nativeAPIUrl = generateUrl(
    chain["api"],
    TXNTYPE.Native,
    account,
    prevBlock,
    currentBlock
  );

  await monitorNative(chain, nativeAPIUrl, account);

  for (let i = 0; i < chain["tokens"].length; i++) {
    let tokenAPIUrl = generateUrl(
      chain["api"],
      TXNTYPE.Token,
      account,
      prevBlock,
      currentBlock,
      chain["tokens"][i]["address"]
    );
    await monitorToken(web3, chain, tokenAPIUrl, account);
  }
};

exports.monitor = async () => {
  while (true) {
    console.log("monitor");
    for (let i = 0; i < chains.length; i++) {
      await monitorChain(chains[i]);
    }
  }
};
