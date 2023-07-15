require("dotenv").config();

exports.PRVKEY = process.env.PRVKEY;
exports.DBNAME = process.env.DBNAME;
exports.SERVER = process.env.SERVER;

exports.SLEEP_PERIOD = 2000;

exports.ZERO_ADDR = "0x0000000000000000000000000000000000000000";

exports.TXNTYPE = Object.freeze({
  Native: Symbol(1),
  Token: Symbol(2),
});

exports.FUNCNAME = Object.freeze({
  SWAP: '0x43a0a7f2',
  TRANSFER: '0xa9059cbb',
});

exports.SWAPABI = [
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "address",
    name: "token",
  },
  {
    type: "uint256",
    name: "value",
  },
  {
    type: "bytes",
    name: "data",
  },
];