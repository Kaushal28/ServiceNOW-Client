'use strict'

var QueryMissingFieldException = require('./Exceptions/QueryMissingFieldException');
var QueryTypeException = require('./Exceptions/QueryTypeException');
var QueryEmptyException = require('./Exceptions/QueryEmptyException');


class QueryBuilder{

    constructor(){
        this.query = [];
        this.currentField = '';
    }

    field(fieldName){
        this.currentField = fieldName;
        return this;
    }

    orderDescending(){

    }

    orderAscending(){

    }

    startsWith(startsWithStr){

    }

    endsWith(endsWithStr){

    }

    contains(containesStr){

    }

    doesNotContain(notContainesStr){

    }

    isEmpty(){

    }

    isNotEmpty(){

    }

    equals(data){
        if (typeof data == 'string' || typeof data == 'number'){
            return this._add_condition('=', data, ['string', 'number']);
        } else if (Array.isArray(data)){
            return this._add_condition('IN', data, ['object']);
        }

        throw new QueryTypeException('Expected string or list type, not: ' + typeof data);
    }

    not_equals(data){

    }

    greaterThan(data){

    }

    greaterThanOrIs(data){

    }

    lessThan(data){

    }

    lessThanOrIs(data){

    }

    between(startValue, endValue){

    }

    isAnything(str){

    }

    isOneOf(data){

    }

    isEmptyString(){

    }

    and(){
        return this._add_logical_operator('^');
    }

    or(){
        return this._add_logical_operator('^OR');
    }

    NQ(){
        return this._add_logical_operator('^NQ');
    }

    _add_logical_operator(operator){
        this.query.push(operator);
        return this;
    }

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

    build(){
        if (this.query.length == 0){
            throw new QueryEmptyException('Atleast one condition is required in query.');
        }
        return this.query.join('');
    }
}

module.exports = QueryBuilder;