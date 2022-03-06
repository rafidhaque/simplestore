pragma solidity 0.6.4;

contract SimpleStore {
    string[] public storedData;

    event myEventTest(string eventOutput);

    function set(string memory myText) public {
        storedData.push(myText);
        emit myEventTest(myText);
    }

    function get() public view returns (string memory) {
        return storedData[storedData.length - 1];
    }
}