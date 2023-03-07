//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompanyBeacon is Ownable{
    
    UpgradeableBeacon immutable beacon;

    address public implementation;

    constructor(address _impl){
        beacon = new UpgradeableBeacon(_impl);
        implementation = _impl;
        transferOwnership(tx.origin); //?????
    }

    function upgrageTo(address _newImpl) public {
        beacon.upgradeTo(_newImpl);
        implementation = _newImpl;
    }
}