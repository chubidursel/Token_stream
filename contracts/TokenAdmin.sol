//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

abstract contract TokenAdmin {

    IERC20 public token;

    function setToken(address _token) public {
        token = IERC20(_token);
    }

    function balanceContract()public view returns(uint){
        return token.balanceOf(address(this));
    }

    function avalibleBalanceContract()public virtual view returns(uint){ }

    function currentBalanceContract()public virtual view returns(uint){ }

// -------------- Access roles ---------------
    address public owner;

    address public administrator;

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
