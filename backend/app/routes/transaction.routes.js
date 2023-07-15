module.exports = (app) => {
  const transactions = require("../controllers/transaction.controller.js");

  var router = require("express").Router();

  router.get("/:hash", transactions.findOne);
  router.get("/pending/first", transactions.findPendingTxn);
  router.get("/history/:address", transactions.findHistory);
  router.get("/block/:chainId", transactions.findLastBlockNumberByChainId);
  router.post("/", transactions.create);
  router.put("/:id", transactions.update);

  // router.get("/", transactions.findAll);
  // router.get("/published", transactions.findAllPublished);
  // router.delete("/:id", transactions.delete);
  // router.delete("/", transactions.deleteAll);

  app.use("/api/transactions", router);
};
