//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";

contract CompanyBeacon {
    
    UpgradeableBeacon immutable beacon;

    address public implementation;

    constructor(address _impl){
        beacon = new UpgradeableBeacon(_impl);
        implementation = _impl;
        //transferOwnership(tx.origin); //????? import "@openzeppelin/contracts/access/Ownable.sol";
    }

    function upgrageTo(address _newImpl) public {
        beacon.upgradeTo(_newImpl);
        implementation = _newImpl;
    }
}