// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StableCoin is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("StableCoin", "USDT") {
        _mint(msg.sender, 1_000_000);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    mapping(address=>bool)public faucetUsed;

    function faucet() internal {
        require(!faucetUsed[msg.sender], "You have used this faucet");
         _mint(msg.sender, 7_000_000_000);
    }
}
