jQuery(function() {
	var $ = jQuery;




	var filterable_grid = function(element){
		var filterable_grid = this;
		var gridid = element.id;
		var filters = [];

		var init_filters = function(){
			// Get the current selected filter from the hash parameter
			var activetab = getHashParameters()[gridid+"_f"];

			// Loop through the filters at the top and store their details in the filters variable
			$(element).find('ul.grid-filter>li>a').each(function(i,filterlink){
				filters.push({
					linkelement : filterlink,
					name : $(filterlink).text(),
					selected : $(filterlink).text() == activetab ? true : false
				});
				$(filterlink).on('click',handle_filterlink_click);
			});

			// If none of the filters was chosen as selected, mark the first as selected as a default.
			if ( filters.filter(function(f){return f.selected}).length == 0 ) {
				filters[0].selected = true;
			}

		};

		var handle_filterlink_click = function(e){
			e.stopPropagation();

			$.each(filters,function(i,filter){
				filter.selected = $(e.target).text() == filter.name ? true : false;
			});

			filterable_grid.update();
		};

		filterable_grid.update = function(){
			$.each(filters,function(i,filter){
				if ( filter.selected ) {
					$(filter.linkelement).attr('aria-selected',true);
					$(filter.linkelement).addClass('grid-filter-selected');
				} else {
					$(filter.linkelement).removeAttr('aria-selected');
					$(filter.linkelement).removeClass('grid-filter-selected');
				}
			});
		};


		init_filters();
		filterable_grid.update();
		return filterable_grid;
	};











	$('.grid-container').each(function(i,grid){
		if ( $(grid).find('ul.grid-filter').length ) {
			new filterable_grid(grid);
		}
	});

});
