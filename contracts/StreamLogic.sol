//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./TokenAdmin.sol";

contract StreamLogic is TokenAdmin {

    // ---------- ERORS ----------
    error Unauthorized();

    // --------- Events ----------
    event StreamCreated(Stream stream);

	event StreamFinished(address who, uint tokenEarned, uint endsAt);

	event Liqudation(address _whoCall);

	constructor(address _owner) TokenAdmin(_owner){}


    /// @dev Parameters for streams
	/// @param sender The address of the creator of the stream
	/// @param recipient The address that will receive the streamed tokens
	/// @param rate How many token pro sec

    struct Stream {
		uint256 rate; //holiday rate
		uint256 startAt; 
        bool active;
		uint32 streamId;
	}

    //mapping(address => mapping(uint8 => Stream)) public getStream;  //uint256 internal streamId = 1;
	mapping(address => Stream) public getStream;

	address[] public activeStreamAddress;

	modifier activeStream(){
            require(amountActiveStreams() == 0, "Active Stream");
            _;
    }

	function amountActiveStreams() public view returns(uint){
		return activeStreamAddress.length;
	}

    //------------ MAIN FUNCS [STREAM]----------
    function startStream(address _recipient, uint256 _rate) internal isLiquidationHappaned{
		require(!getStream[_recipient].active, "This guy already has stream");
		require(newStreamCheckETF(_rate), "Contract almost Liquidated. Check Balance!");
		
		uint32 currentStreamId = getStream[_recipient].streamId + 1;

		Stream memory stream = Stream({
			rate: _rate,
			startAt: block.timestamp,
            active: true,
			streamId: currentStreamId
		});


		calculateETF(_rate);

		getStream[_recipient] = stream;

		activeStreamAddress.push(_recipient);

		emit StreamCreated(stream);
	}

	function finishStream(address _who) internal returns(uint256){
		require(getStream[_who].active, "This user doesnt have an active stream");
		
		uint retunrTokenAmount;
		
		// IF Liquidation -> return as much token as employee earned and write in debt list
		if(block.timestamp > EFT){

			addrListDebt.push(_who);
			debtToEmployee[_who] = currentBalanceEmployee(_who) - currentBalanceLiquidation(_who);
			retunrTokenAmount = currentBalanceLiquidation(_who);

			liqudation = true;
			
		} else {
			retunrTokenAmount = currentBalanceEmployee(_who);
		}

		calculateETFDecrease(getStream[_who].rate);
		
		_removeAddress(_who);

		getStream[_who].active = false;
		getStream[_who].startAt = 0;

 		emit StreamFinished(_who, retunrTokenAmount, block.timestamp);
	
		return retunrTokenAmount;
	}

	


	function finishAllStream() public {
		require(amountActiveStreams() == 0, "No active streams!");

	
		if(block.timestamp > EFT){
			// IF Liquidation we send as much token as in SC and write down all debt
			for(uint i = 0; i < activeStreamAddress.length; i++){
				address loopAddr = activeStreamAddress[i];
				addrListDebt.push(loopAddr);
				debtToEmployee[loopAddr] = currentBalanceEmployee(loopAddr) - currentBalanceLiquidation(loopAddr);

				token.transfer(loopAddr, currentBalanceLiquidation(loopAddr));

				getStream[loopAddr].active = false;
				getStream[loopAddr].startAt = 0;
			}

			liqudation = true;

		} else {
			for(uint i = 0; i < activeStreamAddress.length; i++){
				address loopAddr = activeStreamAddress[i];

				token.transfer(loopAddr, currentBalanceEmployee(loopAddr));

				getStream[loopAddr].active = false;
				getStream[loopAddr].startAt = 0;
			}
		}

		activeStreamAddress = new address[](0);

		CR = 0;
		EFT = 0;
	}

// FUNCTION IF employee had break

 	//------------ ADDITION FUNCS [TRANSFER]----------
	// function sendFunds(address _who) public {
	// 	require(msg.sender == getStream[_who], "You are not able to transact");
	// }


		//------------ CHECK BALANCES----------
    function currentBalanceEmployee(address _who) public view returns(uint256){
		if(!getStream[_who].active) return 0;

		uint rate = getStream[_who].rate;
		uint timePassed = block.timestamp - getStream[_who].startAt;
		return rate * timePassed;
	}

	function currentBalanceContract()public view returns(uint256){
		
		if(amountActiveStreams() == 0){
			return balanceContract();
		}
		uint snapshotAllTransfer;

		for(uint i = 0; i < activeStreamAddress.length; i++ ){
			snapshotAllTransfer += currentBalanceEmployee(activeStreamAddress[i]);
		}

		// If liquidation
		if((balanceContract() < snapshotAllTransfer)){
			return 1;
		}

		return  balanceContract() - snapshotAllTransfer;
	}


	function currentBalanceLiquidation(address _who) public view returns(uint256){
		uint rate = getStream[_who].rate;
		uint timePassed = EFT - getStream[_who].startAt;
		return rate * timePassed;
	}

    //-----------  Liquidation  -------------
	modifier isLiquidationHappaned(){
            require(!liqudation, "Liqudation happened!!!");
            _;
    }

	mapping(address => uint) public debtToEmployee;
	address[] public addrListDebt;

	bool public liqudation;


	function _totalDebt() public view returns(uint){
		uint num;
		for(uint i = 0; i < addrListDebt.length; i++){
				num += debtToEmployee[addrListDebt[i]];
		}
		return num;
	}


	function finishLiqudation() public activeStream{
		require(liqudation, "Liqudation did not happen");
	    require(balanceContract() >= _totalDebt(), "Not enough funds to pay debt back");

		if(addrListDebt.length != 0){

				for(uint i = 0; i < addrListDebt.length; i++){

				token.transfer(addrListDebt[i], debtToEmployee[addrListDebt[i]]);

				debtToEmployee[addrListDebt[i]] = 0;
			}
		}

		activeStreamAddress = new address[](0);

		liqudation = false;
	}



    //-----------SECURITY [EFT implementation] -------------

	uint public EFT; // enough funds till
	uint public CR; //common rate

	function calculateETF(uint _rate)public {
		// FORMULA	[new stream]	Bal / Rate = secLeft  --> timestamp + sec

		if(EFT == 0){
			CR += _rate;
			uint sec = balanceContract() / _rate;
			EFT = block.timestamp + sec;
		} else {
			CR += _rate; 
			uint secRecalculate = currentBalanceContract() / CR; // IF liqudation noone can create new stream so cant reach here
			EFT = block.timestamp + secRecalculate;
		}
	}

	function calculateETFDecrease(uint _rate)private {

		// If Liqudation 
		if(currentBalanceContract() <= 1){
			return;
		} else if((amountActiveStreams() -1) == 0){
			// -1 because we remove address from arr before call this func
			// IF there was the last employee we reset the whole num
			EFT = 0;
			return;
		}else {
			uint secRecalculate = currentBalanceContract() / CR; 
			CR -= _rate; 
			EFT = block.timestamp + secRecalculate;
		}
	}
	

	// Restrtriction to create new Stream (PosibleEFT < Now)
	uint16 minDelayToOpen = 5 minutes;

	function newStreamCheckETF(uint _rate)public view returns(bool canOpen){
		// FORMULA    nETF > ForLoop startAt + now
		//
		if(amountActiveStreams() == 0) return true;

		if((block.timestamp + minDelayToOpen) > _calculatePosibleETF(_rate)){
				return false;
		}

		return true;
	}

	function _calculatePosibleETF(uint _rate) private view returns(uint) {
			uint tempCR = CR + _rate;
			uint secRecalculate = balanceContract() / tempCR; 
			return block.timestamp + secRecalculate;
	}

	// ----- FUNC to DELETE ELEMENT ADDRESS from activeStreamAddress
	function _indexOf(address searchFor) private view returns (uint256) {
  		for (uint256 i = 0; i < activeStreamAddress.length; i++) {
    		if (activeStreamAddress[i] == searchFor) {
      		return i;
    		}
  		}
  		revert("Not Found");
	}

	function _removeAddress(address _removeAddr) private {

		uint index = _indexOf(_removeAddr);

        if (index > activeStreamAddress.length) return;

        for (uint i = index; i < activeStreamAddress.length; i++){
            activeStreamAddress[i] = activeStreamAddress[i+1];
        }
        activeStreamAddress.pop();
    }
}