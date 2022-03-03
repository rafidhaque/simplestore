import React, { useState } from "react";

const SimpleStore = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");
    const [defaultAccount, setDefaultAccount] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            //ethereum will push it into window
            window.ethereum
                .request({ method: "eth_requestAccounts" }) //method on ethereum
                .then((result) => {
                    // result will contain an array of ethereum accounts
                    accountChangedHandler(result[0]);
                });
        } else {
            setErrorMessage("Need to install Metamask!");
        }
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
    };

    return (
        <div>
            <h3>{"Get/Set interaction with contract!"}</h3>
            <button onClick={connectWalletHandler}> {connButtonText} </button>
            <h3>Address: {defaultAccount}</h3>

            {errorMessage}
        </div>
    );
};

export default SimpleStore;
