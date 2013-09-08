(function() {
    var ScriptLoader = include('lib.utils.ScriptLoader');

    /**
     *  The AssetManager is a utility for loading and managing external assets
     *  such as images and sounds.  All loading is done asynchronously and execution
     *  relies on callbacks.  After an asset has been loaded once, it can be used as
     *  many times as needed.
     */
    define('ai.viewer.ttt.AssetManager', {

        init : function(onready) {
            this._assets = {};
            this.onready = onready;

            // this._setupSoundManager();
        },

        _setupSoundManager : function() {
            var manager = this;

            var loader = new ScriptLoader(function() {
                soundManager.setup({
                    url : ai.getHome() + '../external/soundManager/swf/',

                    onready : manager.onready ? manager.onready : function() {
                        throw 'AssetManager should be used with an onready callback!'
                    }
                });
            });

            loader.load(ai.getHome() + '../external/soundManager/soundmanager2.js');
        },

        /**
         *  Gets the asset with the given name.
         * @return {Object} The asset with the given name.  If the asset has
         * not started to be loaded, then it will return undefined.
         * If the asset is in progress of being loaded, then it will return the
         * asset, but functionality will not work until it has completed.
         */
        get : function(name) {
            return this._assets[name];
        },

        /**
         *  Loads a single asset.
         * @param {String} name The unique identifier of this asset.
         * @param {String} type The type of asset to load (image or sound).
         * @param {String} url The url that this assset can be retrieved from.
         * @return {Object} asset An asset that has not yet been loaded.
         * Attach an onload to know when loading is complete.
         */
        load : function(name, type, url) {
            if (arguments.length === 1) {
                var arg = arguments[0];
                name = arg.name;
                type = arg.type;
                url = arg.url;
            }
            
            var asset = this._assets[name];

            if (asset === undefined) {
                if (type === 'image') {
                    asset = this._loadImage(name, url);
                } else if (type === 'sound') {
                    asset = this._loadSound(name, url);
                }
            }

            return asset;
        },

        _loadImage : function(name, url) {
            var image = this._assets[name] = new Image();

            image.addEventListener('error', function() {
                throw new Error('Unable to load image ' + name + ' from ' + url);
            });

            image.src = url;

            return image;
        },

        _loadSound : function(name, url) {
            var sound = this._assets[name] = soundManager.createSound({
                id : name,
                url : url,
                onload : function(e) {
                    sound.onload(e);
                }
            });

            soundManager.load(name);

            return sound;
        },

        /**
         * Removes references to all assets so that the garbage collector can
         * delete the memory used by the assets.  This is a temporary solution.
         */
        reset : function() {
            this._assets = [];
            this._loadingQueue = [];
        },
    });
})();
