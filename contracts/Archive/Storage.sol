// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Storage {

    uint public myVal;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    event Stored(uint newVal, uint time, string data, address who);

    function store(uint _newVal) external payable {
        myVal = _newVal;
        emit Stored(_newVal, block.timestamp, "Shalom!", msg.sender);
    }
    


    function transferOwnership(address _newOwner) external {
        require(msg.sender == owner);
        owner = _newOwner;
    }



    function getBalance() external view returns(uint) {
        return address(this).balance;
    }

    receive() external payable {}
}