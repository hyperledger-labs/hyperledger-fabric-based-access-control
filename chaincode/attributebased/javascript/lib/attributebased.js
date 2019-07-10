/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


class AttributeBased extends Contract {
    // Initialize ledger
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');    

        
        console.info('============= END : Initialize Ledger ===========');
    }
    //Store subject attributes on the legder
    async recordAttribute(ctx, attributeKey, attribute) {
       
      const iterator = await ctx.stub.getStateByRange("","");
      const allKeys=[];
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

        allKeys.forEach(element=> {if (element==attributeKey)
        {throw new Error(`${attributeKey} is already exist you can update attribute using UpdateAttribute function`);
        }
        });

        console.info('============= START : Record attribute ===========');
       await ctx.stub.putState(attributeKey, JSON.stringify(attribute));
       return "successfully submitted!";
    }

    

    //Update the existing attribute
    async updateAttribute(ctx, attributeKey, newAttribute){
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(attributeKey, JSON.stringify(newAttribute));
        return "successfully submitted!";
    }

    //Record policy
    async recordPolicy(ctx, policyKey, policy) {
       
        const iterator = await ctx.stub.getStateByRange("","");
        const allKeys=[];
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
  
          allKeys.forEach(element=> {if (element==policyKey)
          {throw new Error(`${policyKey} is already exist you can update attribute using UpdateAttribute function`);
          }
    });
  
         console.info('============= START : Record attribute ===========');
         await ctx.stub.putState(policyKey, JSON.stringify(policy));
         return "successfully submitted!";
      }
    
      async updatePolicy(ctx, policyKey, newPolicy) {
        console.info('============= START : Record attribute ===========');
        await ctx.stub.putState(policyKey, JSON.stringify(newPolicy));
        return "successfully submitted!";
    }

    //Query specific subject's attribute based on subjectKey
    async queryUserAttribute(ctx, key) {
       
        let attributeBytes = await ctx.stub.getState(key);
        if (!attributeBytes || attributeBytes.length ===0){
            throw new Error(`${key} does not exist`);
        }
        var attribute = JSON.parse(attributeBytes);
        console.info ('this is attributeBytes:', attributeBytes);
        console.info('this is my attribute');
        return attribute;  
    }

    async queryPolicies(ctx, key) {
       
        let policyBytes = await ctx.stub.getState(key);
        if (!policyBytes || policyBytes.length ===0){
            throw new Error(`${key} does not exist`);
        }
        var policy = JSON.parse(policyBytes);
        console.info ('this is attributeBytes:', policyBytes);
        console.info('this is my attribute');
        return policy;  
    }

    //Query all data
    async queryAll(ctx) {
        const iterator = await ctx.stub.getStateByRange("","");

      const allResults=[];
      const allKeys=[];
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
    
}

module.exports = AttributeBased;
