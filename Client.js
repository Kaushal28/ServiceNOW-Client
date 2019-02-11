'use strict'

var request = require('request');
var utils = require('./Utils');

class Client {
    
    /**
     * Initiates the ServiceNow Client
     * 
     * @param {String} instance
     * @param {String} username
     * @param {String} password
     * @param {String} apiName
     * @param {String} namespace
     */
    constructor(instance, username, password,  apiName = 'table', namespace='now', requestFormat='application/json', responseFormat='application/json'){
        this.instance = instance;
        this.username = username;
        this.password = password;
        this.namespace = namespace;
        this.apiName = apiName;
        this.responseFormat = responseFormat;
        this.requestFormat = requestFormat;
        this.scriptName = 'Client';
        this.auth = {
            'user': this.username,
            'pass': this.password,
            'sendImmediately': false
        }
        this.headers = {
            'Accept': this.responseFormat,
            'Content-Type': this.requestFormat
        }
    }
    
    /**
     * 
     * @param {String} table 
     * @param {String} query 
     * 
     * @returns {Object} 
     * 
     * @throws snowRESTException
     */
    getRecords(table, query, callback){
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithoutBody(this.headers, 
                                                                this.auth ,
                                                                'GET', 
                                                                utils.URLBuilder(this.instance, this.namespace, this.apiName, table) + '?sysparm_query=' + query.build());
            //TODO: Handle query
            request(requestParams, (err, res) => {
                if (!res || err){
                    return reject('Error While fetching records from ' + this.instance + '. Error: ' + err.toString());
                }
                if (res.statusCode >= 400){
                    return reject('Error While fetching records from ' + this.instance + '. Error: ' + res.body);
                }
                resolve(res.body);
            });
        }).then((response) => {
            callback(response);
        })
        .catch((error) => {
            callback(error);
        });
    }

    /**
     * 
     * @param {String} table 
     * @param {String} body 
     * 
     * @returns {String} sys_id
     * 
     * @throws snowRESTException
     */
    createRecord(table, body, callback){
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithBody(this.headers, 
                                                                this.auth, 
                                                                JSON.stringify(body), 
                                                                'POST', 
                                                                utils.URLBuilder(this.instance, this.namespace, this.apiName, table));

            request(requestParams, (err, res) => {
                if (!res || err) {
                    return reject('Error While creating records on ' + this.instance + '. Error: ' + err.toString());
                }
                if (res.statusCode >= 400){
                    return reject('Error While creating record on' + this.instance + '. Error: ' + res.body);
                }
                if (res.statusCode == 201){
                    resolve(JSON.parse(res.body).result.sys_id);
                }
                return reject('Error While creating record on' + this.instance + '. Error: ' + res.body);
            });
        }).then((response) => {
            callback(response);
        }).catch((error) => {
            callback(error);
        });
    }

    /**
     * 
     * @param {String} table 
     * @param {String} sysId
     * 
     * @returns {Object}
     * 
     * @throws snowRESTException
     */
    getSingleRecord(table, sysId, callback){
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithoutBody(this.headers, 
                                                                    this.auth,
                                                                    'GET', 
                                                                    utils.URLBuilder(this.instance, this.namespace, this.apiName, table, sysId));

            request(requestParams, (err, res) => {
                if (!res || err){
                    return reject('Error While fetching single record from ' + this.instance + '. Error: ' + err.toString());
                }
                if (res.statusCode >= 400){
                    return reject('Error While fetching single record from ' + this.instance + '. Error: ' + res.body);
                }
                resolve(res.body);
            });
        }).then((response) => {
            callback(response);
        }).catch((error) => {
            callback(error);
        });
    }

    /**
     * 
     * @param {String} table 
     * @param {String} body 
     * @param {String} sysId
     * 
     * @returns {String} sys_id
     * 
     * @throws snowRESTException
     * 
     */
    updateSingleRecord(table, body, sysId, callback){
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithBody(this.headers, 
                                                                this.auth,
                                                                JSON.stringify(body),
                                                                'PUT', 
                                                                utils.URLBuilder(this.instance, this.namespace, this.apiName, table, sysId));

            request(requestParams, (err, res) => {
                if (!res || err){
                    return reject('Error While updating single record on ' + this.instance + '. Error: ' + err.toString());
                }
                if (res.statusCode >= 400){
                    return reject('Error While updating single record on ' + this.instance + '. Error: ' + res.body);
                }
                if (res.statusCode == 200){
                    resolve(JSON.parse(res.body).result.sys_id);
                }
                return reject('Error While updating single record on ' + this.instance + '. Error: ' + res.body);
            });
        }).then((response) => {
            callback(response);
        }).catch((error) => {
            callback(error);
        });
    }

    /**
     * 
     * @param {String} table 
     * @param {String} sysId
     * 
     * @returns {boolean}
     * 
     * @throws snowRESTException
     *  
     */
    deleteSingleRecord(table, sysId, callback){
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithoutBody(this.headers, 
                                                                    this.auth,
                                                                    'DELETE', 
                                                                    utils.URLBuilder(this.instance, this.namespace, this.apiName, table, sysId));
                
            request(requestParams, (err, res) => {
                if (!res || err){
                    return reject('Error While deleting single record from ' + this.instance + '. Error: ' + err.toString());
                }
                if (res.statusCode >= 400){
                    return reject('Error While deleting single record from ' + this.instance + '. Error: ' + res.body);
                }

                if (res.statusCode == 204){
                    resolve(true);
                }
                return reject(false);
            });   
        }).then((response) => {
            callback(response);
        }).catch((error) => {
            callback(error);
        });
    }
}

module.exports = Client;