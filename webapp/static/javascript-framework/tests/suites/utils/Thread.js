(function() {
    var Thread = include('lib.utils.Thread');

    describe('lib.utils.Thread', function() {

        var thread;
        beforeEach(function() {
            thread = new Thread({
                test : function() {
                    return null;
                },

                addFive : function(value) {
                    return value + 5;
                }
            });
        });

        describe('When creating a thread from an object of commands', function() {

            it('a registered callback function should get called when complete', function() {
                var complete = false;

                runs(function() {
                    thread.on('test', function() {
                        complete = true;
                    });

                    thread.run('test');
                });

                waitsFor(function() {
                    return complete;
                }, 'thread callback to be executed', 200);

                runs(function() {
                    expect(complete).toBeTruthy();
                });
            });

            it('all registered callback functions should get called when complete', function() {
                var complete = false;
                var result = '';

                runs(function() {
                    thread.on('test', function() {
                        result += '1';
                    });

                    thread.on('test', function() {
                        result += '2';
                    });

                    thread.on('test', function() {
                        result += '3';
                        complete = true;
                    });

                    thread.run('test');
                });

                waitsFor(function() {
                    return complete;
                }, 'thread callback to be executed', 200);

                runs(function() {
                    expect(result).toBe('123');
                });
            });

            it('should execute the code in the commands when run', function() {
                var result, complete = false;

                runs(function() {
                    thread.on('addFive', function(response) {
                        complete = true;
                        result = response;
                    });

                    thread.run('addFive', 8);
                });

                waitsFor(function() {
                    return complete;
                }, 'thread callback to be executed', 200);

                runs(function() {
                    expect(result).toBe(13);
                });
            });
        });

    });
})();
