//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./TokenAdmin.sol";

error UnAuthorized();
error PassedDeadLine();
error NotEnoughFunds();

abstract contract OutsourceTask is TokenAdmin {

    struct Outsource{
        string task;
        address who;
        uint256 startAt;
        uint256 deadline;
        uint256 wage; //10
        uint256 amountWithdraw; //-= 4.9
        uint8 bufferPercentage;
        Status status;
    }

    enum Status {None, Active, ClaimDone, Finished}

    uint public OutsourceID;
    
    mapping(uint=>Outsource) public listOutsource;

    // uint[]public activeOutsource;

    function createOutsourceJob(address _who, string calldata _task, uint _wage, uint _deadline, uint8 _bufferOn) public {
         if(currentBalanceContract() < _wage) revert NotEnoughFunds();
        	
        Outsource memory newJob = Outsource({
			task: _task,
            who: _who,
            startAt: block.timestamp,
            deadline: block.timestamp + _deadline,
            wage: _wage,
            amountWithdraw: 0,
            bufferPercentage: _bufferOn,
            status: Status.Active
		});

        listOutsource[OutsourceID] = newJob;

        OutsourceID++;

        fundsLocked += _wage;
    }

    // function withdrawFreelancer(uint _id)external{
    //     require(listOutsource[_id].status == Status.Active, "Ops, u do not have an active Job");
    //     if(listOutsource[_id].who != msg.sender) revert UnAuthorized();

    //     uint amountEarned;
    //     uint curBalance = currentBal(_id);
    //     uint withdraw = listOutsource[_id].amountWithdraw;

    //     if(calculateBuffer(curBalance, listOutsource[_id].bufferPercentage) < withdraw){
    //         return;
    //     }

    //     if(listOutsource[_id].bufferPercentage > 0){

    //         amountEarned = calculateBuffer(curBalance, listOutsource[_id].bufferPercentage) - withdraw; 
        
    //     } else {
    //         amountEarned = curBalance - withdraw;
    //     }

    //     token.transfer(listOutsource[_id].who, amountEarned); //7$ => 4,9$ // 1$ 

    //     listOutsource[_id].amountWithdraw += amountEarned; // 5.1

    //     fundsLocked -= amountEarned;
    // }


    //------------------------  VERIFICATION --------------------
    event ClaimDone(address _who, string _result);

    function claimFinish(uint _id, string calldata linkToResult)public{
        if(listOutsource[_id].who != msg.sender) revert UnAuthorized();

        if(listOutsource[_id].deadline > block.timestamp){
            listOutsource[_id].wage / 2; // FIX THIS!!!!!!!!!!!!!! 
        } 

        listOutsource[_id].status = Status.ClaimDone;

        emit ClaimDone(msg.sender, linkToResult);
    }

    function finishOutsource(uint _id) public ownerOrAdministrator{
        //CHECk: 1.Claimed?
        //       2. DeadLine

        uint pay = listOutsource[_id].wage - listOutsource[_id].amountWithdraw;

        listOutsource[_id].status = Status.Finished;

        token.transfer(listOutsource[_id].who, pay);

        if(fundsLocked <= pay){
            fundsLocked = 0;
        } else{
            fundsLocked -= pay;
        }
        
    }

    //-------------------------------  LOCKED FUNDS ---------------------
        // ------------------------- BALANCE ------------------
    uint public fundsLocked;

    function avalibleBalanceContract()public override virtual view returns(uint){
        return token.balanceOf(address(this)) - fundsLocked;
    }

    function currentBal(uint _id)public view returns(uint){
        //FORMULA   (Wage / (DeadLine - StartAt)) == FLOWRATE  >>>> Now - Start * Rate
        // 5h and 100$ >> 1h = 20$

            // 0.1 $ /sec
        uint rate =  listOutsource[_id].wage / (listOutsource[_id].deadline - listOutsource[_id].startAt);   
        return (block.timestamp - listOutsource[_id].startAt) * rate;
    }

        //------------------------  BUFFER --------------------


    function calculateBuffer(uint amount, uint8 percentageBuffer) private pure returns(uint){

         return amount - ((amount *  percentageBuffer) / 100);
                        //  7    -    (7    *    30) / 100

        // - 30%  >>> 3$ BUFFER
       // 10$ for 1h => in 45min he`s got 7$ - 21%  => return 7 * 0.21 = 1.47

       // 7 / 10 = 0.7(EARNED$) * 0.7(70%FIXED) = 0.49 |||   0.49 * 10$ = 4.9$

       // 3 / 10 = 0.3 * 0.7 = 0.21  |||  0.21 * 10$ = 2.1$ 
    }
    
        //------------------------  CANCEL --------------------
    
}