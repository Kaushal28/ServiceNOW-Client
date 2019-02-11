'use strict'

var QueryMissingFieldException = require('./Exceptions/QueryMissingFieldException');
var QueryTypeException = require('./Exceptions/QueryTypeException');
var QueryEmptyException = require('./Exceptions/QueryEmptyException');

/**
 * QueryBuilder: For constructing advanced serviceNOW queries
 */

class QueryBuilder{

    constructor(){
        this.query = [];
        this.currentField = '';
    }

    /**
     * Sets the field to operate on
     * 
     * @param {String} fieldName 
     */
    field(fieldName){
        this.currentField = fieldName;
        return this;
    }

    /**
     * Sets ordering of field to descending
     */
    orderDescending(){
        this.query.push('ORDERBYDESC' + this.currentField);
        return this;
    }

    /**
     * Sets ordering of field to ascending
     */
    orderAscending(){
        this.query.push('ORDERBY' + this.currentField);
        return this;
    }
    
    /**
     * Adds new STARTSWITH condition
     * 
     * @param {String} startsWithStr 
     */
    startsWith(startsWithStr){
        return this._add_condition('STARTSWITH', startsWithStr, ['string']);
    }

    /**
     * Adds new ENDSWITH condition
     * 
     * @param {String} endsWithStr 
     */
    endsWith(endsWithStr){
        return this._add_condition('ENDSWITH', endsWithStr, ['string']);;
    }

    /**
     * Adds new LIKE condition
     * 
     * @param {String} containesStr 
     */
    contains(containesStr){
        return this._add_condition('LIKE', containesStr, ['string']);
    }

    /**
     * Adds new NOTLIKE condition
     * 
     * @param {String} notContainesStr 
     */
    doesNotContain(notContainesStr){
        return this._add_condition('NOTLIKE', notContainesStr, ['string']);
    }

    /**
     * Adds new ISEMPTY condition
     */
    isEmpty(){
        return this._add_condition('ISEMPTY', '', ['string', 'number']);
    }

    /**
     * Adds new ISNOTEMPTY condition
     */
    isNotEmpty(){
        return this._add_condition('ISNOTEMPTY', '', ['string', 'number']);
    }

    /**
     * Adds new equality condition
     * 
     * @param {String} data 
     */
    equals(data){
        if (typeof data == 'string' || typeof data == 'number'){
            return this._add_condition('=', data, ['string', 'number']);
        } else if (Array.isArray(data)){
            return this._add_condition('IN', data, ['object']);
        }

        throw new QueryTypeException('Expected string or list type, not: ' + typeof data);
    }

    /**
     * Adds new non equality condition
     * 
     * @param {String} data 
     */
    not_equals(data){
        if (typeof data == 'string' || typeof data == 'number'){
            return this._add_condition('!=', data, ['string', 'number']);
        } else if (Array.isArray(data)){
            return this._add_condition('NOT IN', data, ['object']);
        }

        throw new QueryTypeException('Expected string or list type, not: ' + typeof data);
    }

    greaterThan(greaterThanValue){

    }

    greaterThanOrIs(greaterThanOrIsValue){

    }

    lessThan(lessThanValue){

    }

    lessThanOrIs(lessThanOrIsValue){

    }

    between(startValue, endValue){

    }

    isAnything(str){

    }

    isOneOf(data){

    }

    isEmptyString(){

    }

    /**
     * Adds AND operator
     */
    and(){
        return this._add_logical_operator('^');
    }

    /**
     * Addds OR operator
     */
    or(){
        return this._add_logical_operator('^OR');
    }

    /**
     * Adds new NQ operator
     */
    NQ(){
        return this._add_logical_operator('^NQ');
    }

    /**
     * Adds logical operator to current query string
     * 
     * @param {String} operator 
     */
    _add_logical_operator(operator){
        this.query.push(operator);
        return this;
    }

    /**
     * Adds new condition to current query string 
     * 
     * @param {String} operator 
     * @param {String} operand 
     * @param {List} types 
     */
    _add_condition(operator, operand, types){
        if (!this.currentField){
            throw new QueryMissingFieldException('Conditions requires a field.');
        }

        if (!types.includes(typeof operand)){
            var errorMessage = '';
            if (types.length > 1){
                errorMessage = 'Invalid type passed. Expected one of: ' + types;
            } else {
                errorMessage = 'Invalid type passed. Expected: ' + types;
            }
            throw new QueryTypeException(errorMessage);
        }

        this.query.push(this.currentField + operator + operand);
        return this;
    }

    /**
     * Builds serviceNOW readable the query.
     */
    build(){
        if (this.query.length == 0){
            throw new QueryEmptyException('Atleast one condition is required in query.');
        }
        return this.query.join('');
    }
}

module.exports = QueryBuilder;