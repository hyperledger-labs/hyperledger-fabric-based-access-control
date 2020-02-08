/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';

class State {

    constructor(stateClass, key) {
        this.class = stateClass;
        this.key = key;
    }

    getClass() {
        return this.class;
    }

    getKey() {
        return this.key;
    }

    serialize() {
        return State.serialize(this);
    }

    static serialize(object) {
        return Buffer.from(JSON.stringify(object));
    }

    static deserialize(data) {
        return JSON.parse(data.toString());
        //TODO create object from string?
    }
}

module.exports = State;
