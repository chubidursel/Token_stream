//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StreamLogic.sol";

 // ---------- PROBLEMS & TASKS--------------
// Shoud it be tru ProxY? Can we create new contract with proxy?
// Banc Control

contract Company is StreamLogic {

    // ADD EVENTS
    event AddEmployee(address _who, uint _rate);
    event StartFlow(address _who, uint _rate);
    event FinishFlow(address _who, uint _earned);

    string public name;

    constructor (string memory _name, address _addressOwner)StreamLogic(_addressOwner){
        name = _name;
    }

    struct Employee{
        address who;
        uint256 flowRate; // 1 token / sec
        bool worker;
        //bool what kind of sallary he s going to get >>> h/$ or $/mounth
    }
    mapping(address => Employee) public allEmployee;

    address[] public allEmployeeList;

    function amountEmployee() public view returns(uint){
        return allEmployeeList.length;
    }

    modifier employeeExists(address _who){
            require(allEmployee[_who].worker, "This employee doesnt exist or deleted already");
            _;
    }

    // ------------------- MAIN FUNC ----------------

    function addEmployee(address _who, uint256 _rate) external ownerOrAdministrator isLiquidationHappaned{
        require(validToAddNew(_rate), "Balance is very low!");
        require(!allEmployee[_who].worker, "You already added!");

           Employee memory newEmployee = Employee({
			who: _who,
			flowRate: _rate,
			worker: true
		});

		allEmployee[_who] = newEmployee;

        allEmployeeList.push(_who);

        commonRateAllEmployee += _rate;

        emit AddEmployee(_who, _rate);
    }

    function modifyRate(address _who, uint256 _rate) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned {
        require(!getStream[_who].active, "You can change rate while streaming");
        allEmployee[_who].flowRate = _rate;
    }

    function deleteEmployee(address _who) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        require(!getStream[_who].active, "You can delete employee while streaming");

        commonRateAllEmployee -= getStream[_who].rate;

        _removeEmployee(_who);
    }

//-------------------- SECURITY / BUFFER --------------
// Set up all restrictoins tru DAO?

    //Solution #1 (restriction on each stream)
    uint public tokenLimitMaxHoursPerPerson = 20 hours; // Max amount hours of each stream with enough funds;

    function validToStream(address _who)private view returns(bool){
         return (allEmployee[_who].flowRate * tokenLimitMaxHoursPerPerson ) < currentBalanceContract();
    }

   
    // Solution #2 (restriction on all live stream)
    uint public tokenLimitMaxHoursAllStream = 10 hours;

    function validToStreamAll() private view returns(bool){

        if(amountActiveStreams() == 0) return true;

                // IE     400    =        2         *      20     *     10
        uint allStreamLimitToken = amountActiveStreams() * CR * tokenLimitMaxHoursAllStream;

        return allStreamLimitToken < currentBalanceContract();
    }

    // Solution #3 (restriction to add new employee)
    uint public hoursLimitToAddNewEmployee = 10 hours;

    uint public commonRateAllEmployee;

    function validToAddNew(uint _newRate)private view returns(bool){

            // IE   900    =        2+1             *         20+10     *    10
        uint tokenLimit = (amountEmployee() + 1) * (commonRateAllEmployee + _newRate) * hoursLimitToAddNewEmployee;

        return tokenLimit < currentBalanceContract();
        //PS "If company doesnt have enought tokens to pay all employee for next 100 hours they can add new employee"
     }

     function setHLAddnewEmployee(uint _newLimit) internal activeStream ownerOrAdministrator{
        // How can set this func? Mini DaO?
        hoursLimitToAddNewEmployee = _newLimit;
     }

     


// -------------- FUNCS with EMPLOYEEs ----------------
    //@dev Starts streaming token to employee
    function start(address _who) public employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        require(validToStream(_who), "Balance is very low");
        require(validToStreamAll(), "Balance is very low for all");

        uint rate =  allEmployee[_who].flowRate;

        startStream(_who, rate);
        emit StartFlow(_who, rate);
    }

    function finish(address _who) public employeeExists(_who) ownerOrAdministrator {
        uint256 salary = finishStream(_who);
        // if(!overWroked){
        //     function ifyouEmployDolboeb()
        // }
        token.transfer(_who, salary);
        emit FinishFlow(_who, salary);
    }

    // function withdrawEployee()public{
    //     // FUCS abour streaming within existing stream
    // }

// Decimals = 6 | 1 USDC = 1_000_000 tokens
    function getDecimals()public view returns(uint){
        return token.decimals();
    }

    function withdrawTokens()external onlyOwner activeStream isLiquidationHappaned{
        token.transfer(owner, balanceContract());
    }

    function isContractSet()public view returns(bool){
        // Check Token
        // Check Admin?
        // Check amount?
        return validToAddNew(10);
    }

    	// ----- FUNC to DELETE ELEMENT ADDRESS from activeStreamAddress
	function _indexEmployee(address searchFor) private view returns (uint256) {
  		for (uint256 i = 0; i < allEmployeeList.length; i++) {
    		if (allEmployeeList[i] == searchFor) {
      		return i;
    		}
  		}
  		revert("Not Found");
	}

	function _removeEmployee(address _removeAddr) private {

		uint index = _indexEmployee(_removeAddr);

        if (index > allEmployeeList.length) return;

        allEmployee[_removeAddr].worker = false; 

        for (uint i = index; i < allEmployeeList.length -1; i++){
            allEmployeeList[i] = allEmployeeList[i+1];
        }
        allEmployeeList.pop();
    }

    receive() external payable { }
    fallback() external payable { }

}