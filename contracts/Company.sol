//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./StreamLogic.sol";
import "./ArrayLib.sol";
import "./Outsource.sol";


contract Company is StreamLogic, OutsourceTask, Initializable{

	using ArrayLib for address[];

    event AddEmployee(address _who, uint _rate, uint when);
    event WithdrawEmpl(address who, uint tokenEarned, uint when);

    string public name;

// INSTAED CONSTRUCTOR
    function initialize(string memory _name, address _owner) public initializer {
        name = _name;
        owner = _owner;
        tokenLimitMaxHoursPerPerson = 10 hours;
    }

	/**
     * @notice Employee profile info
     * @param who The employee address
     * @param flowrate The employee`s rate. token pro sec
     * @param worker Check if this is an employee
     */	
    struct Employee{
        address who;
        uint256 flowRate; 
        bool worker;
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

	/**
     * @notice Create Employee profile
     * @param _who The employee address
     * @param _rate The employee`s rate. token pro sec
     */	
    function addEmployee(address _who, uint256 _rate) external ownerOrAdministrator isLiquidationHappaned{
        //require(validToAddNew(_rate), "Balance is very low!");
        require(!allEmployee[_who].worker, "You already added!");

           Employee memory newEmployee = Employee({
			who: _who,
			flowRate: _rate,
			worker: true
		});

		allEmployee[_who] = newEmployee;

        allEmployeeList.push(_who);

        //commonRateAllEmployee += _rate;

        emit AddEmployee(_who, _rate, block.timestamp);
    }


    function modifyRate(address _who, uint256 _rate) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned {
        if(getStream[_who].active) revert NoActiveStream();
        
        allEmployee[_who].flowRate = _rate;
    }

    function deleteEmployee(address _who) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        if(getStream[_who].active) revert NoActiveStream();

        allEmployee[_who].worker = false;

        allEmployeeList.removeAddress(_who);
    }

//-------------------- SECURITY / BUFFER --------------
// Set up all restrictoins tru DAO?

    // -------- Solution #1 (restriction on each stream)
    uint public tokenLimitMaxHoursPerPerson; // Max amount hours of each stream with enough funds;

    function validToStream(address _who)private view returns(bool){
         return  getTokenLimitToStreamOne(_who) < currentBalanceContract();
    }

    function getTokenLimitToStreamOne(address _who)public view returns(uint){
        return allEmployee[_who].flowRate * tokenLimitMaxHoursPerPerson;
    }

   function setHLStartStream(uint _newLimit) external activeStream ownerOrAdministrator{
    //     // How can set this func? Mini DaO?
        tokenLimitMaxHoursPerPerson = _newLimit;
    }

    // -------------- FUNCS with EMPLOYEEs ----------------

    ///@dev Starts streaming token to employee (check StreamLogic)
    function start(address _who) external employeeExists(_who) ownerOrAdministrator isLiquidationHappaned{
        require(validToStream(_who), "Balance is very low");

        startStream(_who, allEmployee[_who].flowRate);
    }

    function finish(address _who) external employeeExists(_who) ownerOrAdministrator {
        uint256 salary = finishStream(_who);
        // if(!overWroked){
        //     function ifyouEmployDolboeb()
        // }
        token.transfer(_who, salary);
    }

    function withdrawEmployee()external employeeExists(msg.sender) {
         uint256 salary = _withdrawEmployee(msg.sender);

        token.transfer(msg.sender, salary);
        
        emit WithdrawEmpl(msg.sender, salary, block.timestamp);
    }


    function getDecimals()public view returns(uint){
        return token.decimals();
    }

    function withdrawTokens()external onlyOwner activeStream isLiquidationHappaned{
        token.transfer(owner, balanceContract());
    }


    //-------DEV-------
    function version()public pure returns(string memory){
        return "V 0.3.0";
    }
    function supportFlowaryInterface()public pure returns(bool){
        return true;
    }
    
    function avalibleBalanceContract()public override(TokenAdmin, OutsourceTask) view returns(uint){
        return super.avalibleBalanceContract();
    }
    function currentBalanceContract()public override(StreamLogic, TokenAdmin) view returns(uint){
        return super.currentBalanceContract();
    }

}