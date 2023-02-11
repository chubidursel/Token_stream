//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

contract Test{
    function getTimeStamp()public view returns(uint){
        return block.timestamp;
    }
}

