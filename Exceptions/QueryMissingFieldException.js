'use strict'

function QueryMissingFieldException(message) {
    this.message = message;
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, QueryMissingFieldException);
    else
        this.stack = (new Error()).stack;
}

QueryMissingFieldException.prototype = Object.create(Error.prototype);
QueryMissingFieldException.prototype.name = "QueryMissingFieldException";
QueryMissingFieldException.prototype.constructor = QueryMissingFieldException;

module.exports = QueryMissingFieldException;