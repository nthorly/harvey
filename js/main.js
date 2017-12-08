'use strict';

const INJECTED_SCRIPT_ID = 'harvey-map-script';
const MAIN_CONTAINER_ID = 'main-container';
const SELECTED_CLASS = 'selected';
const OPEN_CLASS = 'open';

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.leftnav .nav-button').forEach((navBtn) => {
        if (navBtn.id === 'hurricane-harvey') {
            setTemplate(navBtn.id);
        }

        navBtn.addEventListener('click', (event) => {
            let navButton = event.target;
            if (navButton.classList.contains(SELECTED_CLASS)) return;
            setSelected(navButton);
            setTemplate(navButton.id);
        });
    });
    document.querySelectorAll('.leftnav .nav-button-container .title').forEach((navBtnContainer) => {
        navBtnContainer.addEventListener('click', (event) => {
            console.log('click, ', event.target);
            event.preventDefault();
            let navButtonContainer = event.target;
            if (navButtonContainer.classList.contains(OPEN_CLASS)) return;
            setOpen(navButtonContainer);
        });
    });
});

function setOpen(selectedContainer) {
    selectedContainer.parentElement.parentElement.getElementsByClassName(OPEN_CLASS)[0].classList.remove(OPEN_CLASS);
    selectedContainer.parentElement.classList.add(OPEN_CLASS);
}

function setSelected(selectedButton) {
    selectedButton.parentElement.parentElement.getElementsByClassName(SELECTED_CLASS)[0].classList.remove(SELECTED_CLASS);
    selectedButton.classList.add(SELECTED_CLASS);
}

function getTemplatePathById(id) {
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
        default:
            console.error('No template path found for id, ', id);
    }

    return templateObj;
}

function setTemplate(templateId) {
    // jquery version of a GET request
    // $.get(path).done((template) => {
    //     document.getElementById(MAIN_CONTAINER_ID).innerHTML = httpRequest.responseText;
    // }).fail((error) => {
    // console.error('Template for path, ' + path + ', not found');
    // });

    let templateObj = getTemplatePathById(templateId)
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'views/' + templateObj.template);
    httpRequest.send(null);

    httpRequest.onreadystatechange = () => {
        const DONE = 4; // readyState 4 means the request is done.
        const OK = 200; // status 200 is a successful return.
        if (httpRequest.readyState === DONE) {
            if (httpRequest.status === OK) {
                document.getElementById(MAIN_CONTAINER_ID).innerHTML = httpRequest.responseText;
                injectScript(templateObj.script);
            } else {
                console.error('Template for path, ' + path + ', not found');
            }
        }
    };
}

function injectScript(script) {
    removeHarveyMapScript();
    if (script) {
        let scriptElement = document.createElement('script'); // <script></script>
        scriptElement.id = INJECTED_SCRIPT_ID;
        scriptElement.src = 'js/' + script;
        document.querySelector('head').appendChild(scriptElement);
    }
}

function removeHarveyMapScript() {
    window.dispatchEvent(new Event('destroy-arc-gis-widgets'));
    let harveyScript = document.getElementById(INJECTED_SCRIPT_ID);
    if (harveyScript) harveyScript.remove();
}
