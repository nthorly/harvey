'use strict';

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/dijit/PopupTemplate",
    "esri/dijit/Legend",
    "dojo/domReady!"
    
], function(Map, FeatureLayer, PopupTemplate, Legend
) {

    let map = new Map("photo-cluster-map-container", {
        basemap: "dark-gray-vector",
        center: [-96.44109, 29.6122],
        zoom: 7
    });

    // Enable clustering in the layer's constructor
    // and add the layer to the map
    let serviceUrl = "https://services8.arcgis.com/6o5BPp2zyzqM2NMp/ArcGIS/rest/services/Harvey_Pics/FeatureServer/0";
    let layer = new FeatureLayer(serviceUrl, {
        outFields: [ "DateTime" ],
        featureReduction: {
            type: "cluster"
        },
        infoTemplate: new PopupTemplate({
            title: "{facname}",
            description: "{DateTime}"
        })
    });
    map.addLayer(layer);

    let legend;
    map.on("load", function(){
        legend = new Legend({
            map: map,
            layerInfos: [{
                layer: layer,
                title: "Hurricane Pictures"
            }]
        }, "photo-cluster-legend");
        legend.startup();
    });

    let clusteringCheckbox = document.getElementById("use-clustering");
    // toggles clustering on and off in sync with the checkbox
    clusteringCheckbox.addEventListener("click", function(event){
        let checked = event.target.checked;
        toggleFeatureReduction(checked);
    });

    function toggleFeatureReduction(yes){
        if(yes){
            if(!layer.getFeatureReduction()){
                layer.setFeatureReduction({
                    type: "cluster"
                });
            } else {
                layer.enableFeatureReduction();
            }
        } else {
            layer.disableFeatureReduction();
        }
    }

    window.addEventListener('destroy-arc-gis-widgets', () => {
        legend.destroy();
        map.destroy();
    });
});
