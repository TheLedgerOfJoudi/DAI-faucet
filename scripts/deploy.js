const hre = require("hardhat"); //import the hardhat

async function main() {
    const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

    console.log("Deploying contracts with the account:", deployer.address);

    const DAI = await hre.ethers.getContractFactory("DAI"); // Getting the Contract
    const dai = await DAI.deploy(); //deploying the contract

    await dai.deployed(); // waiting for the contract to be deployed

    console.log("DAI deployed to:", dai.address); // Returning the contract address on the rinkeby
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); // Calling the function to deploy the contract 
