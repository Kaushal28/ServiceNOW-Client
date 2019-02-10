'use strict'

class Utils {
    setRequestParamsWithoutBody(headers, auth, httpMethod, url){
        return {
            'headers': headers,
            'auth': auth,
            'method': httpMethod,
            'url': url
        };
    }

    setRequestParamsWithBody(headers, auth, body, httpMethod, url){
        return {
            'headers': headers,
            'auth': auth,
            'body': body,
            'method': httpMethod,
            'url': url
        };
    }

    URLBuilder(...args){
        args.splice(1, 0, 'api');
        return args.join('/');
    }
}

module.exports = new Utils();