(function() {
	var Container = include('lib.ui.containers.Container');
	var Element = include('lib.ui.Element');
	var Tiles = include('lib.ui.containers.TiledPanel');
	var HTMLContainer = include('lib.ui.containers.HTMLContainer');
	
	define('synpro.HomeView', {
		extend : Tiles,
		
		init : function() {
			this.callSuper();
			
			this.add(new Element('a', {
				href : '#scatterplot',
				innerHTML : 'ScatterPlot'
			}));
			
			this.add(new Element('a', {
                href : '#ace',
                innerHTML : 'Ace'
            }));
            
            this.add(new Element('a', {
                href : '#thread',
                innerHTML : 'Thread'
            }));
		}
	});
})();
