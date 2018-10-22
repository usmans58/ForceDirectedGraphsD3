var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");



var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("attraceForce",d3.forceManyBody().strength(-100));

var opacity = 0.25;

d3.json("data.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links) 
    .enter().append("line")
    .attr("group",function(d) {return d.group; })
    	    .on("click", function(d) {
	    	// This is to toggle visibility - need to do it on the nodes and links
	    	d3.selectAll("line:not([group='"+d.group+"'])")
	    	.style("opacity", function() {
	    		currentDisplay = d3.select(this).style("opacity");
	    		currentDisplay = currentDisplay == "1" ? "0.1" : "1";
	    		return currentDisplay;
	    	});
	    	d3.selectAll("circle:not([nodeGroup='"+d.group+"'])")
	    	.style("opacity",function() {
	    		currentDisplay = d3.select(this).style("opacity");
	    		currentDisplay = currentDisplay == "1" ? "0.1" : "1";
	    		return currentDisplay;
	    	});
	    	d3.selectAll("text:not([nodeGroup='"+d.group+"'])")
	    	.style("opacity",function() {
	    		currentDisplay = d3.select(this).style("opacity");
	    		currentDisplay = currentDisplay == "1" ? "0.1" : "1";
	    		return currentDisplay;
	    	});
    })
    .on("mouseover", function(d) {
	    		d3.select(this).style("cursor", "crosshair"); 
	})
	.on("mouseout", function(d) {
	    		d3.select(this).style("cursor", "default"); 
	})
    .attr("stroke-width", function(d) { return d.value; })
    ;

  var node = svg.append("g")
     .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 20)
    .attr("fill", "#fff")
    .style("stroke-width", 2)
    .style("stroke", function(d) { return color(d.group); })
    .attr("nodeGroup",function(d) {return d.nodeGroup;} )
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
          
	// This is the label for each node
	var text = svg.append("g").selectAll("text")
		.data(graph.nodes)
		.enter().append("text")
		.attr("dx",12)
		.attr("dy",".35m")
		.text(function(d) { return d.id;})
		.attr("text-anchor", "middle")
	  .attr("nodeGroup",function(d) {return d.nodeGroup;} )	;
		
  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);
      
  function neighboring(a, b) {

		return graph.links.some(function(d) {
		    return (d.source.id === a.source.id && d.target.id === b.target.id)
		        || (d.source.id === b.source.id && d.target.id === a.target.id);
		  });
	}

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    text
	     .attr("x", function(d) { return d.x; })
	     .attr("y", function(d) { return d.y; });
  }
});



function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

