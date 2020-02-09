/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class Policy extends State {

    constructor(obj) {
        super(Policy.getClass(), obj.key);
        Object.assign(this, obj);
    }

    getKey() {
        return this.key();
    }

    setKey(key)    {
        this.key = key;
    }

    getData()   {
        return this.data;
    }

    setData(data)   {
        this.data = data;
    }
    static fromBuffer(buffer) {
        return State.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance( key, data ) {
        return new Policy({ key, data });
    }

    static getClass() {
        return 'org.example.Policy';
    }
}

module.exports = Policy;
