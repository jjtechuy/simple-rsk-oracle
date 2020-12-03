const SimpleRskOracle = artifacts.require("SimpleRskOracle");

const PROVIDER_ACCOUNT = "0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4"

module.exports = async function(deployer) {
  await deployer
      .deploy(SimpleRskOracle)
      .then(async (ins) => {
        return await ins.setOracleAddress(PROVIDER_ACCOUNT)
      })
};
