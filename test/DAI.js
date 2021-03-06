
const { expect } = require('chai')
const { ethers } = require('hardhat')

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
