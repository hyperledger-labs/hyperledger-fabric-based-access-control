const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {
    /**
     * Called during chaincode instantiate and upgrade. This method can be used
     * to initialize asset states.
     * @async
     * @param {ChaincodeStub} stub The chaincode stub is implemented by the fabric-shim
     * library and passed to the {@link ChaincodeInterface} calls by the Hyperledger Fabric platform. The stub
     * encapsulates the APIs between the chaincode implementation and the Fabric peer.
     * @return {Promise<SuccessResponse>} Returns a promise of a response indicating the result of the invocation.
     */
    async Init(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
        console.info('=========== Instantiated attributebased Chaincode ===========');
        return shim.success();
    }

    async Invoke(stub) {
    
        let ret = stub.getFunctionAndParameters();
        console.info(ret);

        let method = this[ret.fcn];
        if (!method) {
            console.log('no function of name:' + ret.fcn + ' found');
            throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
            let payload = await method(stub, ret.params, this);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }

    async recordSubject(stub, args) {
        if (args.length != 2) {
            throw new Error('Incorrect number of arguments. Expecting 2');
          } 
          let key=args[0];
          let subject= args[1];
          const iterator = await stub.getStateByRange('','');
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

        allKeys.forEach(element=> {if (element===key)
        {throw new Error(`${key} is already exist you can update subject attribute using UpdateSubject function`);
        }
        });

        console.info('============= START : Record subjects attribute ===========');
        await stub.putState(key, JSON.stringify(subject));
        return 'successfully submitted!';
    }
    async getSubject(stub, args) {
        if (args.length != 1) {
          throw new Error('Incorrect number of arguments. Expecting name of the person to query')
        }
    
        let key = args[0];
        let attributeBytes = await stub.getState(key);
        if (!attributeBytes || attributeBytes.length ===0){
            throw new Error(`${key} does not exist`);
        }
        let attribute = JSON.parse(attributeBytes);
        console.info ('this is attributeBytes:', attributeBytes);
        console.info('this is my attribute');
        return attribute;
      }
};
shim.start(new Chaincode());
