(function() {

	var Element = include('lib.ui.Element');
	var DataItem = include('lib.ui.data.DataItem');

	define('lib.ui.data.DataList', {
		extend : Element,

		init : function(data) {
			this.callSuper('ul', {
				className : 'dataList'
			});

			if (data === undefined) {
				data = [];
			}

			this.setData(data);
		},

		addItem : function(data) {
			this.data.push(data);

			var dataItem = new DataItem(data);
			this.appendChild(new DataItem(data));

			dataItem.setListener(this._itemListener);
		},

		getData : function() {
			return this.data;
		},

		getItem : function(index) {
			return this.data[index];
		},

		removeItem : function(index) {
			this.data.splice(index, 1);
			this.removeChild(this.getChildren()[index]);
		},

		setData : function(data) {
			this.data = [];

			for ( var i = 0; i < data.length; i++) {
				this.addItem(data[i]);
			}
		},

		setItem : function(index, data) {
			this.data[index] = data;
			this.getChildren()[index].setData(data);
		},

		setItemListener : function(listener) {
			this._itemListener = listener;

			var children = this.getChildren();

			for ( var i = 0; i < children.length; i++) {
				children[i].setListener(listener);
			}
		}
	});

})();
