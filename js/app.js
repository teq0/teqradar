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
            //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
            //    .html(tooltipText);
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
            });

    };
};


(function() {

    var dataRepo = function() {
        function getRadarData() {
            // TODO - read from somewhere
            var data = {
                items: [
                    {
                        name: 'ASP.NET MVC',
                        status: 'Adopt',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'ReactJS',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'Angular 2.0',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'Go',
                        status: 'Trial',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'JSON API',
                        status: 'Assess',
                        category: 'Languages and Frameworks'
                    },
                    {
                        name: 'ASP.NET Web forms',
                        status: 'Avoid',
                        category: 'Languages and Frameworks'
                    }
                ]
            };

            return data;
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
                'Avoid',
                'Assess',
                'Trial',
                'Adopt'
            ],
            quadrants: [
                'Languages and frameworks',
                'Tools',
                'Techniques',
                'Platforms'
            ],
            currentQuadrant: 0
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
})();

function Radar(dataRepo, displayManager) {

    var dRepo = dataRepo();
    var dMgr = displayManager();
    var radians = {
        PI: Math.PI,
        PI_ON_2: Math.PI/2,
        PI_ON_4: Math.PI/4,
        THREE_PI_ON_2: 3 * Math.PI/2,
        PI_ON_32: Math.PI/32
    };

    function displayRadar() {

        var radarRoot = dMgr.getRadarElement();
        var cfg = dMgr.getRadarConfig();
        var width = cfg.width - cfg.xMargin;
        var height = cfg.height - cfg.yMargin;
        var maxRadius = Math.sqrt((width*width) + (height*height));
        var ringWidth = maxRadius/(cfg.statuses.length + 2);
        var rings = [];

        var svg = radarRoot.append("svg")
            .attr("width", cfg.width)
            .attr("height", cfg.height);

        var g = svg.append("g")
            .attr("transform", "translate(" + cfg.width + "," + cfg.height + ")");

        for (var idxStatus = 0, ringRadius = 1; idxStatus < cfg.statuses.length; idxStatus++, ringRadius += ringWidth) {
            rings.push({
                innerRadius: ringRadius,
                outerRadius: ringRadius + ringWidth  - 1,
                avgRadius: ringRadius + (ringWidth/2),
                name: cfg.statuses[idxStatus],
                itemCount: 0,
                totalItems: 0
            });
        }

        var data = dRepo.getRadarData();

        _.forEach(data.items, function(item, idx) {
            item.idx = idx;

            var ring = _.find(rings, { name: item.status});

            if (ring) {
                item.ring = ring;
                ring.totalItems++;
            }
        });

        var circles = svg.selectAll("path")
                .data(data.items)
            .enter()
                .append("path")
                .attr("transform", function(d) {
                    var theta = d.ring.itemCount++ * radians.PI_ON_32;
                    var x = cfg.width - (d.ring.avgRadius * Math.cos(theta)) - cfg.xMargin;
                    var y = cfg.height - (d.ring.avgRadius * Math.sin(theta)) - cfg.yMargin;

                    return "translate(" + x + "," + y + ")";
                })
                .attr("class", "radarItem")
                .attr("d", d3.svg.symbol().type('triangle-up'))
                .attr('size', 200)
                .call(d3.helper.tooltip(
                    function(d, i){
                        return "<b>Name: " +d.name + "</b><br/>Status: "+ d.status;
                    }
                ));

        for (var idxRing = 0; idxRing < rings.length; idxRing++) {
            var ring = rings[idxRing];

            var arc = d3.svg.arc()
                .innerRadius(ring.innerRadius)
                .outerRadius(ring.outerRadius)
                .startAngle(radians.THREE_PI_ON_2)
                .endAngle(2 * Math.PI);

            g.append("path")
                .attr("class", "arc")
                .attr("d", arc);
        }
    }

    return {
        displayRadar: displayRadar
    };
}


