//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TokenAdmin {

    ERC20 public token;

    function setToken(address _token) public {
        token = ERC20(_token);
    }

    function balanceContract()public view returns(uint){
        return token.balanceOf(address(this));
    }

// -------------- Access roles ---------------
    address public owner;

    address public administrator;

    constructor(address _owner){
        owner = _owner;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "You are not an owner!");
        _;
    }

    modifier ownerOrAdministrator(){
        require(owner == msg.sender || administrator == msg.sender, "You are not an owner!");
        _;
    }


    function sendOwnership(address _newOwner) external onlyOwner{
        owner = _newOwner;
    }

    function changeAdmin(address _newAdmin) external ownerOrAdministrator{
        administrator = _newAdmin;
    }

}
