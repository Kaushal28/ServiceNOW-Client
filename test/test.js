const nock = require('nock');
const expect = require('chai').expect;

let snowClient = require('../Client');

describe('Tests of all supported methods', () => {

	describe('Tests of Getting a single record', () => {

		it('Gets a single record in JSON with 200 status', (done) => {

			nock('http://venXXXXX.service-now.com')
				.get('/api/now/table/test_table/test_sys_id')
				  .reply(200, {'test_response_key': 'test_response_value'});
	
			snowClient = new snowClient('http://venXXXXX.service-now.com', 'user', 'pass', 'application/json', 'application/json');	  
	
			snowClient.getSingleRecord('test_table', 'test_sys_id', (response) => {
				expect(typeof response).to.be.a('string');
				expect(JSON.parse(response).test_response_key).to.equal('test_response_value');
				done();
			});
		  });
		  
		it('Gets a single record in JSON with other than 200 status', (done) => {
	
			nock('http://venXXXXX.service-now.com')
				.get('/api/now/table/test_table/test_sys_id')
				  .reply(500, 'Internal Server Error');
	
			snowClient = require('../Client');
			snowClient = new snowClient('http://venXXXXX.service-now.com', 'user', 'pass', 'application/json', 'application/json');	  
	
			snowClient.getSingleRecord('test_table', 'test_sys_id', (response) => {
				expect(typeof response).to.be.a('string');
				expect(response).to.equal('Error While performing specified operation on http://venXXXXX.service-now.com. Error: Internal Server Error');
				done();
			});
		});
		  
		it('Gets a single record with null response', (done) => {
	
			nock('http://venXXXXX.service-now.com')
				.get('/api/now/table/test_table/test_sys_id')
				  .reply(200, null);
	
			snowClient = require('../Client');
			snowClient = new snowClient('http://venXXXXX.service-now.com', 'user', 'pass', 'application/json', 'application/json');	  
	
			snowClient.getSingleRecord('test_table', 'test_sys_id', (response) => {
				expect(typeof response).to.be.a('string');
				expect(response).to.equal('Error While performing specified operation on http://venXXXXX.service-now.com. Retrieved empty response');
				done();
			});
		});

	});
	
});