'use strict'

function QueryTypeException(message) {
    this.message = message;
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, QueryTypeException);
    else
        this.stack = (new Error()).stack;
}

QueryTypeException.prototype = Object.create(Error.prototype);
QueryTypeException.prototype.name = "QueryTypeException";
QueryTypeException.prototype.constructor = QueryTypeException;

module.exports = QueryTypeException;