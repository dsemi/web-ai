(function() {

    var Element = include('lib.ui.Element');

    define('lib.ui.data.ScatterPlot', {
        extend : Element,

        init : function(xMin, yMin, xMax, yMax, precision) {
            this.callSuper('canvas');
            this.context = this.element.getContext('2d');
            this.context.save();

            this._precision = precision ? precision : 500;
            this._functions = [];
            this._data = [];
            this._colors = [];

            this.addClass('scatterPlot');
            this.enableAxes();
            this.enableCurve();
            this.enablePan();
            this.enablePoints();
            this.enableTicks();
            this.enableZoom();
            this.setDefaultColor('blue');
            this.setLineCap('round');
            this.setLineWidth(2);
            this.setScale(xMin, yMin, xMax, yMax);
            this.setZoom(1.1);

            // Disables Chrome from changing the mouse.
            this.addListener('mousedown', function(e) {
                e.preventDefault();
            });
            this._setupTrace();
        },

        _setupTrace : function() {
            var plot = this;
            this.cursor = {
                x : 0,
                y : 0
            };

            this.addListener('mousemove', function(e) {
                plot.cursor.x = e.clientX - plot.element.getBoundingClientRect().left - plot.element.clientLeft + plot.element.scrollLeft;
                plot.cursor.y = e.clientY - plot.element.getBoundingClientRect().top - plot.element.clientTop + plot.element.scrollTop;
            });
        },

        addFunction : function(funct) {
            this._functions.push(funct);
            this._colors.push(this._defaultColor);
        },

        clear : function() {
            this.context.clearRect(-this.originX, -this.originY, this.element.width, this.element.height);
        },

        draw : function() {
            this.clear();
            this.axesEnabled ? this._drawAxes() : null;
            this.ticksEnabled ? this._drawTicks() : null;
            this.curveEnabled ? this._drawCurve() : null;
            this.pointsEnabled ? this._drawPoints() : null;
        },

        _drawAxes : function() {
            this.context.beginPath();

            // y-axis
            this.context.moveTo(0, -this.originY);
            this.context.lineTo(0, this.element.width - this.originY);

            // x-axis
            this.context.moveTo(-this.originX, 0);
            this.context.lineTo(this.element.width - this.originX, 0);

            this.context.stroke();
        },

        _drawCurve : function() {
            var height = this.getHeight();

            var strokeStyle = this.context.strokeStyle;
            var lineWidth = this.context.lineWidth;
            var lineCap = this.context.lineCap;

            this.context.lineWidth = this._lineWidth;
            this.context.lineCap = this._lineCap;
            
            // Copying values for quicker reference.
            var xmin  = this.xmin;
            var xmax = this.xmax;
            var hScale = this.hScale;
            var vScale = this.vScale;
            var context = this.context;
            var originY = this.originY;
            var doubleHeight = 2 * height;
            
            var x, y;

            for (var func = 0; func < this._functions.length; func++) {
                increment = (xmax - xmin) / this._precision;

                x = xmin;
                y = -this.evaluate(x, func);

                // Sets the curve style for this function.
                context.strokeStyle = this._colors[func];

                //Begins this curve
                context.moveTo(x * hScale, y * vScale);
                context.beginPath();

                for (x += increment; x < xmax; x += increment) {
                    y = -this.evaluate(x, func) * vScale;

                    // Ignores data points that are outside of the window range.
                    if (y + originY  < doubleHeight && y + originY > -height) {
                        context.lineTo(x * hScale, y);
                    } 
                }
                this.context.stroke();
            }
            
            // Resets back to the original line style properties.
            this.context.strokeStyle = strokeStyle;
            this.context.lineWidth = lineWidth;
            this.context.lineCap = lineCap;
        },

        _drawPoints : function() {
            var x, y, dataset, i, j, height;

            height = this.getHeight();

            for ( j = 0; j < this._data.length; j++) {
                dataset = this._data[j];

                for ( i = 0; i < dataset.length - 1; i += 2) {
                    x = dataset[i] * this.hScale;
                    y = -dataset[i + 1] * this.vScale;

                    // Ignores data points that are outside of the window range.
                    if (y + this.originY > height * 2 || y + this.originY < -height) {
                        //this.context.moveTo(x, (y<0?-1:1)*this.element.height)
                    } else {
                        this.context.beginPath();
                        this.context.arc(x, y, this._pointRadius, 0, 2 * Math.PI);
                        this.context.fill();
                    }
                }
            }
        },

        _drawTicks : function() {
            var increment, i, x, y, maxWidth;

            var height = 5;
            var width = 1;

            // Horizontal Axis
            increment = (this.xmax - this.xmin) / this._numTicks * this.hScale;
            maxWidth = increment - 2;

            x = this.xmin * this.hScale;
            y = (this.ymin < 0 && this.ymax > 0) ? -height / 2 : -this.ymin * this.vScale - height;
            i = 0;

            this.context.textAlign = 'center';

            while (x < (this.xmax + 1) * this.hScale) {
                // Tick
                this.context.fillRect(x, y, width, height);

                // Units
                if (i % 2 === 0) {
                    this.context.fillText((x / this.hScale).toPrecision(3), x, y - 2, maxWidth);
                }

                x += increment;
                i++;
            }

            // Vertical Axis
            var numTicks = this._numTicks * this.getHeight() / this.getWidth();
            increment = (this.ymax - this.ymin) / numTicks * this.vScale;

            x = (this.xmin < 0 && this.xmax > 0) ? -height / 2 : this.xmin * this.hScale;
            y = this.ymin * this.vScale;
            i = 0;

            this.context.textBaseline = 'middle';
            this.context.textAlign = 'left';

            while (y < (this.ymax + 1) * this.vScale) {
                // Ticks
                this.context.fillRect(x, -y, height, width);

                // Units
                if (i % 2 === 0 && i !== 0) {
                    this.context.fillText((y / this.vScale).toPrecision(3), x + maxWidth / 2, -y, maxWidth);
                }

                y += increment;
                i++;
            }
        },

        enableAxes : function(enable) {
            this.axesEnabled = (enable === undefined) ? true : enable;
        },

        enableCurve : function(enable) {
            this.curveEnabled = (enable === undefined) ? true : enable;
        },

        enablePan : function(enable) {
            this.panEnabled = (enable === undefined) ? true : enable;

            if (this.panEnabled) {
                var plot = this;

                this._pullListener = function(e) {
                    var deltaX = (e.startX - e.endX) / plot.hScale;
                    var deltaY = (e.endY - e.startY) / plot.vScale;

                    plot.setScale(plot.xmin + deltaX, plot.ymin + deltaY, plot.xmax + deltaX, plot.ymax + deltaY);
                    plot.draw();

                    // Prevents propagation
                    e.stopPropagation();
                    if (window.event) {
                        window.event.cancelBubble = true;
                    }
                };

                this.addListener('drag2', this._pullListener);
            } else {
                this.removeListener('drag2', this._pullListener);
            }
        },

        enablePoints : function(enable, numPoints, radius) {
            this.pointsEnabled = (enable === undefined) ? true : enable;
            this._numPoints = numPoints ? numPoints : 10;
            this._pointRadius = radius ? radius : 5;
        },

        enableTicks : function(enable, numTicks) {
            this.ticksEnabled = (enable === undefined) ? true : enable;
            this._numTicks = numTicks ? numTicks : 10;
        },

        enableZoom : function(enable) {
            this.zoomEnabled = (enable === undefined) ? true : enable;

            if (this.zoomEnabled) {
                var plot = this;

                this._wheelListener = function(e) {
                    plot._zoom(e);
                    e.stopPropagation();
                    e.preventDefault();
                };

                this.addListener('mousewheel', this._wheelListener);
            } else {
                this.removeListener('mousewheel', this._wheelListener);
            }
        },

        _zoom : function(e) {
            // cross-browser wheel delta
            e = window.event || e;
            // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY || -e.detail)));

            var deltaX = -(this.xmax - this.xmin) / 2 * (1 - Math.pow(this.zoom, -delta));
            var deltaY = -(this.ymax - this.ymin) / 2 * (1 - Math.pow(this.zoom, -delta));

            // alert('X: ' + deltaX + '  Y: ' + deltaY);

            var x1, y1, x2, y2;

            x1 = this.xmin - deltaX;
            y1 = this.ymin - deltaY;
            x2 = this.xmax + deltaX;
            y2 = this.ymax + deltaY;

            this.setScale(x1, y1, x2, y2);
            this.draw();
        },

        evaluate : function(x, index) {
            if (index === undefined) {
                index = 0;
            }
            return this._functions[index](x);
        },

        getData : function(index) {
            index = (index === undefined) ? 0 : index;
            return this._data[index];
        },

        getFunction : function(index) {
            index = (index === undefined) ? 0 : index;
            return this._functions[index];
        },

        getTrace : function() {
            return {
                x : (this.cursor.x - this.originX) / this.hScale,
                y : (this.originY - this.cursor.y) / this.vScale
            };
        },

        reset : function() {
            this._data = [];
            this._functions = [];
            this._colors = [];
            this.clear();
        },

        resize : function(width, height) {
            this.element.width = width;
            this.element.height = height;

            this.setScale(this.xmin, this.ymin, this.xmax, this.ymax);
        },

        setData : function(data) {
            if ( typeof data[0] === 'number') {
                this._data = [data];
            } else if ( typeof data[0] === 'object') {
                this._data = data;
            }
        },

        setDefaultColor : function(color) {
            this._defaultColor = color;
        },

        setScale : function(xmin, ymin, xmax, ymax) {
            this.context.restore();
            this.context.save();

            this.hScale = this.element.width / (xmax - xmin);
            this.vScale = this.element.height / (ymax - ymin);

            this.originX = this.element.width * xmin / (xmin - xmax);
            this.originY = this.element.height * (1 - ymin / (ymin - ymax));

            this.xmin = xmin;
            this.xmax = xmax;
            this.ymin = ymin;
            this.ymax = ymax;

            this.context.translate(this.originX, this.originY);
        },

        setLineCap : function(style) {
            this._lineCap = style;
        },

        setLineColor : function(index, color) {
            this._colors[index] = color;
        },

        setLineWidth : function(pixels) {
            this._lineWidth = pixels;
        },

        setZoom : function(zoom) {
            this.zoom = zoom;
        }
    });
})();
