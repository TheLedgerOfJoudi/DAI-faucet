
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("DAI contract", () => {
    let DAI;
    let dai;
    let owner;
    let caller;
    let ABI = [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "_spender",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "approve",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "_from",
            "type": "address"
        }, {
            "name": "_to",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "INITIAL_SUPPLY",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "name": "",
            "type": "uint8"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "_spender",
            "type": "address"
        }, {
            "name": "_subtractedValue",
            "type": "uint256"
        }],
        "name": "decreaseApproval",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{
            "name": "_owner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "name": "balance",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
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
    }, {
        "constant": false,
        "inputs": [{
            "name": "_spender",
            "type": "address"
        }, {
            "name": "_addedValue",
            "type": "uint256"
        }],
        "name": "increaseApproval",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{
            "name": "_owner",
            "type": "address"
        }, {
            "name": "_spender",
            "type": "address"
        }],
        "name": "allowance",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
        }, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }],
        "name": "Approval",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "from",
            "type": "address"
        }, {
            "indexed": true,
            "name": "to",
            "type": "address"
        }, {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }],
        "name": "Transfer",
        "type": "event"
    }]

    beforeEach(async () => {
        DAI = await ethers.getContractFactory("DAI");
        [owner, caller] = await ethers.getSigners();
        dai = await DAI.deploy()
    })

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
})