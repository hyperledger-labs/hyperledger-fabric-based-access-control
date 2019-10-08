/*
 * SPDX-License-Identifier: Apache-2.0
 */

// {"user":{"active":true,"dob":"1989-06-06","banCount":1,"group":12,"department":"computer"}}
// {"group":{"id":12}}
// {"attributes":{"user":{"active":"Active","banCount":"Timesbanned","dob":"Dateofbirth","group":"GroupID"},"group":{"id":"GroupID"}},"rules":{"can-be-admin-of-group":{"attributes":{"user.active":{"comparison_type":"boolean","comparison":"boolAnd","value":true},"user.dob":{"comparison_type":"datetime","comparison":"isLessRecentThan","value":"-21Y"},"user.banCount":{"comparison_type":"numeric","comparison":"isLesserThanEqualTo","value":1},"user.group":{"comparison_target":"group","comparison_type":"numeric","comparison":"isStrictlyEqual","field":"id"}}}}}

'use strict';
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('attributebased');
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
        app.post('/submit-subject', async(req,res) => {
            try{
                let subjectKey = req.body.subjectKey;
                console.log('this is subject key'+subjectKey);
                let subject = req.body.subject;
                console.log(typeof subject);
                let response = await contract.submitTransaction('recordSubject', subjectKey , JSON.stringify(subject));
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.json(response.toString());
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-resource', async(req,res) => {
            try{
                let resourceKey = req.body.resourceKey;
                let resource = req.body.resource;
                let response = await contract.submitTransaction('recordResource', resourceKey , JSON.stringify(resource));
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.json(response.toString());
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-policy', async(req,res) => {
            try{
                let policyKey = req.body.policyKey;
                let policy = req.body.policy;
                let response = await contract.submitTransaction('recordPolicy', policyKey , JSON.stringify(policy));
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.json(response.toString());
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-pdp', async(req,res) => {
            try{
                let subjectKey = req.body.subjectKey;
                let resourceKey = req.body.resourceKey;
                let rule = req.body.rule;
                let policyKey = req.body.policyKey;
                let response = await contract.submitTransaction('PDP', subjectKey , resourceKey, rule, policyKey);
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.json(response.toString());
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-queryAll', async(req,res) => {
            try{
            //let subjectKey = req.body.subjectKeyQuery;
            // console.log('this is subject key'+subjectKey);
            // let response = await contract.evaluateTransaction('queryUserAttribute', subjectKey);
                let response = await contract.evaluateTransaction('queryAll');
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.send(JSON.parse(response));
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-queryAttribute', async(req,res) => {
            try{
                let attributeKey = req.body.attributeKeyQuery;
                let response = await contract.evaluateTransaction('queryAttribute', attributeKey);
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.send(JSON.parse(response));
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
        app.post('/submit-queryPolicy', async(req,res) => {
            try{
                let policyKey = req.body.policyKeyQuery;
                let response = await contract.evaluateTransaction('queryPolicies', policyKey);
                console.log(`Transaction has been submitted, result is: ${response.toString()}`);
                res.send(JSON.parse(response));
            }
            catch(e){
                res.end(e.message || e.toString());
            }
        });
    } catch (error) {
        console.log('----->error\n');
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
main();
const port= process.env.PORT || 3000;
app.listen(port, () => console.log(`app is listening on port ${port} ...`));