/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples

*/

'use strict';
const State = require('./state.js');

class StateList {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
    }

    async addState(key, data) {
        //TODO: check if state to be added already exists
        await this.ctx.stub.putState(key, State.serialize(data));
    }

    async checkKey(key)    {
        const iterator = await this.ctx.stub.getStateByRange('','');
        const allKeys = [];


        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res =  await iterator.next();
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                allKeys.push(Key);
            }
            if (res.done)   {
                await iterator.close();
                break;
            }
        }

        allKeys.forEach(element => {
            if (element === key) {
                throw new Error(`${key} is already exist you can update subject attribute using UpdateSubject function`);
            }
        });

        return true;
    }

    async getState(key) {
        let data = await this.ctx.stub.getState(key);
        if (data && data.toString()) {
            return State.deserialize(data);
        } else {
            return null;
        }
    }

    async updateState(key,state) {
        await this.ctx.stub.putState(key, State.serialize(state));
    }

}

module.exports = StateList;
