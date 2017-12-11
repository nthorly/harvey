'use strict';

const INJECTED_SCRIPT_ID = 'harvey-map-script';
const MAIN_CONTAINER_ID = 'main-container';
const SELECTED_CLASS = 'selected';
const OPEN_CLASS = 'open';

// when dom content has loaded, run callback
document.addEventListener("DOMContentLoaded", function() {
    //looping through the nav buttons
    document.querySelectorAll('.leftnav .nav-button').forEach((navBtn) => {
        //if the current nav button is 'hurricane-harvey' load that template
        if (navBtn.id === 'hurricane-harvey') {
            setTemplate(navBtn.id);
        }
        //for each nav button add click handler to dynamically change main content
        navBtn.addEventListener('click', (event) => {
            let navButton = event.target;
            //if we click the currently selected nav button, do nothing
            if (navButton.classList.contains(SELECTED_CLASS)) return;
            setSelected(navButton);
            setTemplate(navButton.id);
        });
    });
    //looping through the nav headers
    document.querySelectorAll('.leftnav .nav-button-container .title').forEach((navBtnContainer) => {
        //for each nav header add click handler to expand/collapse the side nav sections
        navBtnContainer.addEventListener('click', (event) => {
            event.preventDefault();
            let navButtonContainer = event.target;
            //if we click the currently opened nav section, do nothing
            if (navButtonContainer.classList.contains(OPEN_CLASS)) return;
            setOpen(navButtonContainer);
        });
    });
});

//function to toggle open nav section
function setOpen(selectedContainer) {
    selectedContainer.parentElement.parentElement.getElementsByClassName(OPEN_CLASS)[0].classList.remove(OPEN_CLASS);
    selectedContainer.parentElement.classList.add(OPEN_CLASS);
}

//function to toggle selected nav button
function setSelected(selectedButton) {
    selectedButton.parentElement.parentElement.getElementsByClassName(SELECTED_CLASS)[0].classList.remove(SELECTED_CLASS);
    selectedButton.classList.add(SELECTED_CLASS);
}

/**
 * returning template/script information for selected nav
 * @param id - id of nav button clicked
 * @returns {{script: *, template: *}} - object containing js and html template information for dynamic content
 */
function getTemplateObjectById(id) {
    // instantiate template object to return
    let templateObj = {
        script: void(0),
        template: void(0)
    };

    switch(id) {
        case 'hurricane-harvey':
            templateObj.template = 'hurricane-harvey.html';
            break;
        case 'about-the-authors':
            templateObj.template = 'about-authors.html';
            break;
        case 'damaged-heatmap':
            templateObj.script = 'damaged-heat-map.js';
            templateObj.template = 'damaged-heatmap.html';
            break;
        case 'photo-cluster':
            templateObj.script = 'photo-clustering-map.js';
            templateObj.template = 'photo-clustering.html';
            break;
        case 'layer-swipe':
            templateObj.script = 'layer-swipe-map.js';
            templateObj.template = 'layer-swipe-map.html';
            break;
        case 'zonal-stats':
            templateObj.script = 'zonal-stats-map.js';
            templateObj.template = 'zonal-stats-map.html';
            break;
        case 'inundation-viewer':
            templateObj.script = 'inundation-viewer.js';
            templateObj.template = 'inundation-viewer.html';
            break;
        case 'sources':
            templateObj.template = 'sources.html';
            break;
        default:
            console.error('No template path found for id, ', id);
    }

    return templateObj;
}

/**
 * a function to retrieve the html templates and inject into main container
 * @param templateId
 */
function setTemplate(templateId) {
    const templateObj = getTemplateObjectById(templateId)
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'views/' + templateObj.template);
    httpRequest.send(null);

    httpRequest.onreadystatechange = () => {
        const DONE = 4; // readyState 4 means the request is done.
        const OK = 200; // status 200 is a successful return.
        if (httpRequest.readyState === DONE) {
            if (httpRequest.status === OK) {
                document.getElementById(MAIN_CONTAINER_ID).innerHTML = httpRequest.responseText;
                injectHarveyMapScript(templateObj.script);
            } else {
                console.error('Template for path, ' + path + ', not found');
            }
        }
    };
}

/**
 * a function to replace the current map script with newly selected nav button map script
 * @param script
 */
function injectHarveyMapScript(script) {
    removeHarveyMapScript();
    if (script) {
        let scriptElement = document.createElement('script'); // <script></script>
        scriptElement.id = INJECTED_SCRIPT_ID;
        scriptElement.src = 'js/' + script;
        document.querySelector('head').appendChild(scriptElement);
    }
}

/**
 * a function to remove the current map script before injecting the new map script
 */
function removeHarveyMapScript() {
    window.dispatchEvent(new Event('destroy-arc-gis-widgets'));
    let harveyScript = document.getElementById(INJECTED_SCRIPT_ID);
    if (harveyScript) harveyScript.remove();
}
