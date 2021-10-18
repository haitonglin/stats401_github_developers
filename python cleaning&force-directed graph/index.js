// var dataArray = [2, 13, 15];
// var svg = d3.select("body")
//             .append("svg")
//             .attr('height','100%')
//             .attr('width', '100%');
//
// svg.selectAll('rect')
//     .data(dataArray)
//     .enter()
//     .append('rect')
//     .attr('fill','blue')
//     .attr('height', function(d,i){return (d*10);})
//     .attr('width', '75')
//     .attr('x', function(d,i){return 80*i;})
//     .attr('y', function(d,i){return (350-d*10);});
//
// var fixedX = 600;
// svg.selectAll('circle.groupa')
//    .data(dataArray)
//    .enter().append('circle')
//       .attr('class','groupa')
//       .attr('cx',function(d,i){fixedX += d*4 + i*50; return fixedX;})
//       .attr('cy', '150')
//       .attr('r',function(d,i){return d*5});
//
// var fixedX = 1000;
// svg.selectAll('circle.groupb')
//     .data(dataArray)
//     .enter().append('circle')
//     .attr('class','groupb')
//     .attr('cx',function(d,i){fixedX += d*4 + i*50; return fixedX;})
//     .attr('cy', '150')
//     .attr('r',function(d,i){return d*3});
//
// var fixedX = 10;
// svg.selectAll('ellipse')
//    .data(dataArray)
//    .enter().append('ellipse')
//    .attr('cx',function(d,i){fixedX += d*4+30*i; return fixedX;})
//    .attr('cy','500')
//    .attr('rx',function(d){return d*2})
//    .attr('ry','20');
//
// var dataArray2 = [2, 13, 15, 24, 50, 18, 44];
// var fixedX = 100;
// svg.selectAll('line')
//    .data(dataArray2)
//    .enter().append('line')
//    .attr('stroke','yellowgreen')
//    .attr('stroke-width', '3')
//    //.style('stroke','blue')
//    .attr('x1', fixedX)
//    .attr('y1', function(d,i){return (400+i*50);})
//    .attr('x2', function(d){return fixedX+d*10;})
//    .attr('y2', function(d,i){return (400+i*50);});
//
// svg.append('text')
//       .attr('x', 800)
//       .attr('y', 300)
//       .text('trying to add text')
//       .attr('font-size', 50)
//
//       svg.append('text')
//          .attr('x', 800)
//          .attr('y', 400)
//          .text('One')
//          .attr('font-size', 50)
//          .attr('text-anchor', 'start')
//          .style("fill", "black")
//          .style("stroke", "red")
//          .attr('dominant-baseline', 'middle')
//
//       svg.append('text')
//          .attr('x', 800)
//          .attr('y', 450)
//          .text('Two')
//          .attr('font-size', 50)
//          .attr('text-anchor', 'middle')
//          .style("fill", "green")
//          .style("stroke", "green")
//          .attr('dominant-baseline', 'middle')
//
//       svg.append('text')
//          .attr('x', 800)
//          .attr('y', 500)
//          .text('Three')
//          .attr('font-size', 50)
//          .attr('text-anchor', 'end')
//          .style("fill", "green")
//          .style("stroke", "orange")
//          .attr('dominant-baseline', 'middle')
//
//          var dataArray = [{ x: 4, y: 10 }, { x: 7, y: 2 }, { x: 9, y: 3 }, { x: 12, y: 9 }, { x: 17, y: 6 }, { x: 20, y: 20 },]
//
//          var svg = d3.select('body')
//              .append('svg')
//              .attr('height', '100%')
//              .attr('width', '100%')
//
//          var line = d3.line()
//              .x(function (d, i) { return d.x * 5 })
//              .y(function (d, i) { return d.y * 20 })
//              .curve(d3.curveStep);
//
//          svg.append('path')
//              .attr('d', line(dataArray))
//              .attr('fill', 'none')
//              .attr('stroke', 'brown');


             (function() {
               var globe = planetaryjs.planet();
               // Load our custom `autorotate` plugin; see below.
               globe.loadPlugin(autorotate(10));
               // The `earth` plugin draws the oceans and the land; it's actually
               // a combination of several separate built-in plugins.
               //
               // Note that we're loading a special TopoJSON file
               // (world-110m-withlakes.json) so we can render lakes.
               globe.loadPlugin(planetaryjs.plugins.earth({
                 topojson: { file:   '/world-110m-withlakes.json' },
                 oceans:   { fill:   '#000080' },
                 land:     { fill:   '#339966' },
                 borders:  { stroke: '#008000' }
               }));
               // Load our custom `lakes` plugin to draw lakes; see below.
               globe.loadPlugin(lakes({
                 fill: '#000080'
               }));
               // The `pings` plugin draws animated pings on the globe.
               globe.loadPlugin(planetaryjs.plugins.pings());
               // The `zoom` and `drag` plugins enable
               // manipulating the globe with the mouse.
               globe.loadPlugin(planetaryjs.plugins.zoom({
                 scaleExtent: [100, 300]
               }));
               globe.loadPlugin(planetaryjs.plugins.drag({
                 // Dragging the globe should pause the
                 // automatic rotation until we release the mouse.
                 onDragStart: function() {
                   this.plugins.autorotate.pause();
                 },
                 onDragEnd: function() {
                   this.plugins.autorotate.resume();
                 }
               }));
               // Set up the globe's initial scale, offset, and rotation.
               globe.projection.scale(175).translate([175, 175]).rotate([0, -10, 0]);

               // Every few hundred milliseconds, we'll draw another random ping.
               var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
               setInterval(function() {
                 var lat = Math.random() * 170 - 85;
                 var lng = Math.random() * 360 - 180;
                 var color = colors[Math.floor(Math.random() * colors.length)];
                 globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: Math.random() * 10 });
               }, 150);

               var canvas = document.getElementById('rotatingGlobe');
               // Special code to handle high-density displays (e.g. retina, some phones)
               // In the future, Planetary.js will handle this by itself (or via a plugin).
               if (window.devicePixelRatio == 2) {
                 canvas.width = 800;
                 canvas.height = 800;
                 context = canvas.getContext('2d');
                 context.scale(2, 2);
               }
               // Draw that globe!
               globe.draw(canvas);

               // This plugin will automatically rotate the globe around its vertical
               // axis a configured number of degrees every second.
               function autorotate(degPerSec) {
                 // Planetary.js plugins are functions that take a `planet` instance
                 // as an argument...
                 return function(planet) {
                   var lastTick = null;
                   var paused = false;
                   planet.plugins.autorotate = {
                     pause:  function() { paused = true;  },
                     resume: function() { paused = false; }
                   };
                   // ...and configure hooks into certain pieces of its lifecycle.
                   planet.onDraw(function() {
                     if (paused || !lastTick) {
                       lastTick = new Date();
                     } else {
                       var now = new Date();
                       var delta = now - lastTick;
                       // This plugin uses the built-in projection (provided by D3)
                       // to rotate the globe each time we draw it.
                       var rotation = planet.projection.rotate();
                       rotation[0] += degPerSec * delta / 1000;
                       if (rotation[0] >= 180) rotation[0] -= 360;
                       planet.projection.rotate(rotation);
                       lastTick = now;
                     }
                   });
                 };
               };

               // This plugin takes lake data from the special
               // TopoJSON we're loading and draws them on the map.
               function lakes(options) {
                 options = options || {};
                 var lakes = null;

                 return function(planet) {
                   planet.onInit(function() {
                     // We can access the data loaded from the TopoJSON plugin
                     // on its namespace on `planet.plugins`. We're loading a custom
                     // TopoJSON file with an object called "ne_110m_lakes".
                     var world = planet.plugins.topojson.world;
                     lakes = topojson.feature(world, world.objects.ne_110m_lakes);
                   });

                   planet.onDraw(function() {
                     planet.withSavedContext(function(context) {
                       context.beginPath();
                       planet.path.context(context)(lakes);
                       context.fillStyle = options.fill || 'black';
                       context.fill();
                     });
                   });
                 };
               };
             })();
