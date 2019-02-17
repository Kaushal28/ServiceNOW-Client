const nock = require('nock');
const expect = require('chai').expect;

let snowClient = require('../Client');

describe('Tests of all supported methods', () => {

	it('Gets a single record', (done) => {

		nock('http://venXXXXX.service-now.com')
			.get('/api/now/table/test_table/test_sys_id')
      		.reply(200, {'a': 'b'});

		snowClient = new snowClient('http://venXXXXX.service-now.com', 'user', 'pass', 'application/json', 'application/json');	  
		
    	snowClient.getSingleRecord('test_table', 'test_sys_id', (response) => {
			expect(typeof response).to.be.a('string');
    		done();
    	});
  	});

});