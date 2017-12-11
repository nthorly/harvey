'use strict';

require([
    "esri/arcgis/utils",
    "esri/dijit/Search",
    "esri/dijit/BasemapGallery",
    "esri/dijit/LayerList",
    "dojo/parser",
    "dijit/registry",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
], function(arcgisUtils, Search, BasemapGallery, LayerList, parser, registry) {
    //Create a map based on ArcGIS Online web map id
    arcgisUtils.createMap("c5cbe0ae28684e799f0937f7fdbcac9b", "innundation-map").then(function(response) {
        try {
            // Parse esri widgets now, not on load since we are loading maps dynamically.
            parser.parse();
        } catch(error) {
            console.error('Error parsing esri widgets, ', error);
        }

        //Initializes Search widget
        let search = new Search({
            map: response.map
        }, "search");
        search.startup();

        //Initializes Basemap Gallery widget
        let basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: response.map
        }, "basemapGallery");
        basemapGallery.startup();

        //Initializes LayerList widget reading layers linked from web map
        let layerWidget = new LayerList({
            map: response.map,
            layers: arcgisUtils.getLayerList(response)
        },"layerList");
        layerWidget.startup();

        window.addEventListener('destroy-arc-gis-widgets', () => {
            if (registry.byId('layerListPane')) registry.byId('layerListPane').destroy();
            if (registry.byId('innundation-map')) registry.byId('innundation-map').destroy();
            basemapGallery.destroy();
            search.destroy();
        });
    });
});
