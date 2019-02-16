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
        return this._addCondition('STARTSWITH', startsWithStr, ['string']);
    }

    /**
     * Adds new ENDSWITH condition
     * 
     * @param {String} endsWithStr 
     */
    endsWith(endsWithStr){
        return this._addCondition('ENDSWITH', endsWithStr, ['string']);;
    }

    /**
     * Adds new LIKE condition
     * 
     * @param {String} containesStr 
     */
    contains(containesStr){
        return this._addCondition('LIKE', containesStr, ['string']);
    }

    /**
     * Adds new NOTLIKE condition
     * 
     * @param {String} notContainesStr 
     */
    doesNotContain(notContainesStr){
        return this._addCondition('NOTLIKE', notContainesStr, ['string']);
    }

    /**
     * Adds new ISEMPTY condition
     */
    isEmpty(){
        return this._addCondition('ISEMPTY', '', ['string', 'number']);
    }

    /**
     * Adds new ISNOTEMPTY condition
     */
    isNotEmpty(){
        return this._addCondition('ISNOTEMPTY', '', ['string', 'number']);
    }

    /**
     * Adds new equality condition
     * 
     * @param {String} data 
     */
    equals(data){
        if (typeof data == 'string' || typeof data == 'number'){
            return this._addCondition('=', data, ['string', 'number']);
        } else if (Array.isArray(data)){
            return this._addCondition('IN', data, ['object']);
        }

        throw new QueryTypeException('Expected string or list type, found: ' + typeof data);
    }

    /**
     * Adds new non equality condition
     * 
     * @param {String} data 
     */
    notEquals(data){
        if (typeof data == 'string' || typeof data == 'number'){
            return this._addCondition('!=', data, ['string', 'number']);
        } else if (Array.isArray(data)){
            return this._addCondition('NOT IN', data, ['object']);
        }

        throw new QueryTypeException('Expected string or list type, found: ' + typeof data);
    }

    /**
     * Adds new '>' condition
     * 
     * @param {String} greaterThanValue 
     */
    greaterThan(greaterThanValue){
        if (greaterThanValue instanceof Date){
            greaterThanValue = this._getDateTimeInUTC(greaterThanValue);
        } else if (!(typeof greaterThanValue == 'number' || typeof greaterThanValue == 'string')){
            throw new QueryTypeException('Expected string/Date/number type, found: ' + typeof greaterThanValue);
        }
        return this._addCondition('>', greaterThanValue, ['number', 'string']);
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
        return this._addLogicalOperator('^');
    }

    /**
     * Addds OR operator
     */
    or(){
        return this._addLogicalOperator('^OR');
    }

    /**
     * Adds new NQ operator
     */
    NQ(){
        return this._addLogicalOperator('^NQ');
    }

    /**
     * Adds logical operator to current query string
     * 
     * @param {String} operator 
     */
    _addLogicalOperator(operator){
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
    _addCondition(operator, operand, types){
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

    _getDateTimeInUTC(dateTime){

    }
}

module.exports = QueryBuilder;