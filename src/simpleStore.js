import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStore_abi from "./SimpleStore_abi.json";

const SimpleStore = () => {
    const contractAddress = "0x5932a6f4b60588cF4E92d59Bc7aCbED321713b2C";
    // change the abi and the contract address (not user adress) each time the contract gets deployed

    const [errorMessage, setErrorMessage] = useState("WHY");
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");
    const [defaultAccount, setDefaultAccount] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            //ethereum will push it into window
            window.ethereum
                .request({ method: "eth_requestAccounts" }) //method on ethereum
                .then((result) => {
                    // result will contain an array of ethereum accounts
                    console.log(result);
                    accountChangedHandler(result[0]);
                    setConnButtonText("Wallet Connected");
                });
        } else {
            setErrorMessage("Need to install Metamask!");
        }
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    };

    function updateEthers() {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum); //reads
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner(); //writes
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(
            contractAddress,
            SimpleStore_abi,
            tempSigner
        );
        setContract(tempContract);
    }

    function getCurrentVal() {
        console.log(contract);
        let val = contract.getting().then((val) => {
            setErrorMessage(val);
        });
    }

    function setHandler(event) {
        event.preventDefault();

        contract.set(event.target.setText.value);
    }

    return (
        <div>
            <h3>{"Get/Set interaction with contract!"}</h3>
            <button onClick={connectWalletHandler}> {connButtonText} </button>
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id="setText" type="text"></input>
                <button type={"submit"}> Update Contract </button>
            </form>

            <button onClick={getCurrentVal}>Get Current Value</button>

            <h3> {errorMessage}</h3>
        </div>
    );
};

export default SimpleStore;
