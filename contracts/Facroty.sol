//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./CompanyBeacon.sol";
import "./Company.sol";
import { Company } from "./Company.sol";

contract CompanyFactory {

    event Creation(address _org, address _creator, string _what);
  
    address[] public listOfOrg;

    mapping(address=>string) public nameToAddress;


    CompanyBeacon immutable public beacon;

    constructor(address _initImpl){
        beacon = new CompanyBeacon(_initImpl);
    }

    //mapping(address=>bool) public companyCreated; // 1sr company is free

    function createCompany(string memory _name) external {

        // if(companyCreated[msg.sender]){
        //     require(msg.value >= 0.001 ether, "You already have company, to create another one you have to pay 0.001 eth");
        // }
        // companyCreated[msg.sender] = true;

        BeaconProxy newCompany = new BeaconProxy(
            address(beacon), 
            //abi.encodeWithSelector(0x8b39ef54, _name, msg.sender);
            abi.encodeWithSelector(Company.initialize.selector, _name, 0x98162D17D4d15c945B7418475EdEb4d9c0335684)                                                               
        );

        //address newCompanyAddr = address(new Company(_name, msg.sender)); // OLD VERSION

        address newCompanyAddr = address(newCompany);

        listOfOrg.push(newCompanyAddr);

        nameToAddress[newCompanyAddr] = _name;

        emit Creation(newCompanyAddr, msg.sender, _name);
    }

    function totalAmounOfComapnies()public view returns(uint _num){
        return listOfOrg.length;
    }
}