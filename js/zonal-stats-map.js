'use strict';

require(["esri/Color",
        "dojo/string",
        "dijit/registry",
        "esri/config",
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/graphic",
        "esri/tasks/Geoprocessor",
        "esri/tasks/FeatureSet",
        "esri/toolbars/draw",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/dijit/Search",
        "dojo/parser"
    ], function(Color, string, registry, esriConfig, Map, ArcGISDynamicMapServiceLayer, Graphic, Geoprocessor,
                FeatureSet, Draw, SimpleLineSymbol, SimpleFillSymbol, ArcGISTiledMapServiceLayer, Search, parser) {
    let map, gp, toolbar;
    try {
        // parse esri widgets now since we are loading maps dynamically, not on page load.
        parser.parse();
    } catch(error) {
        console.error('Error parsing esri widgets, ', error);
    }

    document.getElementById('drawPoly').addEventListener('click', () => {
        toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
        map.hideZoomSlider();
    });

    /*Initialize map, GP & image params*/
    map = new Map("zonal-stats-container", {
        basemap: "dark-gray",
        center: [-95.25, 29.6122],
        zoom: 8
    });

    // setting the search widget
    let search = registry.byId('zonal-stats-search') ||  new Search({
        map: map
    }, "zonal-stats-search");

    map.on("load", initTools);

    let depth = new ArcGISTiledMapServiceLayer("https://tiles.arcgis.com/tiles/ndDNvaa60TpdO5bQ/arcgis/rest/services/Houston_Interpolated_Flood_Depths/MapServer");
    depth.setOpacity(0.5);
    map.addLayer(depth);

    let populationMap = new ArcGISDynamicMapServiceLayer("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer");
    populationMap.setOpacity(0);
    map.addLayer(populationMap);

    //identify proxy page to use if the toJson payload to the geoprocessing service is greater than 2000 characters.
    //If this null or not available the gp.execute operation will not work.  Otherwise it will do a http post to the proxy.
    esriConfig.defaults.io.proxyUrl = "/proxy/";
    esriConfig.defaults.io.alwaysUseProxy = false;

    function initTools(evtObj) {
        gp = new Geoprocessor("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer/PopulationSummary");
        gp.setOutputSpatialReference({wkid:102100});
        gp.on("execute-complete", displayResults);

        toolbar = new Draw(evtObj.map);
        toolbar.on("draw-end", computeZonalStats);
    }

    function computeZonalStats(evtObj) {
        let spinnerIcon = document.querySelector('i.fa.fa-spinner.fa-spin');
        spinnerIcon.classList.add('show');
        console.log('show processing to user');
        let geometry = evtObj.geometry;
        /*After user draws shape on map using the draw toolbar compute the zonal*/
        map.showZoomSlider();
        map.graphics.clear();

        let symbol = new SimpleFillSymbol("none", new SimpleLineSymbol("dashdot", new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
        let graphic = new Graphic(geometry,symbol);

        map.graphics.add(graphic);
        toolbar.deactivate();

        let features= [];
        features.push(graphic);

        let featureSet = new FeatureSet();
        featureSet.features = features;

        let params = { "inputPoly":featureSet };
        gp.execute(params);
    }

    function displayResults(evtObj) {
        let spinnerIcon = document.querySelector('i.fa.fa-spinner.fa-spin');
        spinnerIcon.classList.remove('show');
        let results = evtObj.results;
        let content = string.substitute("<h4>The population in the user defined polygon is ${number:dojo.number.format}.</h4>",{number:results[0].value.features[0].attributes.SUM});
        registry.byId("dialog1").setContent(content);
        registry.byId("dialog1").show();
    }

    window.addEventListener('destroy-arc-gis-widgets', () => {
        if (registry.byId('drawPoly')) registry.byId('drawPoly').destroy();
        if (registry.byId('dialog1')) registry.byId('dialog1').destroy();
        map.destroy();
        search.destroy();
    });
});


