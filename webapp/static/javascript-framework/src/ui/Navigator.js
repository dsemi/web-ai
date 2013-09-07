(function() {

    var Container = include('lib.ui.containers.Container');

    define('lib.ui.Navigator', {
        extend : Container,

        init : function(home) {
            this.callSuper();
            this.routes = {};

            var contents = this.contents = new Container();
            contents.addClass('content');
            this.add(contents);

            this._clearHash();
        },

        _clearHash : function() {
            window.location.hash = '';
        },

        addRoute : function(address, containerClass) {
            var navi = this;

            window.addEventListener('hashchange', function() {
                if (window.location.hash === '#' + address) {

                    // Removes the old container
                    if (navi.currentRoute !== undefined) {
                        // navi.container.remove(navi.currentRoute);
                        navi.currentRoute.hide();
                    }

                    // Creates the new container if it does not exist.
                    if (navi.routes[address] === undefined) {
                        navi.routes[address] = new containerClass();

                        navi.contents.add(navi.routes[address]);
                    }

                    navi.currentRoute = navi.routes[address];
                    navi.routeName = address;
                    // navi.container.add(navi.currentRoute);
                    navi.currentRoute.show();
                }
            });
        },

        back : function() {
            history.back();
        },

        goTo : function(location) {
            window.location.hash = location;
        },

        getCurrentRoute : function() {
            return this.currentRoute;
        }
    });

})();
