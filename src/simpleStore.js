import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStore_abi from "./SimpleStore_abi.json";

var sha256 = require("js-sha256");
var CryptoJS = require("crypto-js");

const SimpleStore = () => {
    const contractAddress = "0x158a0E10E7dd742E6CceCCd4dc0b2A802c531AAb";
    // change the abi and the contract address (not user adress) each time the contract gets deployed

    const [errorMessage, setErrorMessage] = useState("");
    const [connButtonText, setConnButtonText] = useState("Connect User");
    const [defaultAccount, setDefaultAccount] = useState("");
    const [ipfsLink, setIpfsLink] = useState(
        "https://drive.google.com/drive/folders/1hEj46nBvweQ-SZmSa6IhbKLQL_YR55rP?usp=sharing"
    );
    const [status, setStatus] = useState("");

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
        let val = contract.get().then((val) => {
            setErrorMessage(val);
        });
    }

    function setHandler(event) {
        event.preventDefault();

        // sends the code to IPFS
        setStatus("Sent to IPFS");

        // hashing using account_public_key and code itself
        var hashed_pubkey_code = sha256(
            defaultAccount + event.target.setText.value
        );

        // ecrypting using codelink and account_private_key
        var data = hashed_pubkey_code + ipfsLink;
        var encr_codelink_hash = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            defaultAccount
        ).toString();

        contract.set(encr_codelink_hash); // sends the encrypted data to the blockchain
    }

    return (
        <div>
            <h3>{"Get/Set interaction with contract!"}</h3>
            <button onClick={connectWalletHandler}> {connButtonText} </button>
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <textarea
                    id="setText"
                    type="textarea"
                    className="textboxid"
                ></textarea>
                <button type={"submit"}> Submit Code </button>
            </form>

            <h3>{status}</h3>

            <button onClick={getCurrentVal}>Get Latest Commit</button>

            <h3> {errorMessage}</h3>
        </div>
    );
};

export default SimpleStore;
