/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

const State = require('./../ledger-api/state.js');

class Subject extends State {

    constructor(obj) {
        super(Subject.getClass(), obj.key);
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
        return Subject.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance( key, data ) {
        return new Subject({ key, data } );
    }

    static getClass() {
        return 'org.example.Subject';
    }
}

module.exports = Subject;
