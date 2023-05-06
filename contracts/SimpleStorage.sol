// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SimpleStorage {
    string public message; // empty by default
    address public owner;

    event NewMessage(string message);

    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Only the owner can call this method");
        _;
    }

    // Going to be executed on deployment
    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
    }

    function setMessage(string memory newMessage) public onlyOwner {
        message = newMessage;

        emit NewMessage(message);
    }
}