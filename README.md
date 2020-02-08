## Hyperledger-Fabric-Based-Acess-Control
[![Build Status](https://travis-ci.com/RafaelAPB/Hyperledger-Fabric-Based-Acess-Control.svg?token=XFiDrRAqvqphcoasyH7N&branch=master)](https://travis-ci.com/RafaelAPB/Hyperledger-Fabric-Based-Acess-Control)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fc80de720f6412b89f67d52f9922e67)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=RafaelAPB/Hyperledger-Fabric-Based-Acess-Control&amp;utm_campaign=Badge_Grade)

Welcome to the [Hyperledger Fabric Based Access Control project](https://wiki.hyperledger.org/display/INTERN/Hyperledger+Fabric+Based+Access+Control). 

This project aims to mediate the access control flow coming from a centralized system, enhancing auditability and access control policy enforcement. It discourages illicit accesses, as the system administrators are not able to tamper the access logs (if applicable). 

### Pre-requisites
Make sure following tools are installed:

*  NodeJS ^10.15 (tested with 10.18.1)
*  Docker (latest)
*  Docker-compose (latest)

#### Installation steps
1. Install the  [prerequesites](https://hyperledger-fabric.readthedocs.io/en/master/prereqs.html) and [fabric-samples](https://hyperledger-fabric.readthedocs.io/en/master/install.html).
NOTE: Install Fabric v2.0 with ``curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.0.0 1.4.4 0.4.18
``
1. To avoid any conflict with previous network, remove all docker containers. 

*  docker kill $(docker ps -q)
*  docker rm $(docker ps -aq)

3. Start the Fabric Network and javascript version of abacFabric chaincode by running:
    ``./startFabric``
   
4. You may run transactions against the ledger, specified at the end of script execution
    
2. Navigate to the ``abacFabric`` directory 

4. Go to ``javascript`` and run ``npm install``. NOTE: The client is still being refactored

### Demonstration

6. To enroll an admin user, run ``node enrollAdmin.js``

7. With the enrolled admin, register another user with ``node registerUser.js``
    
8. Run ``node index.js`` file to run the web application. I your terminal you should see the message "app is listening on port 3000 ..."

9. In your browser go to the address ``localhost:3000``. 
Now you record subjects and resources attributes and policies in JSON format on the ledger. Query the stored data. And check the access permissions based on stored data and given rule.
    
### Shutting the network down

 1. To stop the network, run ``./stopFabric``
