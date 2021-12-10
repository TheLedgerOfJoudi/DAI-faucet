
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("DAI contract", () => {
    let DAI;
    let dai;
    let owner;
    let caller;

    beforeEach(async () => {
        DAI = await ethers.getContractFactory("DAI");
        [owner, caller] = await ethers.getSigners();
        dai = await DAI.deploy()
    })

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await dai.owner()).to.equal(owner.address);
        })
    })

    describe("Initializing the DAI interface", () => {
        it("Should fetch the DAI contract from its Rinkeby address", async () => {
            expect(await dai.daiToken()).to.equal("0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa");
        })
    })

    describe("Withdrawal", () => {
        it("Should allow callers to withdraw", async () => {
            console.log(caller.address)
            prevBalance = await dai.getBalance(caller.address);
            await dai.connect(caller).withdraw(1000000000000000000);
            currentBalance = await dai.getBalance(caller.address);
            expect(currentBalance).to.equal(prevBalance + 1000000000000000000);
        })
    })
})