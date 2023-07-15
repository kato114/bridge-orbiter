const ethers = require("ethers");

const { PRVKEY } = require("../config/constants");
const ERC20ABI = require("../config/abis/ERC20.json");

exports.sendNativeOnDestChain = async (toChain, txnData) => {
  let provider = new ethers.providers.JsonRpcProvider(toChain["rpc"][0]);
  let wallet = new ethers.Wallet(PRVKEY.substr(2), provider);
  let walletSigner = wallet.connect(provider);

  let nonce = await wallet.getTransactionCount("pending");
  let gas_price = await provider.getGasPrice();
  // let gas_limit = ethers.utils.hexlify("0x100000");

  let tx = {
    from: txnData.maker,
    to: txnData.receiver,
    value: txnData.toAmount,
    nonce: nonce,
    // gasLimit: gas_limit,
    gasPrice: gas_price,
  };

  let txn = await walletSigner.sendTransaction(tx);
  return txn;
};

exports.sendTokenOnDestChain = async (toChain, txnData) => {
  let provider = new ethers.providers.JsonRpcProvider(toChain["rpc"][0]);
  let wallet = new ethers.Wallet(PRVKEY.substr(2), provider);

  let contract = new ethers.Contract(txnData.token2, ERC20ABI, provider);
  let contractWithSigner = contract.connect(wallet);

  let txn = await contractWithSigner.transfer(txnData.receiver, txnData.toAmount);
  return txn;
};