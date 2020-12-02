// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleRskOracle is Ownable {

    mapping(address => bool) private whitelist;

    uint private _price;
    uint private _timestamp;

    modifier isWhitelisted() {
        require(whitelist[msg.sender], "The address is not whitelisted");
        _;
    }

    function updatePrice(uint price, uint timestamp) public isWhitelisted {
        _price = price;
        _timestamp = timestamp;
    }

    function getPricing() public view returns(uint price, uint timestamp) {
        return (_price, _timestamp);
    }

    function addToWhitelist(address addr) public onlyOwner {
        whitelist[addr] = true;
    }

    function removeFromWhitelist(address addr) public onlyOwner {
        whitelist[addr] = false;
    }

}
