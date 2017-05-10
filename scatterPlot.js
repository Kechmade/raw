(function(){

	var points = raw.models.points();
	


	var chart = raw.chart()
		.title('Scatter Plot')
		.description(
            "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
		.thumbnail("imgs/scatterPlot.png")
	    .category('Dispersion')
		.model(points)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		//.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(1000)

	var maxRadius = chart.number()
		.title("max radius")
		.defaultValue(20)

	var useZero = chart.checkbox()
		.title("set origin at (0,0)")
		.defaultValue(true)

	var colors = chart.color()
		 .title("Color scale")

	var showPoints = chart.checkbox()
		.title("show points")
		.defaultValue(true)

	chart.draw(function (selection, data){

		// Retrieving dimensions from model
		var x = points.dimensions().get('x'),
			y = points.dimensions().get('y');

		var g = selection
			.attr("width", +width() )
			.attr("height", +height() )
			.append("g")

		var marginLeft = 50 +  d3.max([maxRadius(),(d3.max(data, function (d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9)]),
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero()? d3.extent(data, function (d){ return d.x; }) : [-d3.max(data, function (d){ return d.x; }), d3.max(data, function (d){ return d.x; })],
			yExtent = !useZero()? d3.extent(data, function (d){ return d.y; }) : [-d3.max(data, function (d){ return d.y; }), d3.max(data, function (d){ return d.y; })];

		var xScale = x.type() == "Date"
				? d3.time.scale().range([120,width()-120-maxRadius()]).domain(xExtent)
				: d3.scale.linear().range([120,width()-maxRadius()-120]).domain(xExtent),
			yScale = y.type() == "Date"
				? d3.time.scale().range([h - 105- marginLeft - maxRadius(), 200]).domain(yExtent)
				: d3.scale.linear().range([h- 105 -marginLeft - maxRadius() , 200 ]).domain(yExtent),
			sizeScale = d3.scale.linear().range([1, Math.pow(+maxRadius(),2)*Math.PI]).domain([0, d3.max(data, function (d){ return d.size; })]),
			xAxis = d3.svg.axis().scale(xScale);
    		yAxis = d3.svg.axis().scale(yScale).orient("left");
						
		
        g.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "5px")
        	//.style("font-size","9px")
        	.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()/2) + ")")
            
            .call(xAxis).selectAll("text").remove();

      	g.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "5px")
           // .style("font-size","9px")
			.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + (width()/2) + "," + 0 + ")")
            
            .call(yAxis).selectAll("text").remove();

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
         	.style("shape-rendering","crispEdges")
         	.style("fill","none")
         	.style("stroke","#ccc")
         	
         	
         

		var circle = g.selectAll("g.circle")
			.data(data)
			.enter().append("g")
			.attr("class","circle")
			
	    var rect = g.selectAll("g.rect")
	    	.data(data)
	    	.enter().append("g")
	    	.attr("class","rect")

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class","point")

		colors.domain(data, function(d){ return d.color; });

    	circle.append("circle")
            .style("fill", function(d) { return colors() ? colors()(d.color) : "#eeeeee"; })
            .style("fill-opacity", .9)
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    	    .attr("r", function (d){ return Math.sqrt(sizeScale(d.size)/Math.PI); });

    	point.append("circle")
            .filter(function(){ return showPoints(); })
            .style("fill", "#000")
            .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
            .attr("r", 1);

    	circle.append("text")
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    		.attr("text-anchor", "middle")
    		.style("font-size","20px")
    		.attr("dy", 15)
    		.style("font-family","Arial, Helvetica")
    	  	.text(function (d){ return d.label? d.label.join(", ") : ""; });
    	
    	
    	
    		
    	  	



		g.append('line')
					.attr('x1',100)
					.attr('y1',  height()/2)
					.attr('x2', width()-100)
					.attr('y2',  height()/2)
					.style("shape-rendering","crispEdges")
					.attr('stroke', "DarkGrey ")
					.attr('stroke-width', 10);
		
		g.append('line')
					.attr('x1',width()/2)
					.attr('y1', 100 )
					.attr('x2', width()/2)
					.attr('y2', height()-100 )
					.style("shape-rendering","crispEdges")
					.attr('stroke', "DarkGrey ")
					
					.attr('stroke-width', 10); 

    		g.append("rect")
					.attr('width', 80)
			   	    .attr('height', height()/3)
			   	    .attr('x',  3)
			   	    .attr('y', height()/3 )
			   	    .style('fill',"#F5FFFA")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5');
		   
		  
	// coins à transformer		   	    
		g.append("rect")
					.attr('width', 200)
			   	    .attr('height',  60)
			   	    .attr('x', 80)
			   	    .attr('y', 80)
			   	    .style('fill',"		#FFF5EE")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5');
			   	    
			  	    
		g.append("rect")
					.attr('width', 200 )
			   	    .attr('height',60)
			   	    .attr('x',  80)
			   	    .attr('y', height()-160)
			   	    .style('fill',"	#FFF5EE")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5');
			   	    
			   	    
	   g.append("rect")
					.attr('width', 200)
			   	    .attr('height',  60)
			   	    .attr('x',  width()-280)
			   	    .attr('y', 80 )
			   	    .style('fill',"		#FFF5EE")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5');
			   	    
			  	    
		g.append("rect")
					.attr('width', 200 )
			   	    .attr('height',60)
			   	    .attr('x',   width()-280)
			   	    .attr('y', height()-160)
			   	    .style('fill',"	#FFF5EE")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5');
			   	    
			g.append("rect")
					.attr('width', width()/3)
			   	    .attr('height',  80)
			   	    .attr('x',  width()/3)
			   	    .attr('y', height()-83 )
			   	    .style('fill',"#F5FFFA")
			   	    .style('stroke','DarkGrey')
			   	    .style('stroke-width','5'); 
			   	    
			   	    var dataw = [
  						 { 'x' :   3, 'y': height()/3, "label" : "hada1" },
  						 {'x': 80, 'y' : 80,  "label" : "hada2" },
  						 {'x': 80, 'y' : height()-160 , "label" : "hada3" },
						 {'x' : width()-280, 'y' : 80,  "label" : "hada4" },
  					 	 {'x' :  width()-280,'y' :  height()-160, "label" : "hada5" },
  				 		 {'x' : width()/3, 'y' :  height()-83, "label" : "hada6" } ];
 		
 		var text = chart.selectAll("text")
                       .data(dataw)
                        .enter()
                        .append("text");
                        
        var textLabels = text
                .attr("x", function(d) { return d.x; })
				.attr("y", function(d) { return d.y; })
                .text( function (d) { return  label; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");
    	
    	rect.append("text")
    		.attr("text-anchor","middle")
    		.style("font-size","20px")
    		.text(function (d){ return dataw.label? dataw.label.join(", ") : ""; });
		

	})

})();