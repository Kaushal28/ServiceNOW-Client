# ServiceNOW-Client
A Javascript client for ServiceNOW REST API.

## installation

Run `npm install servicenow-client` to install the package.

## Basic Usage

```
const servicenowClient = require('servicenow-client');

servicenowClient = new servicenowClient('https://<INSTANCE>.service-now.com','<USERNAME>','<PASSWORD>');

servicenowClient.getSingleRecord('<TABLE_NAME>',(res)=>{
    console.log(res);
});
```
## Supported Actions

```
getSingleRecord('<TABLE_NAME>', callback); //returns JSON of record

createRecord('<TABLE_NAME>', <JSON_RECORD_BODY>, callback); //returns sys_id of created record

deleteSingleRecord('<TABLE_NAME>', <SYS_ID_OF_RECORD_TO_BE_DELETED>, callback); //returns true if success, false otherwise

updateSingleRecord('<TABLE_NAME>', <JSON_RECORD_BODY> , <SYS_ID_OF_RECORD_TO_BE_DELETED>, callback); //returns sys_id of updated record

getRecords('<TABLE_NAME>', <ENCODED_QUERY>, callback); //Will add query builder. //Returns JSON of list of record(s).
```
