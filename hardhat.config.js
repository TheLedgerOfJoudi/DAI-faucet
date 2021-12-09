require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: "", //Infura url with projectId
      accounts: [""] // add the account that will deploy the contract (private key)
     },
   }
};
