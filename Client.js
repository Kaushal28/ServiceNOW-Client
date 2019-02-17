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
    constructor(instance, username, password, requestFormat='application/json', responseFormat='application/json', apiName = 'table', namespace='now'){
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
     * @param {Object} callback
     * 
     * @returns {Object} 
     * 
     * @throws snowRESTException
     */
    getRecords(table, query, callback){
        if(query instanceof require('./QueryBuilder')){
            query = utils.URLBuilder(this.instance, this.namespace, this.apiName, table) + '?sysparm_query=' + query.build();
        } else {
            query = utils.URLBuilder(this.instance, this.namespace, this.apiName, table);
        }
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithoutBody(this.headers, 
                                                                this.auth ,
                                                                'GET', 
                                                                query);
            request(requestParams, (err, res) => {
                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
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
     * @param {String} query 
     * @param {Object} callback 
     * 
     * @returns {number} Count of records for given query and given table
     */
    getRecordCount(table, query, callback){

        let reqFormat = 'application/json', respFormat = 'application/json';
        //Change current request/response format to JSON if other format is being used
        if (!(this.requestFormat == 'application/json' && this.responseFormat == 'application/json')){
            reqFormat = this.requestFormat;
            respFormat = this.responseFormat;
        }

        if(query instanceof require('./QueryBuilder')){
            query = utils.URLBuilder(this.instance, this.namespace, this.apiName, table) + '?sysparm_query=' + query.build() + 'sysparm_fields=sys_created_on';
        } else {
            query = utils.URLBuilder(this.instance, this.namespace, this.apiName, table) + 'sysparm_fields=sys_created_on';
        }
        new Promise((resolve, reject) => {
            var requestParams = utils.setRequestParamsWithoutBody(this.headers, 
                                                                this.auth ,
                                                                'GET', 
                                                                query);
            request(requestParams, (err, res) => {
                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
                }
                resolve(JSON.parse(res.body).result.length);
            });
        }).then((response) => {
            callback(response);
        })
        .catch((error) => {
            callback(error);
        }).then(() => {
            this.requestFormat = reqFormat;
            this.responseFormat = respFormat;
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
                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
                } else if (res.statusCode == 201){
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
                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
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
                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
                } else if (res.statusCode == 200){
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

                var errorMessage = this._handleErrors(res, err);
                if (errorMessage){
                    return reject(errorMessage);
                } else if (res.statusCode == 204){
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

    /**
     * Returns error message in case of error, empty string otherwise
     * 
     * @param {Object} res 
     * @param {Object} err 
     */
    _handleErrors(res, err){
        if (err){
            return 'Error While performing specified operation on ' + this.instance + '. Error: ' + err.toString();
        } else if (!res.body){
            return 'Error While performing specified operation on ' + this.instance + '. Retrieved empty response';
        } else if (res.statusCode >= 400){
            return 'Error While performing specified operation on ' + this.instance + '. Error: ' + res.body;
        }
        return '';
    }
}

module.exports = Client;