//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import { Company } from "./Company.sol";

contract CompanyFactory {

    event Creation(address _org, address _creator, string _what);
  
    address[] public listOfOrg;

    mapping(address=>string) public nameToAddress;

    function createCompany(string memory _name) external returns(address companyAddr){
        address newCompanyAddr = address(new Company(_name, msg.sender));

        listOfOrg.push(newCompanyAddr);

        nameToAddress[newCompanyAddr] = _name;

        emit Creation(newCompanyAddr, msg.sender, _name);

        return  newCompanyAddr;   
    }

    function totalAmounOfComapnies()public view returns(uint _num){
        return listOfOrg.length;
    }
}