var SimpleWallet = artifacts.require("./SimpleWallet.sol");
module.exports = function(deployer) {
  deployer.deploy(SimpleWallet);
};
