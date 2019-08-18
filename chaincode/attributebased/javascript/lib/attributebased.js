/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
//import {subjectAttribute} from './lib/data/policy.json';
const { Contract } = require('fabric-contract-api');
const NodeAbac = require('node-abac');
const path = require('path');
const fs = require('fs');
const subjectAttribute = require('./data/subject');
const resourceAttribute = require('./data/resource');
//conect to policy data file
const policyDataPath = path.join(process.cwd(), './lib/data/policy.json');
const policyDataJson = fs.readFileSync(policyDataPath, 'utf8');



class AttributeBased extends Contract {
    // Initialize ledger
    async initLedger(ctx) {
<<<<<<< HEAD
        console.info('============= START : Initialize Ledger ===========');

=======
        console.info('============= START : Initialize Ledger ===========');    
        await ctx.stub.putState('initPolicy', JSON.stringify(policyDataJson));
        await ctx.stub.putState('initSubject', JSON.stringify(subjectAttribute));
        await ctx.stub.putState('initResource', JSON.stringify(resourceAttribute));
>>>>>>> f8ddfe2... init ledger

        console.info('============= END : Initialize Ledger ===========');
    }
    //Store subject attributes on the legder
    async recordSubject(ctx, subjectKey, subject) {
<<<<<<< HEAD

        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys = [];
=======
        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys=[];
>>>>>>> be638c3... eslint
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                allKeys.push(Key);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                break;
            }
        }

<<<<<<< HEAD
        allKeys.forEach(element=> {if (element == subjectKey)
=======
        allKeys.forEach(element=> {if (element===subjectKey)
>>>>>>> be638c3... eslint
        {throw new Error(`${subjectKey} is already exist you can update subject attribute using UpdateSubject function`);
        }
        });

        console.info('============= START : Record subjects attribute ===========');
        await ctx.stub.putState(subjectKey, JSON.stringify(subject));
        return 'successfully submitted!';
    }

    //Update the existing subject attributes
    async updateSubject(ctx, subjectKey, newSubject){
        console.info('============= START : Record subject attribute ===========');
        await ctx.stub.putState(subjectKey, JSON.stringify(newSubject));
        return 'successfully submitted!';
    }

    //Record policy
    async recordPolicy(ctx, policyKey, policy) {
<<<<<<< HEAD

        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys = [];
        while (true) {
            const res = await iterator.next();

=======
        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys=[];
        while (true) {
            const res = await iterator.next();
>>>>>>> be638c3... eslint
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                allKeys.push(Key);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                break;
            }
        }
<<<<<<< HEAD

        allKeys.forEach(element=> {if (element == policyKey)
        {throw new Error(`${policyKey} is already exist you can update attribute using UpdateAttribute function`);
        }
        });

=======
        allKeys.forEach(element=> {if (element===policyKey)
        {
            throw new Error(`${policyKey} is already exist you can update attribute using UpdateAttribute function`);
        }
        });
>>>>>>> be638c3... eslint
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(policyKey, JSON.stringify(policy));
        return 'successfully submitted!';
    }

    //Update existing policy
    async updatePolicy(ctx, policyKey, newPolicy) {
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(policyKey, JSON.stringify(newPolicy));
        return 'successfully submitted!';
    }
    // Record resourses attributes
    async recordResource(ctx, resourceKey, resource) {
<<<<<<< HEAD

        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys = [];
        while (true) {
            const res = await iterator.next();

=======
        const iterator = await ctx.stub.getStateByRange('','');
        const allKeys=[];
        while (true) {
            const res = await iterator.next();
>>>>>>> be638c3... eslint
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                allKeys.push(Key);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                break;
            }
        }
<<<<<<< HEAD

        allKeys.forEach(element=> {if (element === resourceKey)
        {throw new Error(`${resourceKey} is already exist you can update attribute using UpdateAttribute function`);
        }
        });

=======
        allKeys.forEach(element=> {if (element===resourceKey)
        {throw new Error(`${resourceKey} is already exist you can update attribute using UpdateAttribute function`);
        }
        });
>>>>>>> be638c3... eslint
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(resourceKey, JSON.stringify(resource));
        return 'successfully submitted!';
    }
    //update existing resource attributes
    async updateResource(ctx, resourceKey, newResource) {
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(resourceKey, JSON.stringify(newResource));
        return 'successfully submitted!';
    }

    // Policy Decision Point (PDP)
    async PDP (ctx, subjectKey, resourceKey, rule, policyKey){
        let policyBytes = await ctx.stub.getState(policyKey);
        if (!policyBytes || policyBytes.length === 0){
            throw new Error(`${policyKey} does not exist`);
        }
        let policy = policyBytes.toString();
        let policyParsed = JSON.parse(policy);
        while (typeof policyParsed === 'string'){
            policyParsed = JSON.parse(policyParsed);
        }
        const Abac = new NodeAbac(policyParsed);

        let subjectBytes = await ctx.stub.getState(subjectKey);
        if (!subjectBytes || subjectBytes.length === 0){
            throw new Error(`${subjectKey} does not exist`);
        }
        let subject = subjectBytes.toString();
        let subjectParsed = JSON.parse(subject);
<<<<<<< HEAD
        while(typeof subjectParsed === 'string'){
            subjectParsed = JSON.parse(subjectParsed);
=======
        while(typeof subjectParsed == 'string'){
            subjectParsed=JSON.parse(subjectParsed);
>>>>>>> be638c3... eslint
        }
        let resourceBytes = await ctx.stub.getState(resourceKey);
        if (!resourceBytes || resourceBytes.length === 0){
            throw new Error(`${resourceKey} does not exist`);
        }
        let resourceParsed = JSON.parse(resourceBytes.toString());
<<<<<<< HEAD
        while(typeof resourceParsed === 'string'){
            resourceParsed = JSON.parse(resourceParsed);
        }
        return Abac.enforce(rule, subjectParsed, resourceParsed);
    }
    //Query specific subject's attribute based on subjectKey
    async queryUserAttribute(ctx, key) {

=======
        while(typeof resourceParsed== 'string'){
            resourceParsed=JSON.parse(resourceParsed);
        }
        const permit = Abac.enforce(rule, subjectParsed, resourceParsed);
        return permit;
    }
    //Query specific subject's attribute based on subjectKey
    async queryUserAttribute(ctx, key) {
>>>>>>> be638c3... eslint
        let attributeBytes = await ctx.stub.getState(key);
        if (!attributeBytes || attributeBytes.length === 0){
            throw new Error(`${key} does not exist`);
        }
        let attribute = JSON.parse(attributeBytes);
        console.info ('this is attributeBytes:', attributeBytes);
        console.info('this is my attribute');
        return attribute;
    }

    async queryPolicies(ctx, key) {
<<<<<<< HEAD

=======
>>>>>>> be638c3... eslint
        let policyBytes = await ctx.stub.getState(key);
        if (!policyBytes || policyBytes.length === 0){
            throw new Error(`${key} does not exist`);
        }
        let policy = JSON.parse(policyBytes.toString());
        console.info ('this is attributeBytes:', policyBytes);
        console.info('this is my attribute');
        console.log(typeof policy);
        return policy;
    }

    //Query all data
    async queryAll(ctx) {
        const iterator = await ctx.stub.getStateByRange('','');

<<<<<<< HEAD
        const allResults = [];
        const allKeys = [];
=======
        const allResults=[];
        const allKeys=[];
>>>>>>> be638c3... eslint
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }

                allResults.push({ Key, Record });
                allKeys.push(Key);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
<<<<<<< HEAD

=======
>>>>>>> be638c3... eslint
}

module.exports = AttributeBased;
