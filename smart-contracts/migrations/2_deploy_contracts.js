const SimpleRskOracle = artifacts.require("SimpleRskOracle");

module.exports = function(deployer) {
  deployer.deploy(SimpleRskOracle);
};
