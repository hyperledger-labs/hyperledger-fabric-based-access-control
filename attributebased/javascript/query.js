/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const readline = require('readline-sync');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('attributebased');

        // Ask for the attribute key and query based on requested key
        //var attributeKey = readline.question("What is the key you want to query?");
       // const result = await contract.evaluateTransaction('QueryUserAttribute', attributeKey);
       const result = await contract.evaluateTransaction('queryAll');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(result[0].toString);

    } catch (error) {
        console.log("----->error\n");
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
