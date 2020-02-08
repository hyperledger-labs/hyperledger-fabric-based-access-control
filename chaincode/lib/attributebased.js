/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
//import {subjectAttribute} from './lib/data/policy.json';
const { Contract, Context } = require('fabric-contract-api');
const NodeAbac = require('node-abac');
const path = require('path');
const fs = require('fs');

const policyDataPath = path.join(process.cwd(), './data/policy.json');
const policyDataJson = fs.readFileSync(policyDataPath, 'utf8');
const Policy = require('./Policy.js');
const PolicyList = require('./PolicyList.js');

const subjectDataPath = path.join(process.cwd(), './data/subject.json');
const subjectAttributeJSON = fs.readFileSync(subjectDataPath, 'utf8');
const Subject = require('./Subject.js');
const SubjectList = require('./SubjectList.js');

const resourceDataPath = path.join(process.cwd(), './data/resource.json');
const resourceJSON = fs.readFileSync(resourceDataPath, 'utf8');
const Resource = require('./Resource.js');
const ResourceList = require('./ResourceList.js');

class abacContext extends Context {

    constructor() {
        super();
        // All Citius logs are held in a list
        this.subjectList = new SubjectList(this);
        this.policyList = new PolicyList(this);
        this.resourceList = new ResourceList(this);
    }
}

class abacFabric extends Contract {
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.example.abacFabric');
    }

    createContext() {
        return new abacContext();
    }

    // Initialize ledger
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        await this.recordPolicy(ctx,'initPolicy', policyDataJson);
        await this.recordSubject(ctx,'initSubject', subjectAttributeJSON);
        await this.recordResource(ctx, 'initResource', resourceJSON);
        console.info('============= END : Initialize Ledger ===========');
    }
    //Store subject attributes on the legder
    async recordSubject(ctx, subjectKey, subject) {
        let sub = Subject.createInstance(subjectKey, subject);
        await ctx.subjectList.addSubject(sub);
    }

    //Update the existing subject attributes
    async updateSubject(ctx, subjectKey, newSubject){
        await ctx.subjectList.updateSubject(subjectKey,newSubject);
    }

    async getSubject(ctx, subjectKey)   {
        return await ctx.subjectList.getSubject(subjectKey);

    }
    //Store subject attributes on the legder
    async recordPolicy(ctx, policyKey, policyData) {
        let policy = Policy.createInstance(policyKey, policyData);
        return await ctx.policyList.addPolicy(policy);
    }

    //Update the existing subject attributes
    async updatePolicy(ctx, policyKey, newPolicy){
        await ctx.policyList.updatePolicy(policyKey,newPolicy);
    }

    async getPolicy(ctx, policyKey)   {
        return await ctx.policyList.getPolicy(policyKey);
    }
    //Store subject attributes on the legder
    async recordResource(ctx, resourceKey, resourceData) {
        let resource = Resource.createInstance(resourceKey, resourceData);
        await ctx.resourceList.addResource(resource);
    }

    //Update the existing subject attributes
    async updateResource(ctx, resourceKey, newResource){
        await ctx.resourceList.updateResource(resourceKey,newResource);
    }

    async getResource(ctx, resourceKey)   {
        return await ctx.resourceList.getResource(resourceKey);
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
        while(typeof subjectParsed === 'string'){
            subjectParsed = JSON.parse(subjectParsed);
        }
        let resourceBytes = await ctx.stub.getState(resourceKey);
        if (!resourceBytes || resourceBytes.length === 0){
            throw new Error(`${resourceKey} does not exist`);
        }
        let resourceParsed = JSON.parse(resourceBytes.toString());
        while(typeof resourceParsed === 'string'){
            resourceParsed = JSON.parse(resourceParsed);
        }
        return Abac.enforce(rule, subjectParsed, resourceParsed);
    }

    async decide (ctx, subjectKey, resourceKey, rule, policyKey){
        let policy = JSON.parse(await this.getPolicy(ctx,policyKey));
        if (!policy || policy.length === 0){
            throw new Error(`${policyKey} does not exist`);
        }

        const abacNode = new NodeAbac(policy);

        let subject = JSON.parse(await this.getSubject(ctx, subjectKey));
        if (!subject || subject.length === 0){
            throw new Error(`${subjectKey} does not exist`);
        }

        let resource = JSON.parse(await this.getResource(ctx,resourceKey));
        if (!resource || resource.length === 0){
            throw new Error(`${resourceKey} does not exist`);
        }

        return abacNode.enforce(rule, subject, resource);
    }


    //Query all data
    //TODO Update
    async queryAll(ctx) {
        const iterator = await ctx.stub.getStateByRange('','');

        const allResults = [];
        //let allKeys = [];
        // eslint-disable-next-line no-constant-condition
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
                //allKeys.push(Key);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = abacFabric;
