import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStore_abi from "./SimpleStore_abi.json";

const SimpleStore = () => {
    const contractAddress = "0x411CE1cB07F0c36837A7C514dAFA94Fe86597Df5";
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
        let val = contract.lol().then((val) => {
            setErrorMessage(val);
        });
    }

    return (
        <div>
            <h3>{"Get/Set interaction with contract!"}</h3>
            <button onClick={connectWalletHandler}> {connButtonText} </button>
            <h3>Address: {defaultAccount}</h3>

            <button onClick={getCurrentVal}>Get Current Value</button>

            <h3> {errorMessage}</h3>
        </div>
    );
};

export default SimpleStore;
