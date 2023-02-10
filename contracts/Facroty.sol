//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import { Company } from "./Company.sol";

contract CompanyFactory {

    event Creation(address _org, address _creator, string _what);
  
    address[] public listOfOrg;

    mapping(address=>string) public nameToAddress;

    mapping(address=>bool) public companyCreated; // 1sr company is free

    function createCompany(string memory _name) external payable returns(address companyAddr){

        if(companyCreated[msg.sender]){
            require(msg.value >= 0.001 ether, "You already have company, to create another one you have to pay 0.001 eth");
        }
        companyCreated[msg.sender] = true;

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