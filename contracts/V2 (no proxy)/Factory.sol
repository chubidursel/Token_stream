//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./Company.sol";


contract CompanyFactorySimple {

    event Creation(address _org, address _creator, string _what);
  
    address[] public listOfOrg;

    mapping(address=>string) public nameToAddress;

    //mapping(address=>bool) public companyCreated; // 1sr company is free

    function createCompany(string memory _name) external {

        address newCompanyAddr = address(new CompanySimple(_name, msg.sender)); 

        listOfOrg.push(newCompanyAddr);

        nameToAddress[newCompanyAddr] = _name;

        emit Creation(newCompanyAddr, msg.sender, _name);
    }

    function totalAmounOfComapnies()public view returns(uint _num){
        return listOfOrg.length;
    }
}