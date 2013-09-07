(function() {

	// ==================== Initialization =============================
	
	// Creates show and hide methods in the element
	Element.prototype.show = function() {
		this.style.display = '';
	};
	
	Element.prototype.hide = function() {
		this.style.display = 'none';
	};

	// Creates a cross platform add and remove listener interface.
	window.on = document.on = Element.prototype.on = function(type, callback, propagate) {
		var addListener = 'addEventListener';

		if (!this[addListener]) {
			addListener = 'attachEvent';
			type = 'on' + type;
		}

		this[addListener](type, callback, propagate);
	};

	window.un = document.un = Element.prototype.un = function(type, callback, propagate) {
		var addListener = 'removeEventListener';

		if (!this[addListener]) {
			addListener = 'detachEvent';
			type = 'on' + type;
		}

		this[addListener](type, callback, propagate);
	};

	window.on('load', function() {
		App.importStyle(App._namespaces['lib']._home.concat('styles/styles.css'));

		App._defineAll();
		if (App.onready) {
			App.onready();
		}
	});

	// ===================================================================

	/**
	 * Creates global a namespace object with the specified name and path to the
	 * root directory.
	 *
	 * @param {String}
	 *            namespace The name of the global namespace.
	 * @param {Object}
	 *            home The root directory in which the source files are found.
	 * @author Kenny Ruddick
	 */
	this.using = function(namespace, home) {
		var ns = App._namespaces[namespace];

		if (ns === undefined) {
			ns = App._namespaces[namespace] = {};
			ns.getHome = function() {
				return this._home;
			};
			this[namespace] = ns;
		}

		ns._home = home;
	};
	/**
	 * Adds the given "class" to its global namespace container if currently
	 * undefined. Imports the script file defined by its namespace's home
	 * directory and its full qualifying name. <br />
	 * <br />
	 * Example: include('namespace.test.Foo') imports (ns home
	 * directory)/test/Foo.js
	 *
	 * @param {Object}
	 *            fullName The full qualifying name of the "class" which must
	 *            reflect file path structure.
	 * @return The constructor function of the included "classs"
	 */
	this.include = function(fullName) {
		var clazz;

		if (App._constructorExists(fullName)) {
			clazz = App._getClass(fullName);
		} else {
			clazz = App._createClass(fullName);
			App._importClass(fullName);
		}

		return clazz;
	};

	/**
	 * Loads a class definition into its global namespace object. Actual
	 * definition is deferred until all dependencies have been loaded in order
	 * to ensure proper inheritance.
	 *
	 * @param {Object}
	 *            fullName The full qualifying name of the "class"
	 * @param {Object}
	 *            members An object containing the member definitions of this
	 *            "class".
	 */
	this.define = function(fullName, members) {
		App._definitionQueue.push({
			className : fullName,
			members : members,
			attempts : 0
		});
	};

	/**
	 * A global object that is used as a starting point and general preferences
	 * of a web application. Specify the <code>App.onready</code> function to
	 * have a starting point when all "classes" have been loaded and defined.
	 */
	this.App = {
		addListener : function(type, listener, useCapture) {
			// Uses the compatible function to add a listener.
			var addListener = 'addEventListener';
			if (document[addListener] === undefined) {
				addListener = 'attachEvent';
				type = 'on' + type;
			}

			// Events with compatibility issues
			if (type === 'mousewheel') {
				// IE9, Chrome, Safari, Opera
				document[addListener](type, listener, useCapture);
				// Firefox
				document[addListener]('DOMMouseScroll', listener, useCapture);
			}
			// No Compatibility issue
			else {
				document[addListener](type, listener, useCapture);
			}
		},

		/**
		 * Gets the current container of this app if it exists. Returns
		 * <code>undefined</code> otherwise.
		 *
		 * @return This app's container
		 */
		getContainer : function() {
			return App.container;
		},

		/**
		 * Interprets the parameters in the query string and returns them in an
		 * object.
		 *
		 * @return An object containing the parameters.
		 */
		getParams : function() {
			var paramString, result, params;

			paramString = window.location.search.substring(1, window.location.length);
			params = paramString.split('&');
			result = {};

			if (params[0] === '')
				return {};

			var pair;

			for (var i = 0; i < params.length; i++) {
				pair = params[i].split('=');
				result[pair[0]] = pair[1];
			}

			return result;
		},

		importStyle : function(filePath) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = filePath;

			document.getElementsByTagName('head')[0].appendChild(link);
		},

		/**
		 * Sets the Apps container to the one specified and adds its elements to
		 * the DOM.
		 *
		 * @param {Object}
		 *            container <code>Container</code> object that holds the
		 *            UI elements of the App
		 */
		setContainer : function(container) {
			App.container = container;
			document.body.appendChild(container.element);
		},

		/**
		 * Sets the Apps navigator to the one specified and adds its elements to
		 * the DOM.
		 *
		 * @param {Object}
		 *            navigator <code>Navigator</code> object that holds the
		 *            UI elements of the App
		 */
		setNavigator : function(navigator) {
			this.navigator = navigator;
			App.setContainer(navigator);
		},

		/**
		 * Sets the title of the app. Appends a <code>title</code> element if
		 * one does not exist. Otherwise the value of the title is just
		 * overwritten.
		 *
		 * @param {Object}
		 *            title
		 */
		setTitle : function(title) {
			if (App._title === undefined) {
				var titles = document.getElementsByTagName('title');

				App._title = (titles.length > 0) ? titles[0] : (function() {
					var title = document.createElement('title');
					document.getElementsByTagName('head')[0].appendChild(title);
					return title;
				})();
			}

			App._title.text = title;
		},

		onready : null,

		maxAttempts : 5,

		_namespaces : {},

		_definitionQueue : [],

		// Iterates through all the definition stack and applies the members to
		// the
		// prototypes if the "class" has not been defined. If defining fails due
		// to dependency issues,
		// then the definition will be put at the end of the queue to be tried
		// again.
		_defineAll : function() {
			var clazz, def, success;

			while (App._definitionQueue.length > 0) {
				def = App._definitionQueue.shift();

				clazz = App._getClass(def.className);

				if (App._classIsUndefined(clazz)) {
					success = App._define(clazz, def);

					if (def.attempts > App.maxAttempts) {
						throw new Error('Unable to retrieve ' + def.className);
					}

					if (!success) {
						App._definitionQueue.push(def);
					}
				}
			}
		},

		// Applies inheritance to a class as well as all members to the
		// prototype.
		_define : function(clazz, definition) {
			var success = true;

			// Attempts to define object. Will fail when dependencies not
			// loaded.
			try {
				App._applyInheritance(clazz, definition.members.extend);
				App._applyMembers(definition.className, clazz, definition.members);

				var init = definition.members.init;
				clazz.init = init ? init : Function();
			} catch (error) {
				success = false;
				definition.attempts++;
			}

			return success;
		},

		// Returns whether the bare construtor of this class has yet been
		// defined.
		_constructorExists : function(className) {
			var currentNode, nodes, exists;
			nodes = className.split('.');
			currentNode = App._namespaces[nodes[0]];
			exists = true;

			var i = 1;
			do {
				if (currentNode[nodes[i]] !== undefined) {
					currentNode = currentNode[nodes[i]];
					i++;
				} else {
					exists = false;
				}

			} while (i < nodes.length && exists);

			return exists;
		},

		// Determines whether the prototype of this object has been defined
		_classIsUndefined : function(clazz) {
			var length = 0;
			if (Object.keys) {
				length = Object.keys(clazz).length;
			} else {
				for (var prop in clazz) {
					if (clazz.hasOwnProperty(prop))
						length++;
				}
			}

			return length === 0;
		},

		// Returns the constructor of the defined class
		_getClass : function(className) {
			var currentNode, nodes;
			nodes = className.split('.');
			currentNode = App._namespaces[nodes[0]];

			for (var i = 1; i < nodes.length; i++) {
				currentNode = currentNode[nodes[i]];
			}

			return currentNode;
		},

		// Creates the bare constructor of a class and the namespace path if its
		// not defined.
		// Does not actually appliy the members to the class.
		_createClass : function(fullName) {
			var currentNode, nodes;
			nodes = fullName.split('.');
			currentNode = App._namespaces[nodes[0]];

			for (var i = 1; i < nodes.length - 1; i++) {
				if (currentNode[nodes[i]] === undefined) {
					currentNode[nodes[i]] = {};
				}

				currentNode = currentNode[nodes[i]];
			}

			var classConstructor = function() {
				classConstructor.init.apply(this, arguments);
			};

			return currentNode[nodes[nodes.length - 1]] = classConstructor;
		},

		// Copies the properties of the prototype of the parent to the child.
		_applyInheritance : function(child, parentName) {
			if (parentName !== undefined) {
				var parent = ( typeof parentName === 'string') ? App._getClass(parentName) : parentName;

				if (App._classIsUndefined(parent)) {
					throw 'Parent class is undefined';
				}

				child.prototype.callSuper = function() {
					var init = this.callSuper.init;
					this.callSuper = init.prototype.callSuper;
					init.apply(this, arguments);
				};
				child.prototype.callSuper.init = parent;

				var value;
				for (var key in parent.prototype) {
					value = parent.prototype[key];

					if (key !== 'callSuper') {
						child.prototype[key] = value;
					}
				}
			}
		},

		// Applies the members of a class to its prototype.
		_applyMembers : function(className, clazz, members) {
			var value;
			for (var member in members) {
				value = members[member];

				if (member !== 'init' && member !== 'extend') {
					clazz.prototype[member] = value;
				}

				clazz.prototype.className = className;
			}
		},

		// Imports the script file of the given class and appends it to the body
		// of the DOM.
		_importClass : function(classPath) {
			var home, namespace, filePath, script;

			namespace = classPath.split('.')[0];
			home = App._namespaces[namespace]._home;

			filePath = home.concat(classPath.replace(namespace + '.', '').replace(/[.]/g, '/'), '.js');

			script = document.createElement('script');
			script.setAttribute('src', filePath);

			document.body.appendChild(script);
		}
	};
})();
