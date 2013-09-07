/**
 * A wrapper class for the HTML5 WebWorkers.  Designed to create threads from
 * inline functions rather than separate HTML files.
 * @author Kenny Ruddick
 * Copyright (c) 2013 (MIT License)
 */

(function() {
    define('lib.utils.Thread', {

        /**
         * Creates a new Thread with the given command definitions.
         * @param {Object} commands A list of commands to be executed by the Thread when
         * told to do so.
         */
        init : function(commands) {
            var url, wString = this._createWorkerString(commands);

            // Generates a URL with a Blob if supported.
            if (window.URL) {
                url = window.URL.createObjectURL(new Blob([wString], {
                    type : 'text/javascript'
                }));
            }
            // Falls back to a data URL (Opera).
            else {
                url = 'data:application/javascript,' + encodeURI(wString);
            }

            var worker = this._worker = new Worker(url);

            // Command event handler functionality.
            var commandHandlers = this._commandHandlers = {};

            var handlers, i, length, data;
            worker.onmessage = function(e) {
                data = e.data;
                handlers = commandHandlers[data.command];
                length = handlers.length;

                for ( i = 0; i < length; i++) {
                    handlers[i](data.response);
                }
            }
        },

        /**
         * Specifies a callback function to be called when the Thread completes the given command.
         * Multiple callbacks may be added to the same Thread command.
         * @param {String} command  The command that the Thread completed.
         * @param {Function} callback  A callback function to be called when Thread has finished the command.
         * The callback function takes one parameter, <i>data</i>, that holds any data the Thread is sending back.
         */
        on : function(command, callback) {
            var commandHandlers = this._commandHandlers;

            if (commandHandlers[command]) {
                commandHandlers[command].push(callback);
            } else {
                commandHandlers[command] = [callback];
            }
        },

        /**
         * Runs the specified command on the Thread.  The Thread will not execute this command until all previous
         * commands have been completed.
         * @param {String} command  The name of the command that the Thread is to execute.
         * @param {Function} parameters The data that is to be sent to the Thread for processing.
         */
        run : function(command, parameters) {
            this._worker.postMessage({
                command : command,
                parameters : parameters
            });
        },

        // Concatenates required parts to the worker string.
        _createWorkerString : function(commands) {
            var workerString;

            workerString = 'var _commands={\n';

            // Attaches all listeners
            for (var command in commands) {
                workerString += command + ':' + commands[command].toString() + ',\n';
            }

            workerString += '};\nonmessage=function(event){\nvar data=event.data,command=data.command;' + '\npostMessage({\ncommand: command,\nresponse:_commands[command](data.parameters)});};';

            return workerString;
        }
    });
})();
