'use strict'

function QueryEmptyException(message) {
    this.message = message;
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, QueryEmptyException);
    else
        this.stack = (new Error()).stack;
}

QueryEmptyException.prototype = Object.create(Error.prototype);
QueryEmptyException.prototype.name = "QueryEmptyException";
QueryEmptyException.prototype.constructor = QueryEmptyException;

module.exports = QueryEmptyException;