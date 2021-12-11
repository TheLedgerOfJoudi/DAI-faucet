require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: "", //Infura url with projectId
      accounts: [""
      ] // add your rinkeby accounts here (private keys)
    },
  }
};
