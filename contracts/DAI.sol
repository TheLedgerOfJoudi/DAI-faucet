// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface DaiToken {
    function transfer(address destination, uint256 ammount)
        external
        returns (bool);

    function balanceOf(address owner) external view returns (uint256);
}

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
        //require (amount <= 0.1 ether);
        require(daiToken.balanceOf(address(this)) >= amount);
        daiToken.transfer(msg.sender, amount);
    }

    receive() external payable {}

    function getBalance(address addr) public view returns (uint256) {
        return daiToken.balanceOf(addr);
    }

    function destroy() public onlyOwner {
        daiToken.transfer(owner, daiToken.balanceOf(address(this)));
        selfdestruct(owner);
    }
}
