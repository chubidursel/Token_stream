//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

library ArrayLib{

    function indexOf(address searchFor, address[] storage _arr) internal view returns (uint256) {
  		for (uint256 i = 0; i < _arr.length; i++) {
    		if (_arr[i] == searchFor) {
      		return i;
    		}
  		}
  		revert("Not Found");
    }

// CAN I PUT THIS FUNC HERE AND DELETE ELEMENT FROM ARR IN BASE CONTRACT???????????
    // function _removeAddress(address _removeAddr) private {

	// 	uint index = _indexOf(_removeAddr); // [1, !2, 3, 4] > index =1

    //     if (index > activeStreamAddress.length) return;

    //     for (uint i = index; i < activeStreamAddress.length -1; i++){
    //         activeStreamAddress[i] = activeStreamAddress[i+1];
    //     }
    //     activeStreamAddress.pop();
    // }

}