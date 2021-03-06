// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Highlight the specie that is hovered
const filters = ['followers0-100','followers100-500','followers500-1000','followers1000-2000','followers2000']
// Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
    .domain(filters)
    .range([ "#f79256", "#fbd1a2","#7dcfb6", "#00b2ca","#1d4e89"])

function filter_data(grp){
        let selected_follower_range = filters[grp];

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2");
        // hide all mean lines
        d3.selectAll(".mean-line")
            .transition().duration(200)
            .style("opacity", "0");
        // Second the hovered specie takes its color
        d3.selectAll(`.${selected_follower_range}`)
            .transition().duration(200)
            .style("stroke", color(selected_follower_range))
            .style("opacity", 1);
}

function show_mean() {
    // hide all lines
    d3.selectAll(".line")
        .transition().duration(200)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2");
    // show only means
    d3.selectAll('.mean-line')
        .transition().duration(200)
        .style("opacity", 1);
}

// Unhighlight
var doNotHighlight = function(d) {
    d3.selectAll(".line")
        .transition().duration(200).delay(100)
        .style("stroke", function(d){ return( color(d.follower_range))} )
        .style("opacity", 0.5)
    d3.selectAll(".mean-line")
        .transition().duration(200).delay(100)
        .style("opacity", 0);
}

// Parse the Data
d3.csv("parallel_data.csv", function(data) {
  // console.log(data);

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["following_n", "commit_n", "public_repos", "public_gists"]
  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) {return +d[name]; })) // --> different axis range for each group
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.follower_range } ) // 2 class for each line: 'line' and the group name
      .attr("d", path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.follower_range))} )
      .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

    d3.csv("means.csv", function(mean_data) {
        svg
            .selectAll("mean_path")
            .data(mean_data)
            .enter()
            .append("path")
            .attr("class", function (d) { return `mean-line ${d.follower_range}` })
            .attr("d", (d) => {
                return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            })
            .style("fill", "none" )
            .style("stroke", function(d) { return color(d.follower_range)} )
            .style("stroke-width", 5)
            .style("opacity", 0)
    });
})