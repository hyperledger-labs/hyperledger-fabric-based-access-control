# Hyperledger-Fabric-Based-Acess-Control

# Installation steps

1. To avoid any conflict with the prevoius network, kill docker containers and remove docker images (Please note that that this will take down all of your containers and removes all images which has container name starting with dev)

    docker kill $(docker ps -q)
    docker rm $(docker ps -aq)
    docker rmi $(docker images dev-* -q)
2. go to attributebased directory 
    cd attributebased
3. start the Fabric network and javascript version of attributebased chaincode using the startFabric bash file
    ./startFabric javascript
4. go to the javascript directory
    cd javascript
5. install npm packages
    npm install
6. Enroll admin user
    node enrollAdmin.ks
7. Now admin user can register another user (user1)
    node registerUser.js
8. Use invoke.js file to record a new attribute in json format on the ledger. By default invoke.js records subject attributes on the ledger by calling 'recordAttribute' transaction on line 46. It can update attribute, record policy, update policy by calling related transactions.  
    node invoke.js
It asks for a key to use as an attributeKey and the attribute in json format
You can use https://www.browserling.com/tools/remove-all-whitespace to remove the spaces for entering the json data like {user:{department:computer,supervisor:john,dob:'1997-11-12',lab:HCI}}

9. Query the ledger using query.js file. By default query file query all the records store on the ledger includes all the attributes and policies using 'queryAll' transaction. You can query specific attribute or specific policy by calling respective transactions defined in the chainCode.
    node query.js

 
