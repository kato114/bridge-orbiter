const Transaction = require("../models/transaction.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Transaction.findByFromTxn(req.body.fromTxn, (err, data) => {
    if (err) {
      const transaction = new Transaction(req.body);

      Transaction.create(transaction, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Transaction.",
          });
        else res.send({ status: 1, data: data });
      });
    } else {
      res.send({ status: 2, data: data });
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Transaction.updateById(req.params.id, new Transaction(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Transaction with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Transaction with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findLastBlockNumberByChainId = (req, res) => {
  Transaction.findLastBlockNumberByChainId(req.params.chainId, (err, data) => {
    if (err) {
      res.send({ status: 2, data: null });
    } else res.send({ status: 1, data: data });
  });
};

exports.findPendingTxn = (req, res) => {
  Transaction.findPendingTxn((err, data) => {
    if (err) {
      console.log(err)
      res.send({ status: 2, data: null });
    } else res.send({ status: 1, data: data });
  });
}

exports.findOne = (req, res) => {
  Transaction.findByFromTxn(req.params.hash, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Transaction with hash ${req.params.hash}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Transaction with hash " + req.params.hash,
        });
      }
    } else res.send({ status: 1, data: data });
  });
};

exports.findHistory = (req, res) => {
  const address = req.params.address;

  Transaction.getTotalCount(address, (err, data1) => {
    if(err) {
      res.send({
        status: 1,
        data: [],
        page: 1,
        total: 0,
      });
    } else {
      Transaction.getAll(address, req.query.page, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving transactions.",
          });
        else
          res.send({
            status: 1,
            data: data,
            page: req.query.page,
            total: data1.total,
          });
      });
    }
  })
};

// exports.findAllPublished = (req, res) => {
//   Transaction.getAllPublished((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving transactions.",
//       });
//     else res.send(data);
//   });
// };

// exports.delete = (req, res) => {
//   Transaction.remove(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Transaction with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete Transaction with id " + req.params.id,
//         });
//       }
//     } else res.send({ message: `Transaction was deleted successfully!` });
//   });
// };

// exports.deleteAll = (req, res) => {
//   Transaction.removeAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all transactions.",
//       });
//     else res.send({ message: `All Transactions were deleted successfully!` });
//   });
// };