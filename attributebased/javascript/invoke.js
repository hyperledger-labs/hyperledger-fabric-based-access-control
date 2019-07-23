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
        let sara={
            user:{
                active: true,
                dob:'1989-06-06',
                banCount:1,
                group:12,
                department: 'computer'
            }
        };
        let john = {
            user: {
                active: true,
                dob: '2006-05-12', // too young
                banCount: 4, // banned too many times
                group: 12
            }
        };
        let resource = {
            group: {
                id: 12
            }
        };
      // Ask for subject key and subject values in json format
    //var policyKey = readline.question("What is policy key?");
   // var policy = readline.question("What is policy in json fromat?");
      // Store subject on the ledger
  // const result= await contract.submitTransaction('recordSubject', 'sara' , JSON.stringify(sara));
   // const result= await contract.submitTransaction('recordResource', 'resource1' , JSON.stringify(resource));
    // const result= await contract.submitTransaction('recordPolicy', policyKey , JSON.stringify(policy));

   const result= await contract.submitTransaction('PDP', 'sara', 'resource1', "can-be-admin-of-group", 'policy1' );
       console.log(`Transaction has been submitted, result is: ${result.toString()}`);

       // console.log(result);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
