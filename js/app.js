/**
 * D3 helpers
 * @type {{}}
 */
d3.helper = d3.helper || {};

d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.tooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute')
                .style('z-index', 1001);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            // Crop text arbitrarily
            tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
                .html(tooltipText);

            d3.select(d.symbol).classed('selectedItem', true);
            d3.select('svg').classed('mute', true);

        })
            .on('mousemove', function(d, i) {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                    .style('top', (absoluteMousePos[1] - 15)+'px');
                var tooltipText = accessor(d, i) || '';
                tooltipDiv.html(tooltipText);
            })
            .on("mouseout", function(d, i){
                // Remove tooltip
                tooltipDiv.remove();
                d3.select(d.symbol).classed('selectedItem', false);
                d3.select('svg').classed('mute', false);
            });

    };
};

// Lorem ipsum generator
// @author C. Peter Chen of http://dev-notes.com
// @date 20080812
function loremIpsum(elem) {
    var loremIpsumWordBank = new Array("lorem","ipsum","dolor","sit","amet,","consectetur","adipisicing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","enim","ad","minim","veniam,","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat.","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur.","excepteur","sint","occaecat","cupidatat","non","proident,","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum.","sed","ut","perspiciatis,","unde","omnis","iste","natus","error","sit","voluptatem","accusantium","doloremque","laudantium,","totam","rem","aperiam","eaque","ipsa,","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt,","explicabo.","nemo","enim","ipsam","voluptatem,","quia","voluptas","sit,","aspernatur","aut","odit","aut","fugit,","sed","quia","consequuntur","magni","dolores","eos,","qui","ratione","voluptatem","sequi","nesciunt,","neque","porro","quisquam","est,","qui","dolorem","ipsum,","quia","dolor","sit,","amet,","consectetur,","adipisci","velit,","sed","quia","non","numquam","eius","modi","tempora","incidunt,","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem.","ut","enim","ad","minima","veniam,","quis","nostrum","exercitationem","ullam","corporis","suscipit","laboriosam,","nisi","ut","aliquid","ex","ea","commodi","consequatur?","quis","autem","vel","eum","iure","reprehenderit,","qui","in","ea","voluptate","velit","esse,","quam","nihil","molestiae","consequatur,","vel","illum,","qui","dolorem","eum","fugiat,","quo","voluptas","nulla","pariatur?","at","vero","eos","et","accusamus","et","iusto","odio","dignissimos","ducimus,","qui","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti,","quos","dolores","et","quas","molestias","excepturi","sint,","obcaecati","cupiditate","non","provident,","similique","sunt","in","culpa,","qui","officia","deserunt","mollitia","animi,","id","est","laborum","et","dolorum","fuga.","harum","quidem","rerum","facilis","est","et","expedita","distinctio.","Nam","libero","tempore,","cum","soluta","nobis","est","eligendi","optio,","cumque","nihil","impedit,","quo","minus","id,","quod","maxime","placeat,","facere","possimus,","omnis","voluptas","assumenda","est,","omnis","dolor","repellendus.","temporibus","autem","quibusdam","aut","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet,","ut","et","voluptates","repudiandae","sint","molestiae","non","recusandae.","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus,","aut","reiciendis","voluptatibus","maiores","alias","consequatur","aut","perferendis","doloribus","asperiores","repellat");
    var minWordCount = 15;
    var maxWordCount = 100;

    var randy = Math.floor(Math.random()*(maxWordCount - minWordCount)) + minWordCount;
    var ret = "";
    for(i = 0; i < randy; i++) {
        var newTxt = loremIpsumWordBank[Math.floor(Math.random() * (loremIpsumWordBank.length - 1))];
        if (ret.substring(ret.length-1,ret.length) == "." || ret.substring(ret.length-1,ret.length) == "?") {
            newTxt = newTxt.substring(0,1).toUpperCase() + newTxt.substring(1, newTxt.length);
        }
        ret += " " + newTxt;
    }

    return ret;
}

(function($) {

    // pseudo selector for matching exact text

    $.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().trim().match("^" + arg + "$");
        };
    });

    var dataRepo = function() {

        function parseDummyPage() {
            var $macros = $(dummyPage);
            var $details = $macros.find('ac\\:structured-macro[ac\\:name="details"]>ac\\:rich-text-body>table>tbody');

            function findPageProp(key) {
                var val = $details.find('th:textEquals("' + key + '")').next().text();
                return val || '';
            }

            var item = {
                name: findPageProp('Name'),
                status: findPageProp('Status'),
                category: findPageProp('Category'),
                description: findPageProp('Description')
            };

        }

        function genDummyData(minItems, maxItems) {

            minItems = minItems || 35;
            maxItems = maxItems || minItems;
            maxItems = Math.max(minItems, maxItems);

            var numItems = (minItems != maxItems) ? Math.floor(Math.random() * (maxItems - minItems)) + minItems : maxItems;

            var cfg = displayManager().getRadarConfig();
            var data = {
                items: []
            };

            function genValue(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }

            var names = [
                'ASP.NET MVC',
                'JSON API',
                'React JS',
                'Swift',
                'Docker',
                'Ionic',
                'Xamarin',
                'Reverse Conway',
                'Angular 2.0',
                'React Mobile',
                'Golang',
                'Neo4j'
            ];

            numItems = numItems || 35;

            for (var idx = 0; idx < numItems; idx++) {
                var item = {
                    name: genValue(names),
                    status: genValue(cfg.statuses),
                    category: genValue(cfg.quadrants),
                    description: loremIpsum()
                };

                data.items.push(item);
            }

            return data;
        }

        function getRadarData() {

            parseDummyPage();

            // TODO - read data from somewhere
            return genDummyData(18, 30);
        }

        return {
            getRadarData: getRadarData
        };
    };

    var displayManager = function() {

        var radarConfig = {
            width: 500,
            height: 500,
            xMargin: 10,
            yMargin: 10,
            statuses: [
                'Adopt',
                'Trial',
                'Assess',
                'Avoid'
            ],
            quadrants: [
                'Languages and frameworks',
                'Tools',
                'Techniques',
                'Platforms'
            ]
        };

        function getRadarElement() {
            return d3.select('.radarDisplay');
        }

        function getRadarConfig() {
            return radarConfig;
        }

        return {
            getRadarElement: getRadarElement,
            getRadarConfig: getRadarConfig
        }
    };

    function init() {

        var radar = Radar(dataRepo, displayManager);

        radar.displayRadar();
    }

    init();
})($);

function Radar(dataRepo, displayManager) {

    var dRepo = dataRepo();
    var dMgr = displayManager();
    var radians = {
        PI: Math.PI,
        PI_ON_2: Math.PI/2,
        PI_ON_4: Math.PI/4,
        PI_ON_8: Math.PI/8,
        THREE_PI_ON_2: 3 * Math.PI/2,
        PI_ON_16: Math.PI/16
    };

    function displayRadar(category) {

        var radarRoot = dMgr.getRadarElement();
        var cfg = dMgr.getRadarConfig();

        // get the physical size of the canvas
        var svgWidth = cfg.width - cfg.xMargin;
        var svgHeight = cfg.height - cfg.yMargin;
        var rWidth = 1000;
        var rHeight = 1000;

        // get a scale object so we can work normalised to 1000x1000

        var maxRadius = Math.sqrt((rWidth*rWidth) + (rHeight*rHeight));
        var rScale = d3.scale.linear()
            .domain([0, maxRadius])
            .range([0, Math.sqrt(svgWidth*svgHeight)]);

        // one ring per status
        var rings = [];

        var svg = radarRoot.append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var g = svg.append("g")
            .attr("transform", "translate(" + svgWidth + "," + svgHeight + ")");

        // calculate the ring radii
        var innerRadius = 0, outerRadius = 500;

        _.forEach(cfg.statuses, function(status) {

            var ring = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                ringWidth: outerRadius - innerRadius,
                name: status,
                itemCount: 0,
                totalItems: 0
            };

            innerRadius = outerRadius;
            outerRadius += ring.ringWidth / Math.SQRT2;

            rings.push(ring);
        });

        // scale the width of the rings
        var ringScale = d3.scale.linear()
            .domain([0, rings[rings.length - 1].outerRadius])
            .range([0, maxRadius]);

        _.forEach(rings, function(ring, idx) {
            ring.innerRadius = ringScale(ring.innerRadius);
            ring.outerRadius = ringScale(ring.outerRadius);
            ring.ringWidth = ring.outerRadius - ring.innerRadius;
        });

        var data = dRepo.getRadarData();

        var quadrantItems = !!category ? _.filter(data.items, { category: category }) : data.items;

        _.forEach(quadrantItems, function(item, idx) {
            item.idx = idx;

            var ring = _.find(rings, { name: item.status});

            if (ring) {
                item.ring = ring;
                ring.totalItems++;
            }
            else {
                throw "Unknown status: " + item.status;
            }
        });

        _.forEach(rings, function(ring, idx) {
            // get the radial angle between items
            ring.itemTheta = (radians.PI_ON_2 * 0.9) / ring.totalItems;

            // TODO - if itemTheta is too small for the ring's radius things will collide, and we'll need two bands of items
        });

        var symbolSize = 800;
        var circles = svg.selectAll("path")
                .data(quadrantItems)
            .enter()
                .append("path")
                .attr("transform", function(d) {

                    // distribute the items around the diagonal
                    var theta = radians.PI_ON_4 + ((((d.ring.itemCount & 1) << 1) -1) * ((d.ring.itemCount + 1) >> 1) * d.ring.itemTheta) + ((Math.random() - 0.5) * radians.PI_ON_16);
                    d.ring.itemCount++;

                    var radius = d.ring.innerRadius + (d.ring.ringWidth / 2) + (1 + ((Math.random() - 0.5)) * Math.sqrt(d.ring.ringWidth) * 5);

                    d.x = svgWidth - (rScale(radius) * Math.cos(theta)) - cfg.xMargin;
                    d.y = svgHeight - (rScale(radius) * Math.sin(theta)) - cfg.yMargin;

                    return "translate(" + d.x + "," + d.y + ")";
                })
                .attr("class", "radarItem")
                .attr("d", d3.svg.symbol().size(rScale(symbolSize))
                .type('triangle-up'))
                .each(function(d, i) {
                        // I wonder if this causes a circular reference?
                        d.symbol = this;
                });


        //Add the SVG Text Element to the svgContainer
        var text = svg.selectAll("text")
                                .data(data.items)
                                .enter()
                                .append("text");

        var textXOffset = rScale(-4.2);
        var textYOffset = rScale(13);

        //Add SVG Text Element Attributes
        var textLabels = text
             .attr("x", function(d) { return d.x + (textXOffset * ((d.idx+1).toString().length + 1)); })
             .attr("y", function(d) { return d.y + textYOffset; })
             .text( function (d) { return d.idx + 1; })
             .attr("font-family", "sans-serif")
             .attr("font-size", "8px")
             .attr("fill", "white")
             .attr('text-align', 'center')
            .call(d3.helper.tooltip(
                function(d, i){
                    return "<b>" + (d.idx + 1) +": " + d.name + "</b><br/><em>" + d.status + "</em><br/><br/>" + d.description;
                }
            ));


        for (var idxRing = 0; idxRing < rings.length; idxRing++) {
            var ring = rings[idxRing];

            var arc = d3.svg.arc()
                .innerRadius(rScale(ring.innerRadius))
                .outerRadius(rScale(ring.outerRadius))
                .startAngle(radians.THREE_PI_ON_2)
                .endAngle(2 * Math.PI);

            g.append("path")
                .attr("class", "arc" + idxRing)
                .attr("d", arc);
        }
    }

    return {
        displayRadar: displayRadar
    };
}

