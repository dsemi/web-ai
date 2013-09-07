(function() {
    var Container = include('lib.ui.containers.Container');
    var Element = include('lib.ui.Element');
    var Thread = include('lib.utils.Thread');

    define('synpro.ThreadView', {
        extend : Container,

        init : function() {
            this.callSuper();

            this.add(new Element('h1', {
                innerHTML : 'Component: Thread'
            }), new Element('span', {
                innerHTML : 'This page tests the Thread component.  Check the log to see if it works.'
            }));

            var thread = new Thread({
                echo : function(text) {
                    return text;
                },
                
                toUpper : function(text) {
                    return text.toUpperCase();
                }
            });

            thread.on('echo', function(response) {
                console.log(response);
            });

            thread.on('toUpper', function(response) {
                console.log(response);
            });

            thread.run('echo', 'Threads are working!');
            thread.run('toUpper', 'this was all in lower case');
        }
    });
})();
