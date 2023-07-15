const { monitor } = require("./app/controllers/monitor");
const { process } = require("./app/controllers/process");

const main = async () => {
  monitor();
  process();
};

main();
