var Ajax = include('lib.utils.Ajax');

describe('lib.utils.Ajax', function() {
	var request, onSuccess, onFail, http;

	beforeEach(function() {
		// XMLHttpRequest mock object
		var send, open, setRequestHeader;
		send = function(data) {
			this.readyState = 4;
			this.status = this.willFail ? 404 : 200;
			this.onreadystatechange();
		};

		open = function(method, url) {
			if (url == 'fail') {
				this.willFail = true;
			}
		};

		header = function(header, value) {
		};

		spyOn(window, 'XMLHttpRequest').andCallFake(function() {
			http = this;
			this.send = send;
			this.open = open;
			this.setRequestHeader = header;
			
			spyOn(http, 'open').andCallThrough();
			spyOn(http, 'send').andCallThrough();
		});

		// Creates the actual AJAX request
		request = new Ajax();
	});
	

	it('a successful request should call onSuccess()', function() {
		spyOn(request, 'onSuccess');

		request.url = 'success';
		request.send();

		expect(request.onSuccess).toHaveBeenCalled();
	});

	it('a failed request should call onFail()', function() {
		spyOn(request, 'onFail');

		request.url = 'fail';
		request.send();

		expect(request.onFail).toHaveBeenCalled();
	});
	
	it('the data should be sent', function() {
		var data = {
			test : 'test',
			array: [1, 2, 3]
		}
		
		request.send(data);
		
		expect(http.send).toHaveBeenCalledWith(JSON.stringify(data));
	});
	
	it('the correct http method should be used', function() {
		request.method = 'GET';
		request.send();
		
		expect(http.open.mostRecentCall.args[0]).toEqual('GET');
	});
});
