/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

class ResourceList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.example.Resource');
    }

    async addResource(resource) {
        return this.addState(resource.key, resource.data);
    }

    async updateResource(key, resource) {
        return this.updateState(key, resource);
    }

    async getResource(key) {
        return this.getState(key);
    }

}


module.exports = ResourceList;
