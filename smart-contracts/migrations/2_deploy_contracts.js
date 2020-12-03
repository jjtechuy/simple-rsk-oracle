const SimpleRskOracle = artifacts.require("SimpleRskOracle");

const PROVIDER_ACCOUNT = "0xaa05714c5a31eba90dcdaad6f492c87b8b3d8583"

module.exports = async function(deployer) {
  await deployer
      .deploy(SimpleRskOracle)
      .then(async (ins) => {
        return await ins.setOracleAddress(PROVIDER_ACCOUNT)
      })
};
