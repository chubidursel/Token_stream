//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./TokenAdmin.sol";

error UnAuthorized();
error PassedDeadLine();

abstract contract OutsourceTask is TokenAdmin {

    struct Outsource{
        string task;
        address who;
        uint256 startAt;
        uint256 deadline;
        uint256 wage; //10
        uint256 amountWithdraw; //-= 4.9
        bool bufferOn;
        Status status;
    }

    enum Status {None, Active, ClaimDone, Finished}

    uint public id;
    
    mapping(uint=>Outsource) public listOutsource;

    function createOutsourceJob(address _who, string calldata _task, uint _wage, uint _deadline, bool _bufferOn) public {
        //REQUIRE bal>salary

        Outsource memory newJob = Outsource({
			task: _task,
            who: _who,
            startAt: block.timestamp,
            deadline: block.timestamp + _deadline,
            wage: _wage,
            amountWithdraw: 0,
            bufferOn: _bufferOn,
            status: Status.Active
		});

        listOutsource[id] = newJob;

        id++;

        fundsLocked += _wage;
    }

    function withdrawFreelancer(uint _id)external{
        require(listOutsource[_id].status == Status.Active, "Ops, u do not have an active Job");
        if(listOutsource[_id].who != msg.sender) revert UnAuthorized();

        uint amountEarned;

        if(listOutsource[_id].bufferOn){

            amountEarned = calculateBuffer(currentBal(_id)) - listOutsource[_id].amountWithdraw; 
        
        } else {
            amountEarned = currentBal(_id);
        }

        token.transfer(listOutsource[_id].who, amountEarned); //7$ => 4,9$ // 1$ 

        listOutsource[_id].amountWithdraw += amountEarned; // 5.1

        fundsLocked -= amountEarned;
    }


    //------------------------  BUFFER --------------------

    uint8 public percentageBuffer = 30; 
                                    //70

    function setpercentBuffer(uint8 _newBuffer) internal {
        require(_newBuffer < 70, "You cant set beffer more then 70%");
        percentageBuffer = _newBuffer;
    }

    function calculateBuffer(uint amount) private view returns(uint){

         return amount - ((amount *  percentageBuffer) / 100);
                        //  7    -    (7    *    30) / 100


        // - 30%  >>> 3$ BUFFER
       // 10$ for 1h => in 45min he`s got 7$ - 21%  => return 7 * 0.21 = 1.47

       // 7 / 10 = 0.7(EARNED$) * 0.7(70%FIXED) = 0.49 |||   0.49 * 10$ = 4.9$

       // 3 / 10 = 0.3 * 0.7 = 0.21  |||  0.21 * 10$ = 2.1$ 
    }

    //FUNC to set it
    // Func to calculate withdraw for Freelancer



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

    function finishOutsource(uint _id) public {
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

        //------------------------  CANCEL --------------------
        
        // FUNC for Boss >> we keep Buffer
    
}