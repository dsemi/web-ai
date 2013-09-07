(function() {
	var Container = include('lib.ui.containers.Container');
	var Plot = include('lib.ui.data.ScatterPlot');

	define('synpro.PlotView', {
		extend : Container,

		init : function() {
			this.callSuper();

			window.plot = new Plot(0, -1, 10, 1);
			
			plot.enableTicks(true, 20);

			plot.addFunction(function(x) {
				return Math.sin(x);
			});
			
			plot.resize(400, 400);

			this.addListener('show', function() {
				plot.draw();
			});
			
			this.add(plot);
		},
	});
})();
