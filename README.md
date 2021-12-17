# Playing around with the DAI token in Hardhat - How exactly?

We will build a Hardhat project to test out some stuff with the DAI token on Ethereum's Rinkeby. We expect you to have some knowledge of Solidity and the ERC20 standard. So yeah, let's get to it. 

## Before writing the code - Setting up a hardhat project:
  Open your terminal, create a directory for your project, and cd into it. Done? Good, now we have to run these commands:
  
  ``` npm init --yes ```
  
  ``` npm install --save-dev hardhat ```
  
  ``` npx hardhat ```
  
  Now you see some prompts, choose:
  
  ``` Create an empty hardhat.config.js ```
  
  so we can manage the configuration ourselves.
  Now, run this:
  
  ``` npm install -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai ```
  
  Open the project in your editor and include this line in hardhat.config.js:
  
  ``` require('@nomiclabs/hardhat-waffle') ```
  
  Also, include this snippet in hardhat.config.js:
  
  ```js
  task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  });
  ```
  
  This is a hardhat task, so that when you run:
  
  ``` npx hardhat accounts --network rinkeby ```
  
  in your terminal, the Ethereum addresses you are using for this project will show up.
  But wait, what addresses? Well, we have to let Hardhat know what addresses we will be using to sign transactions. We suppose that you have two ready-to-use Ethereum accounts for this project. If you don't, please do it. It is really easy, in Metamask you just click on the top right button and hit create account.
  Go ahead and change ```module.exports``` in hardhat.config.js so it looks just like this:
  
  ```js
    module.exports = {
    solidity: "0.7.3",
    networks: {
        rinkeby: {
        url: "", //Infura url with projectId
        accounts: [
            "private key 1",
            "private key 2"
        ] // add your rinkeby accounts here (private keys)
        },
    }
    };
```

Inside ``` accounts ```, add two Ethereum private keys that you control. Remember, don't leave these in plain text if you are planning to share the code publicly somewhere. Why two? We need two accounts for testing later on. 
You might be wondering, what is this Infura url thing? This is for the next subquest, take a breath and let's continue.

## Before writing the code - Linking with Infura:
Infura provides instant access over HTTPS and WebSockets to the Ethereum network. Go to https://infura.io/, create an account if you don't have one, and create a project. Created? Cool, go to settings > keys > ENDPOINTS, change to Rinkeby in the drop-down list, copy that url, and add it to the url field in ``` module.exports```.
 Now we are good to go, almost. We still have to get some DAI test tokens to your main address (i.e. the one linked with the first private key hardhat.config.js, we will see later why). You can now run
 
``` npx hardhat accounts --network rinkeby ```

Do these addresses look familiar? Yes, those are your two addresses!

## Before writing the code - Getting DAI rinkeby tokens:
  This is really easy to do.
   
   1 - Go to https://app.compound.finance/.
   
   2 - Click on Dai in Supply Markets.
   
   3 - Choose withdraw.
   
   4 - Scroll down and click Faucet.
   
   5 - Your Metamask pops up, confirm the transaction.
   
   6 - Open your Metamask, Choose assets, scroll down, click import tokens.
   
   7 - Paste this address:``` 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa ``` 
   (Dai's Rinkeby address). 
   
   8 - Now you have 100 testnet DAIs, can you see them?

## Writing the code - DAI.sol Contract:
Ok great, now we can write our contract. It is a faucet contract. That is, you send DAIs to it and people can withdraw them. Why? Because you are a super nice person. Create a directory in your project root, name it "contracts". Now, cd into it and create a DAI.sol file, paste this:
```js
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface DaiToken {
    function transfer(address destination, uint256 amount)
        external
        returns (bool);

    function balanceOf(address owner) external view returns (uint256);
}
```
Don't worry about this possibly-weird interface here. Take a look at the second code snippet to understand what is happening:
```js 
contract DAI {
    DaiToken public daiToken;
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
        daiToken = DaiToken(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa); 
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }

    function withdraw(uint256 amount) public {
        require(daiToken.balanceOf(address(this)) >= amount);
        daiToken.transfer(msg.sender, amount);
    }
}
```
Pretty simple, huh? We pull the DAI Rinkeby contract specification using its address (remember this address? It is the one we imported to Metamask).
Now let's add some helper methods under ```withdraw()```, we are still inside the DAI contract:
```js
    receive() external payable {}
    
    function getBalance(address addr) public view returns (uint256) {
        return daiToken.balanceOf(addr);
    }

    function destroy() public onlyOwner {
        daiToken.transfer(owner, daiToken.balanceOf(address(this)));
        selfdestruct(owner);
    }
```
Now that the contract is ready, we can move on to deployment and testing. Come on we are close!

## Writing the code - Starting with tests:
Create a directory in your project root, name it "test". Now, cd into it and create a DAI.js file.
Paste these two lines:
```js
const { expect } = require('chai')
const { ethers } = require('hardhat')
```
Those are required for testing. chai is a famous assertion library, ethers is a library used for interacting with the Ethereum Blockchain. Let's start testing!
All the following code in this quest will be inside a big ``` describe() ``` block, include this in DAI.js:
```js
describe("DAI contract", () => {
    let DAI;
    let dai;
    let owner;
    let caller;
    let ABI = [{
        "constant": false,
        "inputs": [{
            "name": "_to",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transfer",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    beforeEach(async () => {
        DAI = await ethers.getContractFactory("DAI");
        [owner, caller] = await ethers.getSigners();
        dai = await DAI.deploy()
    })
})
```
A lot of stuff going on here. The first varaibles are not explicitly initilaized, except ``` ABI ```. Notice that we have to include only the ```transfer``` function specification here, no need for the whole ERC20 ABI as we will only use ```transfer``` later on in testing. The ```beforeEach``` block will run before each testcase. It fetches the artifacts, assigns it to DAI, fetches the signers (your accounts that you included in hardhat.config.js previously), assigns to ```owner``` and ```caller```, and deploys the contract to Rinkeby with your first address as a ```msg.sedner```.

## Writing the code - Writing the actual tests:
Inside the main ```describe()``` block mentioned previously (right under ```beforeEach()```), copy and paste this:
```js
 describe("Deployment", function () {
        this.timeout(40000);
        it("Should set the right owner", async () => {
            expect(await dai.owner()).to.equal(owner.address);
        })
    })

    describe("Initializing the DAI interface", function () {
        this.timeout(40000);
        it("Should fetch the DAI contract from its Rinkeby address", async () => {
            expect(await dai.daiToken()).to.equal("0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa");
        })
    })
```
The code snippet above covers two test cases. The first one is testing whether the contract owner is set correctly or not, it is supposed to be your address. The second one makes sure that the contract connects to the DAI contract on Rinkeby. This is the third time we see this address. 
All is going well? Let's finish off testing with the last and most important testcase, paste this inside the big ```describe```:
```js
 describe("Withdrawal", function () {
        this.timeout(40000);
        it("Should allow callers to withdraw", async () => {
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }
            let address = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
            let token = await new ethers.Contract(address, ABI, owner);
            await token.transfer(dai.address, ethers.utils.parseEther("2"));
            prevBalance = await dai.getBalance(caller.address);
            await dai.connect(caller).withdraw(ethers.utils.parseEther("1"));
            await sleep(10000);
            currentBalance = await dai.getBalance(caller.address);
            expect(parseInt(currentBalance)).to.equal(parseInt(prevBalance) + parseInt(1000000000000000000));
        })
    })
```
Don't worry much about the ```sleep()``` thing, this is just to force our script to wait a bit until changes are saved to the Blockchain. The script:
 
 1 - Sends two DAIs to our contract (change it to anything larger than one if you like).
 
 2 - Queries your second account's balance.
 
 3 - Calls ```withdraw()``` with your second account.
 
 4 - Waits a bit to avoid getting outdated data in the next query.
 
 5 - Queries your second account's current balance.
 
 6 - Checks if one token has been transferred two ```caller``` (your second account).
 Congrats! you did it. We now only need to play around 
 with this project in the terminal.
 
 
## The fun stuff:
 
 Go to your project root, type: 
 ``` npx hardhat compile ```
 This should compile your contracts and generate artifacts.
 Now type this:
 
 ``` npx hardhat test --network rinkeby ```
 
 Spoiler: Infura may bug you here, don't worry about it. 
 
 Another spoiler: This is Blockchain, so the tests may take some considerable time to finish. If you got some timeout error, increase the timeout in tests. It is working fine for me at the time, but who knows!
 
 Wait for it to complete all transactions. Once you get all green flags in your terminal, go and check your wallet (second account), you now have successfully withdrawn a DAI. The faucet contract is good to go!
 
 Stay tuned and happy coding my geeky friend.
