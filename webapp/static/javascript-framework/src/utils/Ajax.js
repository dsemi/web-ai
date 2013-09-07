define('lib.utils.Ajax', {

	init : function(parameters) {
		for ( var param in parameters) {
			this[param] = parameters[param];
		}

		this._state = -1;
	},

	// ============== Default values ==========================
	method : 'POST',

	url : '',

	onSuccess : function(response, status) {
		console.log('Connection SUCCESS: ' + status);
	},

	onFail : function(response, status) {
		console.log('Connection FAIL: ' + status);
	},
	// =======================================================

	/**
	 * Gets the ready state of the current request. Triggers success or fail
	 * event.
	 * 
	 * @return The ready state status code (1 - 4). Returns -1 if there is no
	 *         current connection.
	 */
	getState : function() {
		return this._state;
	},

	/**
	 * Opens a new request and sends it to an endpoint.
	 * 
	 * @param {Object}
	 *            data The data to be sent to the server.
	 */
	send : function(data) {
		var self = this;
		var request = this._getRequest();

		request.onreadystatechange = function() {
			self._state = request.readyState;

			if (request.readyState === 4) {
				if (request.status === 200) {
					self.onSuccess(request.response, request.status);
				} else {
					self.onFail(request.response, request.status);
				}

				self._state = -1;
			}
		};

		request.open(this.method, this.url);
		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('Accept', 'application/json');
		request.send(JSON.stringify(data));

		return request;
	},

	_getRequest : function() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else {
			try {
				return new ActiveXObject("MSXML2.XMLHTTP.3.0");
			} catch (ex) {
				return null;
			}
		}
	}
});
