//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

/// @author Chubiduresel 
/// @title Library to find an address in array and delete
library ArrayLib{
    
    function removeAddress(address[]storage _arr, address _removeAddr) internal {

		uint indexAddr = _indexOf(_arr, _removeAddr);

        for (uint i = indexAddr; i < _arr.length -1; i++){
            _arr[i] = _arr[i+1];
        }
        _arr.pop();
    }
 
	function _indexOf(address[]storage _arr, address searchFor) internal view returns (uint256) {
  		for (uint256 i = 0; i < _arr.length; i++) {
    		if (_arr[i] == searchFor) {
      		return i;
    		}
  		}
  		revert("Not Found");
	}
}