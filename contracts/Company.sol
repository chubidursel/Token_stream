//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StreamLogic.sol";

 // ---------- PROBLEMS & TASKS--------------
// Shoud it be tru ProxY? Can we create new contract with proxy?
// Banc Control

contract Company is StreamLogic {

    // ADD EVENTS
    event AddEmployee(address _who, uint _time);
    event StartFlow(address _who, uint _time);

    string public name;
    uint public totalAmountEmployee;

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

        totalAmountEmployee++;

        emit AddEmployee(_who, block.timestamp);
    }

    function modifyRate(address _who, uint256 _rate) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned {
        require(getStream[_who].active, "You can change rate while streaming");
        allEmployee[_who].flowRate = _rate;
    }

    function deleteEmployee(address _who) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        require(getStream[_who].active, "You can change rate while streaming");
        delete allEmployee[_who];
    }

//-------------------- SECURITY --------------
// Set up all restrictoins tru DAO?

    //Solution #1 (restriction on each stream)
    uint public tokenLimitMaxHoursPerPerson = 20 hours; // Max amount hours of each stream with enough funds;

    function validToStream(address _who)private view returns(bool){
         return (allEmployee[_who].flowRate * tokenLimitMaxHoursPerPerson ) < balanceContract();
    }

   
    // Solution #2 (restriction on all live stream)
    uint public tokenLimitMaxHoursAllStream = 10 hours;

    function validToStreamAll() private view returns(bool){

        if(amountActiveStreams() == 0) return true;

                // IE     400    =        2         *      20     *     10
        uint allStreamLimitToken = amountActiveStreams() * CR * tokenLimitMaxHoursAllStream;

        return allStreamLimitToken < balanceContract();
    }

    // Solution #3 (restriction to add new employee)
     uint public hoursLimitToAddNewEmployee = 10 hours;

     function validToAddNew(uint _newRate)private view returns(bool){

            // IE   900    =        2+1             *         20+10     *    100
        uint tokenLimit = (totalAmountEmployee + 1) * (CR + _newRate) * hoursLimitToAddNewEmployee;

        return tokenLimit < balanceContract();
        //PS "If company doesnt have enought tokens to pay all employee for next 100 hours they can add new employee"
     }

     //---- ADD BUFFER ---------
     // rate / time /  money


// -------------- FUNCS with EMPLOYEEs ----------------
    //@dev Starts streaming token to employee
    function start(address _who) public employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        require(validToStream(_who), "Balance is very low");
        require(validToStreamAll(), "Balance is very low for all");

        startStream(_who, allEmployee[_who].flowRate);
    }

    function finish(address _who) public employeeExists(_who) ownerOrAdministrator {
        uint256 salary = finishStream(_who);
        // if(!overWroked){
        //     function ifyouEmployDolboeb()
        // }
        token.transfer(_who, salary);
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

    receive() external payable { }
    fallback() external payable { }

}