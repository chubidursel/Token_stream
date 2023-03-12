//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "./TokenAdmin.sol";
import "./ArrayLib.sol";

error NoActiveStream();

/// @author Chubiduresel 
/// @title Stream logic and Liquidation
abstract contract StreamLogic is TokenAdmin {

	using ArrayLib for address[];

    // --------- Events ----------
    event StreamCreated(Stream stream);
	event StreamFinished(address who, uint tokenEarned, uint endsAt, uint startedAt);
	event Liqudation(address _whoCall);

    /// @notice Parameters of stream object
	/// @param rate Employee rate (Token / second)
	/// @param startAt Block.timestamp when employee start streaming
	/// @param active Active stream
	/// @param streamId Amount of stream 
    struct Stream {
		uint256 rate; 
		uint256 startAt; 
        bool active;
		uint32 streamId;
	}

	mapping(address => Stream) public getStream;

	address[] public activeStreamAddress;

	modifier activeStream(){
            require(amountActiveStreams() == 0, "Active Stream");
            _;
    }

	function amountActiveStreams() public view returns(uint){
		return activeStreamAddress.length;
	}

	/**
     * @notice Create new stream 
     * @dev Function is called from the company contract
     * @param _recipient The employee address
     * @param _rate The rate of employee (Token / second)
     */
    function startStream(address _recipient, uint256 _rate) internal isLiquidationHappaned{
		require(!getStream[_recipient].active, "This dude already has stream");
		//require(newStreamCheckETF(_rate), "Contract almost Liquidated. Check Balance!");
		
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

	/**
     * @notice Finish stream 
     * @dev Function is called from the company contract.
	 If time passed ETF deadline, contract call turn into Liqudation mode.
	 Employee recieves all token from contract, if it doesnt cover all money he earned, 
	 the rest will be written in debtToEmployee mapping, and pay out as soon as company
	 pop up balace and call function finishLiqudation()
     * @param _who The employee address
     */
	function finishStream(address _who) internal returns(uint256){
		require(getStream[_who].active, "This user doesnt have an active stream");
		
		uint256 retunrTokenAmount;
		
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
		
		activeStreamAddress.removeAddress(_who);

		emit StreamFinished(_who, retunrTokenAmount, block.timestamp, getStream[_who].startAt);

		getStream[_who].active = false;
		getStream[_who].startAt = 0;
		
	
		return retunrTokenAmount;
	}

	/// @notice Finish all active streams
	/// @dev This function is called from outside
	/// @dev Reset ETF and CR to Zero and delete all streams from the list
	
	// function finishAllStream() public {
	// 	if(amountActiveStreams() == 0) revert NoActiveStream();

	
	// 	if(block.timestamp > EFT){
	// 		// IF Liquidation we send as much token as in SC and write down all debt
	// 		for(uint i = 0; i < activeStreamAddress.length; i++){
	// 			address loopAddr = activeStreamAddress[i];
	// 			addrListDebt.push(loopAddr);
	// 			debtToEmployee[loopAddr] = currentBalanceEmployee(loopAddr) - currentBalanceLiquidation(loopAddr);

	// 			token.transfer(loopAddr, currentBalanceLiquidation(loopAddr));

	// 			getStream[loopAddr].active = false;
	// 			getStream[loopAddr].startAt = 0;
	// 		}

	// 		liqudation = true;

	// 	} else {
	// 		for(uint i = 0; i < activeStreamAddress.length; i++){
	// 			address loopAddr = activeStreamAddress[i];

	// 			token.transfer(loopAddr, currentBalanceEmployee(loopAddr));

	// 		     emit StreamFinished(loopAddr, currentBalanceEmployee(loopAddr), block.timestamp, getStream[loopAddr].startAt);

	// 			getStream[loopAddr].active = false;
	// 			getStream[loopAddr].startAt = 0;
	// 		}
	// 	}

	// 	activeStreamAddress = new address[](0);

	// 	CR = 0;
	// 	EFT = 0;
	// }

	function _withdrawEmployee(address _who) internal returns(uint){
		//require(getStream[_who].active, "This user doesnt have an active stream");
		if(!getStream[_who].active) revert NoActiveStream();

		uint tokenEarned = currentBalanceEmployee(_who);

		getStream[_who].startAt = block.timestamp;

		return tokenEarned;
	}

	//------------ CHECK BALANCES----------
	/**
     * @notice Check employee`s balance 
     * @param _who The employee address
     * @return amount of token that employee earns at moment this function is called
     */	
    function currentBalanceEmployee(address _who) public view returns(uint256){
		if(!getStream[_who].active) return 0;

		uint rate = getStream[_who].rate;
		uint timePassed = block.timestamp - getStream[_who].startAt;
		return rate * timePassed;
	}
	/// @notice Check company`s balance
	/// @dev If it returns 1, it means that contract doesnt have enough funds to pay for all streams (Liquidation)
    /// @return amount of token thet company posses at the moment this function is called
	function currentBalanceContract()public view virtual override returns(uint256){
	
		if(amountActiveStreams() == 0){
			return avalibleBalanceContract();
		}
		uint snapshotAllTransfer;

		for(uint i = 0; i < activeStreamAddress.length; i++ ){
			snapshotAllTransfer += currentBalanceEmployee(activeStreamAddress[i]);
		}

		// If liquidation
		if((avalibleBalanceContract() < snapshotAllTransfer)){
			return 1;
		}

		return  avalibleBalanceContract() - snapshotAllTransfer;
	}

  //------------ LIQUIDATION ----------
	/**
     * @notice Check employee`s debt balance
     * @param _who The employee address
     * @return amount of token that company owns to the employee
     */	
	function currentBalanceLiquidation(address _who) public view returns(uint256){
		uint rate = getStream[_who].rate;
		uint timePassed = EFT - getStream[_who].startAt;
		return rate * timePassed;
	}

	modifier isLiquidationHappaned(){
            require(!liqudation, "Liqudation happened!!!");
            _;
    }

	mapping(address => uint) public debtToEmployee;

	address[] public addrListDebt;

	bool public liqudation;

	///@notice Calculate the total amount of debt for the company
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
			CR = 0;
			EFT = 0;
			return;
		}else {
			uint secRecalculate = currentBalanceContract() / CR; 
			CR -= _rate; 
			EFT = block.timestamp + secRecalculate;
		}
	}
	
	// Restrtriction to create new Stream (PosibleEFT < Now)
	// uint16 minDelayToOpen = 5 minutes;

	// function newStreamCheckETF(uint _rate)public view returns(bool canOpen){
	// 	// FORMULA    nETF > ForLoop startAt + now
	// 	//
	// 	if(amountActiveStreams() == 0) return true;

	// 	if((block.timestamp + minDelayToOpen) > _calculatePosibleETF(_rate)){
	// 			return false;
	// 	}

	// 	return true;
	// }

	// function _calculatePosibleETF(uint _rate) private view returns(uint) {
	// 		uint tempCR = CR + _rate;
	// 		uint secRecalculate = balanceContract() / tempCR; 
	// 		return block.timestamp + secRecalculate;
	// }

}
