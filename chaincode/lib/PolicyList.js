/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

class PolicyList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.example.Policy');
    }

    async addPolicy(policy) {
        return this.addState(policy.key, policy.data);
    }

    async updatePolicy(key, policy) {
        return this.updateState(key, policy);
    }

    async getPolicy(key) {
        return this.getState(key);
    }

}


module.exports = PolicyList;
