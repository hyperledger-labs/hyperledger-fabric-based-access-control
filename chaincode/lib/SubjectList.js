/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

class SubjectList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.example.Subject');
    }

    async addSubject(sub) {
        return this.addState(sub.key, sub.data);
    }

    async updateSubject(key, subject) {
        return this.updateState(key, subject);
    }

    async getSubject(key) {
        return this.getState(key);
    }

}


module.exports = SubjectList;
