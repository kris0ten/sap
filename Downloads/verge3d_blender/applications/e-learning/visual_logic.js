/**
 * Generated by Verge3D Puzzles v.3.8.3
 * Tue Oct 26 2021 16:40:26 GMT+0300 (Moscow Standard Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




function findScormAPI(win) {
    var findScormAPITries = 0;

    while (win.API == null && win.parent != null && win.parent != win) {
        findScormAPITries++;

        if (findScormAPITries > 7) {
            console.error('findScormAPI: Error finding API - too deeply nested.');
            return null;
        }

        win = win.parent;
    }

    return (win.API || null);
}

function findScormAPIOpener(win) {
    if (win.opener != null && typeof(win.opener) != 'undefined')
        return findScormAPI(win.opener);
    else
        return null;
}

function getScormAPI() {
    // start by looking for the API in the current window
    var theAPI = findScormAPI(window);

    // check for opener
    if (theAPI == null)
        theAPI = findScormAPIOpener(window);

    // check for parent opener
    if (theAPI == null && window.parent != null && window.parent != window)
        theAPI = findScormAPIOpener(window.parent);

    // if the API has not been found
    if (theAPI == null)
        console.error('getScormAPI: Unable to find an API adapter');

    return theAPI;
}

var scormAPI = getScormAPI();



PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};


    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["STEP"] = STEP;

var PROC = {
    "STEP": STEP,
};

var current_step, FROM, TO, MSG, HIGHLIGHT;



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// getAnimations puzzle
function getAnimations(objSelector) {
    var objNames = retrieveObjectNames(objSelector);

    var animations = [];
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        // use objName as animName - for now we have one-to-one match
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, objName);
        if (action)
            animations.push(objName);
    }
    return animations;
}



/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}



/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && "v3d" in scene.userData && "animFrameRate" in scene.userData.v3d) {
        return scene.userData.v3d.animFrameRate;
    }
    return 24;
}



_pGlob.animMixerCallbacks = [];

var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished))
            appInstance.mixer.addEventListener('finished', onMixerFinished);
    };

}();



// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, isPlayAnimCompat, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                // compatibility reasons: deprecated playAnimation puzzles don't
                // change repetitions
                if (!isPlayAnimCompat) {
                    action.repetitions = Infinity;
                }

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}



// outline puzzle
function outline(objSelector, doWhat) {
    var objNames = retrieveObjectNames(objSelector);

    if (!appInstance.postprocessing || !appInstance.postprocessing.outlinePass)
        return;
    var outlineArray = appInstance.postprocessing.outlinePass.selectedObjects;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        if (doWhat == "ENABLE") {
            if (outlineArray.indexOf(obj) == -1)
                outlineArray.push(obj);
        } else {
            var index = outlineArray.indexOf(obj);
            if (index > -1)
                outlineArray.splice(index, 1);
        }
    }
}



// updateTextObject puzzle
function updateTextObj(objSelector, text) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;
        var obj = getObjectByName(objName);
        if (!obj || !obj.geometry || !obj.geometry.cloneWithText)
            continue;
        obj.geometry = obj.geometry.cloneWithText(String(text));
    }
}



function dataModelElements() {
    return (function(element) {
        return element;
    }).apply(null, arguments);
}



function LMSSetValue() {
    return (function(element, value) {
        // LMSSetValue puzzle
	if (scormAPI !== null)
            scormAPI.LMSSetValue(element, value);
    }).apply(null, arguments);
}



function LMSCommit() {
    return (function() {
        // LMSCommit puzzle
	if (scormAPI !== null)
            return scormAPI.LMSCommit('');
    }).apply(null, arguments);
}


// This procedure proceeds between learning steps from->to.
function STEP(FROM, TO, MSG, HIGHLIGHT) {
  if (current_step == FROM) {

    operateAnimation('STOP', getAnimations(['GROUP', 'all parts']), null, null, 'AUTO', 1,
            function() {}, undefined, false);

        outline(['GROUP', 'all parts'], 'DISABLE');

    operateAnimation('PLAY', 'Armature', FROM, TO, 'AUTO', 1,
            function() {
      updateTextObj('Text', MSG);

      operateAnimation('PLAY', getAnimations(HIGHLIGHT), null, null, 'AUTO', 1,
              function() {}, true, false);

          outline(HIGHLIGHT, 'ENABLE');
      current_step = TO;
      LMSSetValue(dataModelElements('cmi.core.score.raw'), String((TO / 380) * 100));if (current_step == 380) {
        LMSSetValue(dataModelElements('cmi.core.lesson_status'), 'passed');}
      LMSCommit();}, true, false);

        }
}


// show and hide puzzles
function changeVis(objSelector, bool) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
    }
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



function LMSInitialize() {
    return (function() {
        // LMSInitialize puzzle
	if (scormAPI !== null)
            return scormAPI.LMSInitialize('');
    }).apply(null, arguments);
}



function LMSFinish() {
    return (function() {
        // LMSFinish puzzle
	if (scormAPI !== null)
            return scormAPI.LMSFinish('');
    }).apply(null, arguments);
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, eventType, callback]);
    }
}



function LMSGetValue() {
    return (function(element) {
        // LMSGetValue puzzle
	if (scormAPI !== null)
            return scormAPI.LMSGetValue(element);
        else
            return '';
    }).apply(null, arguments);
}



current_step = 0;

registerOnClick('startup_example', false, false, [0,1,2], function() {
  changeVis('startup_example', false);
  changeVis('textbox_top', false);
  changeVis('Text_caption1', false);
  changeVis('Text_caption2', false);
  changeVis(['GROUP', 'all parts'], true);
  STEP(0, 5, 'Step 1: Unfold the carton and square it off.', ['GROUP', 'all parts']);
}, function() {});
registerOnClick(['GROUP', 'all parts'], false, false, [0,1,2], function() {
  STEP(5, 40, 'Step 2: Fold top flaps and turn the carton upside down.', ['GROUP', 'top flaps']);
}, function() {});
registerOnClick(['GROUP', 'top flaps'], false, false, [0,1,2], function() {
  STEP(40, 140, 'Step 3: Fold bottom flap down into inside of carton.', 'bottom opposite');
}, function() {});
registerOnClick('bottom opposite', false, false, [0,1,2], function() {
  STEP(140, 160, 'Step 4: Fold side flaps to fold everything over flush with bottom of the carton.', ['GROUP', 'bottom side flaps']);
}, function() {});
registerOnClick(['GROUP', 'bottom side flaps'], false, false, [0,1,2], function() {
  STEP(160, 220, 'Step 5: Turn carton right side up and lay flat on bottom.', ['GROUP', 'all parts']);
}, function() {});
registerOnClick(['GROUP', 'all parts'], false, false, [0,1,2], function() {
  STEP(220, 280, 'Step 6: After carton is turned right-side-up, fold both flaps up and against side of carton.', ['GROUP', 'bottom flaps']);
}, function() {});
registerOnClick(['GROUP', 'bottom flaps'], false, false, [0,1,2], function() {
  STEP(280, 320, 'Step 7: Fold bottom flap and then both side flaps down.', ['GROUP', 'bottom top flaps']);
}, function() {});
registerOnClick(['GROUP', 'bottom top flaps'], false, false, [0,1,2], function() {
  STEP(320, 360, 'Step 8: Push hand holes on both sides of carton inward to lock through hand holes.', ['GROUP', 'handles']);
}, function() {});
registerOnClick(['GROUP', 'handles'], false, false, [0,1,2], function() {
  STEP(360, 380, 'Your box is ready!', null);
}, function() {});

LMSInitialize();eventHTMLElem('beforeunload', ['WINDOW'], false, function(event) {
  LMSFinish();});
if (LMSGetValue(dataModelElements('cmi.core.lesson_status')) == 'not attempted') {
  LMSSetValue(dataModelElements('cmi.core.lesson_status'), 'incomplete');}



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
