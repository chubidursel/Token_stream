//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./StreamLogic.sol";


contract Transfer {

    uint public activeSt;
    function strartStream()public {
        activeSt++;
    }
}