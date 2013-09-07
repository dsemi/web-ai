(function() {

    var Container = include('lib.ui.containers.Container');

    define('lib.ui.containers.TiledPanel', {
        extend : Container,

        init : function(numberAcross) {
            this.callSuper();

            this._numberAcross = numberAcross;
            this._numTiles = 0;
            this._tiles = [];
        },

        add : function() {
            var tile, tiles;
            tiles = this._tiles;

            for (var i = 0; i < arguments.length; i++) {
                tile = arguments[i];
                tile.addClass('tile');
                tile.setAttribute('role', 'tile');
                tile.position = this._numTiles;
                this._setListener(tile, this._listener);

                if (this._numTiles++ % this._numberAcross === 0) {
                    this.appendChild('br');
                }

                tiles.push(tile);
                Container.prototype.add.call(this, tile);
            }
        },
        
        getTile : function(row, col) {
            return this._tiles[row * 3 + col];
        },

        getTiles : function() {
            return this._tiles;
        },

        setClickListener : function(listener) {
            this._tileListener = listener;

            var children = this.getChildren();

            for (var i = 0; i < children.length; i++) {

                if (children[i].getAttribute('role') === 'tile') {
                    this._setListener(children[i], listener);
                }
            }
        },

        _setListener : function(tile, listener) {
            tile.element.onclick = function() {
                if (listener) {
                    listener(tile);
                }
            };
        }
    });

})();
