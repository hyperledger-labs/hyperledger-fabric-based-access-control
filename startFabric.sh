#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd basic-network
./start.sh

docker-compose -f ./docker-compose.yml up -d cli

#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n abacFabric -v 1.0 -p "$CC_SRC_PATH" -l javascript
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer lifecycle chaincode package abac_fabric.tar.gz --lang node --path /opt/gopath/src/chaincode --label abacFabric
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer lifecycle chaincode install abac_fabric.tar.gz
export PACKAGE_ID=$(docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer lifecycle chaincode queryinstalled 2>&1 | awk -F "[, ]+" '/Label: /{print $3}')

#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n abacFabric -l javascript -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli  peer lifecycle chaincode approveformyorg --channelID mychannel --name abacFabric -v 1 --package-id $PACKAGE_ID --sequence 1 --signature-policy "AND ('Org1MSP.member')"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli  peer lifecycle chaincode commit -o orderer.example.com:7050 --channelID mychannel --name abacFabric -v 1 --sequence 1 --waitForEvent --signature-policy "AND ('Org1MSP.member')"

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"initLedger","Args":[]}'



cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Next, use the AttributeBased applications to interact with the deployed Attributebased contract.
The AttributeBased applications are available in multiple programming languages.
Follow the instructions for the programming language of your choice:

JavaScript:

  Start by changing into the "javascript" directory:
    cd javascript

  Next, install all required packages:
    npm install

  Then run the following applications to enroll the admin user, and register a new user
  called user1 which will be used by the other applications to interact with the deployed
  AttributeBased contract:
    node enrollAdmin
    node registerUser

  You can run the invoke application as follows. By default, the invoke application will
  create a new user attribute, but you can update the application to submit other transactions:
    node invoke

  You can run the query application as follows. By default, the query application will
  return all records including attributes and policies, but you can update the application to evaluate other transactions:
    node query

You can run transactions against the ledger:
Record assets
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"recordSubject","Args":["Ariel","{\"user\":{\"active\":true,\"dob\":\"1989-06-06\",\"banCount\":1,\"group\":12,\"department\":\"computer\"}}"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"recordSubject","Args":["Ana","{\"user\":{\"active\":false,\"dob\":\"1989-06-06\",\"banCount\":1,\"group\":12,\"department\":\"computer\"}}"]}'

Query assets
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"getSubject","Args":["Ana"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"getResource","Args":["initResource"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"getPolicy","Args":["initPolicy"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"queryAll","Args":[]}'

#PDP returns true
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"decide","Args":["initSubject","initResource","can-be-admin-of-group", "initPolicy"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"decide","Args":["Ariel","initResource","can-be-admin-of-group", "initPolicy"]}'

#PDP returns false
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n abacFabric -c '{"function":"decide","Args":["Ana","initResource","can-be-admin-of-group", "initPolicy"]}'


EOF
