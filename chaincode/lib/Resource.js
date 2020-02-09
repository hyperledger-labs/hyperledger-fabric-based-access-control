/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class Resource extends State {

    constructor(obj) {
        super(Resource.getClass(), obj.key);
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
        return Resource.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance( key, data ) {
        return new Resource({ key, data });
    }

    static getClass() {
        return 'org.example.Resource';
    }
}

module.exports = Resource;
