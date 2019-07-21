## Hyperledger-Fabric-Based-Acess-Control
Welcome to the [Hyperledger Fabric Based Access Control project](https://wiki.hyperledger.org/display/INTERN/Hyperledger+Fabric+Based+Access+Control). 

This project aims to mediate the access control flow coming from a centralized system, enhancing auditability and access control policy enforcement. It discourages illicit accesses, as the system administrators are not able to tamper the access logs (if applicable). 

#### Pre-requisites
Make sure following tools are installed:

* NodeJS 8 (LTS)
* Docker
* Docker-compose

#### Installation steps

1. To avoid any conflict with the prevoius network, kill docker containers and remove docker images (Please note that that this will take down all of your containers and removes all images which has container name starting with dev)

* docker kill $(docker ps -q)
* docker rm $(docker ps -aq)
* docker rmi $(docker images dev-* -q)

2. Navigate to the ``attributebased`` directory 

3. Start the Fabric Network and javascript version of attributebased chaincode by running:
    ``./startFabric javascript``
4. Go to ``javascript`` and run ``npm install``

#### Demonstration

6. To enroll an admin user, run ``node enrollAdmin.js``

7. With the enrolled admin, register another user with ``node registerUser.js``
    
    
8. Run ``node invoke.js`` file to record a new attribute in json format on the ledger. 

9. Query the ledger with ``query.js`` 
    
#### Shutting the network down

 1. To stop the network, run ``./stopFabric``
