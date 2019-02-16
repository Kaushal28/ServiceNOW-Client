# ServiceNOW-Client
A Javascript client for ServiceNOW REST API.

## installation

Run `npm install servicenow-client` to install the package.

## Basic Usage

```
const servicenowClient = require('servicenow-client');

servicenowClient = new servicenowClient('https://<INSTANCE>.service-now.com','<USERNAME>','<PASSWORD>');

servicenowClient.getSingleRecord('<TABLE_NAME>', <SYS_ID>, (res)=>{
    console.log(res);
});
```
## Supported Actions

```
//returns JSON of record
getSingleRecord('<TABLE_NAME>', '<SYS_ID>', callback);

//returns sys_id of created record
createRecord('<TABLE_NAME>', <JSON_RECORD_BODY>, callback);

//returns true if success, false otherwise
deleteSingleRecord('<TABLE_NAME>', '<SYS_ID_OF_RECORD_TO_BE_DELETED>', callback);

//returns sys_id of updated record
updateSingleRecord('<TABLE_NAME>', <JSON_RECORD_BODY> , '<SYS_ID_OF_RECORD_TO_BE_DELETED>', callback);

//Returns JSON of list of record(s). Use query builder for building advanced serviceNOW  encoded query
getRecords('<TABLE_NAME>', '<ENCODED_QUERY>', callback);

//returns count of records matching given query
getRecordCount('<TABLE_NAME>', '<ENCODED_QUERY>', callback);
```

## Example usage of above example

```
servicenowClient.getSingleRecord('<TABLE_NAME>', '<SYS_ID>', (res) => {
    //use response
    console.log(res);
});

servicenowClient.createRecord('<TABLE_NAME>', {'endpoint': 'published'}, (res) => {
    //use response
    console.log(res);
});

servicenowClient.deleteSingleRecord('<TABLE_NAME>', '<SYS_ID>', (res) => {
    //use response
    console.log(res);
});

servicenowClient.updateSingleRecord('<TABLE_NAME>', <JSON_RECORD_BODY> ,'<SYS_ID>', (res) => {
    //use response
    console.log(res);
});

servicenowClient.getRecords('<TABLE_NAME>', '<ENCODED_QUERY>', (res) => { //Use query builder to create encoded query
    //use response
    console.log(res);
});

servicenowClient.getRecordCount('<TABLE_NAME>', '<ENCODED_QUERY>', (res) => { //Use query builder to create encoded query
        //use response
        console.log(res);
})
```

## Query Builder example usage

```
var queryBuilder = new QueryBuilder();

//Less than '<'
var query = queryBuilder.field('sys_created_on').lessThan('2019-02-15 14:30:18');

//Less thank using Date object
var query = queryBuilder.field('sys_created_on').lessThan(moment(new Date()).subtract(1, 'days').toDate());

//Greater thank using Moment object
var query = queryBuilder.field('sys_created_on').lessThan(moment(new Date()).subtract(1, 'days'));


//compound query using and, lessThan, greaterThan
var query = queryBuilder.field('number').greaterThan('S').and().field('sys_created_on').lessThan(moment(new Date()).subtract(1, 'hours'));

//Between two dates (both date and moment objects supported), numbers, Strings 
var query = queryBuilder.field('sys_created_on').between('2015-02-15 14:30:18', '2019-02-18 14:30:18');
var query = queryBuilder.field('risk_score').between(47, 52);
var query = queryBuilder.field('number').between('A', 'Z');

//Empty String query
var query = queryBuilder.field('description').isEmptyString();

//Example of 'IN' operator
var query = queryBuilder.field('number').isOneOf(['INC0010122','INC0010120']);

//Is anything operator
var query = queryBuilder.field('number').isAnything();

//Contains operator
var query = queryBuilder.field('number').contains('<YOUR_STRING>');

//Order ascending/descending
var query = queryBuilder.field('number').contains('<YOUR_STRING>').or().contains('<OTHER_STRING>').orderAscending();

//Multiple conditions on a single field
var query = queryBuilder.field('number').contains('<YOUR_STRING>').and().contains('<OTHER_STRING>').orderDescending();

//Ends with operator
var query = queryBuilder.field('number').endsWith('<YOUR_STRING>');

//Does not contain
var query = queryBuilder.field('number').doesNotContain('<YOUR_STRING>');

//equals
var query = queryBuilder.field('number').equals('<YOUR_STRING>/<ARRAY>');

//isEmpty
var query = queryBuilder.field('number').isEmpty();

//isNotEmpty
var query = queryBuilder.field('number').isNotEmpty();
```
