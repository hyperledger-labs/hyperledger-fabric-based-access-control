## Hyperledger-Fabric-Based-Acess-Control
[![Build Status](https://travis-ci.com/RafaelAPB/Hyperledger-Fabric-Based-Acess-Control.svg?token=XFiDrRAqvqphcoasyH7N&branch=master)](https://travis-ci.com/RafaelAPB/Hyperledger-Fabric-Based-Acess-Control)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fc80de720f6412b89f67d52f9922e67)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=RafaelAPB/Hyperledger-Fabric-Based-Acess-Control&amp;utm_campaign=Badge_Grade)

Welcome to the [Hyperledger Fabric Based Access Control project](https://wiki.hyperledger.org/display/INTERN/Hyperledger+Fabric+Based+Access+Control). 

This project aims to mediate the access control flow coming from a centralized system, enhancing auditability and access control policy enforcement. It discourages illicit accesses, as the system administrators are not able to tamper the access logs (if applicable). 

### Pre-requisites
Make sure following tools are installed:

*  NodeJS 8 (LTS)
*  Docker
*  Docker-compose

#### Installation steps

1. To avoid any conflict with the prevoius network, kill docker containers and remove docker images (Please note that that this will take down all of your containers and removes all images which has container name starting with dev)

*  docker kill $(docker ps -q)
*  docker rm $(docker ps -aq)
*  docker rmi $(docker images dev-* -q)

2. Navigate to the ``attributebased`` directory 

3. Start the Fabric Network and javascript version of attributebased chaincode by running:
    ``./startFabric javascript``
    
4. Go to ``javascript`` and run ``npm install``

### Demonstration

6. To enroll an admin user, run ``node enrollAdmin.js``

7. With the enrolled admin, register another user with ``node registerUser.js``
    
    
8. Run ``node index.js`` file to run the web application. I your terminal you should see the message "app is listening on port 3000 ..."
9. In your browser go to the address ``localhost:3000``. 
Now you record subjects and resources attributes and policies in JSON format on the ledger. Query the stored data. And check the access permissions based on stored data and given rule.
    
### Shutting the network down

 1. To stop the network, run ``./stopFabric``
