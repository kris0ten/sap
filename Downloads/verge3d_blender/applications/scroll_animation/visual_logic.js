/**
 * Generated by Verge3D Puzzles v.3.8.1
 * Sun Oct 03 2021 10:33:37 GMT+0300 (Moscow Standard Time)
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

// initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = false;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = true;
_initGlob.output.initOptions.useFullscreen = false;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["map_range"] = map_range;

var PROC = {
    "map_range": map_range,
};

var page_scrolling, input_range_start, input_range_end, result_range_start, result_range_end, input_value, result_range, output_value, scroll_amount;


// bloom puzzle
function bloom(threshold, strength, radius) {
    appInstance.enablePostprocessing([{
        type: 'bloom',
        threshold: threshold,
        strength: strength,
        radius: radius
    }]);
}



// disableRendering puzzle
function disableRendering(enableSSAA) {
    appInstance.ssaaOnPause = enableSSAA;
    appInstance.disableRendering(1);
}



// enableRendering puzzle
function enableRendering() {
    appInstance.enableRendering();
}



// everyFrame puzzle
function registerEveryFrame(callback) {
    if (typeof callback == 'function') {
        appInstance.renderCallbacks.push(callback);
        if (v3d.PL.editorRenderCallbacks)
            v3d.PL.editorRenderCallbacks.push([appInstance, callback]);
    }
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



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}


// Describe this function...
function map_range(input_range_start, input_range_end, result_range_start, result_range_end, input_value) {
  result_range = (input_range_end - input_range_start) / (result_range_end - result_range_start);
  output_value = (input_value - input_range_start) / result_range + result_range_start;
  return output_value;
}


// getHTMLElemAttribute puzzle
function getHTMLElemAttribute(attr, id, isParent) {
    var elem = getElement(id, isParent);
    return elem ? elem[attr]: '';
}




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



function matGetColors(matName) {
    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat)
        return [];

    if (mat.isMeshNodeMaterial)
        return Object.keys(mat.nodeRGBMap);
    else if (mat.isMeshStandardMaterial)
        return ['color', 'emissive'];
    else
        return [];
}



// setMaterialColor puzzle
function setMaterialColor(matName, colName, r, g, b, cssCode) {

    var colors = matGetColors(matName);

    if (colors.indexOf(colName) < 0)
        return;

    if (cssCode) {
        var color = new v3d.Color(cssCode);
        color.convertSRGBToLinear();
        r = color.r;
        g = color.g;
        b = color.b;
    }

    var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
            var rgbIdx = mat.nodeRGBMap[colName];
            mat.nodeRGB[rgbIdx].x = r;
            mat.nodeRGB[rgbIdx].y = g;
            mat.nodeRGB[rgbIdx].z = b;
        } else {
            mat[colName].r = r;
            mat[colName].g = g;
            mat[colName].b = b;
        }
        mat.needsUpdate = true;

        if (appInstance.scene !== null) {
            if (mat === appInstance.scene.worldMaterial) {
                appInstance.updateEnvironment(mat);
            }
        }
    }
}



// removeTimer puzzle
function registerRemoveTimer(id) {
    if (id in _pGlob.intervalTimers) {
        window.clearInterval(_pGlob.intervalTimers[id]);
    }
}



// setTimer puzzle
function registerSetTimer(id, timeout, callback, repeat) {

    if (id in _pGlob.intervalTimers) {
        window.clearInterval(_pGlob.intervalTimers[id]);
    }

    _pGlob.intervalTimers[id] = window.setInterval(function() {
        if (repeat-- > 0) {
            callback(_pGlob.intervalTimers[id]);
        }
    }, 1000 * timeout);
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



bloom(3.5, 0.4, 0);

page_scrolling = false;

registerEveryFrame(function() {
  if (page_scrolling == false) {
    disableRendering(true);
  } else {
    enableRendering();
  }
});

setHTMLElemStyle('minHeight', '4350px', ['BODY'], false);
setHTMLElemStyle('display', 'block', 'txt_container', false);

eventHTMLElem('scroll', ['WINDOW'], false, function(event) {
  page_scrolling = true;
  scroll_amount = getHTMLElemAttribute('scrollY', ['WINDOW'], false);
  if (scroll_amount <= 1000) {

    operateAnimation('SET_FRAME', getAnimations(['GROUP', 'animated_parts']), map_range(0, 1000, 0, 50, scroll_amount), null, 'AUTO', 1,
            function() {}, undefined, false);

        } else if (scroll_amount > 1000 && scroll_amount <= 2000) {

    operateAnimation('SET_FRAME', getAnimations(['GROUP', 'animated_parts']), Math.abs(map_range(1000, 2000, 0, 50, scroll_amount) - 50), null, 'AUTO', 1,
            function() {}, undefined, false);

        }
  if (scroll_amount > 1500 && scroll_amount <= 3000) {

    operateAnimation('SET_FRAME', 'Camera_static', map_range(1500, 3000, 0, 100, scroll_amount), null, 'AUTO', 1,
            function() {}, undefined, false);

        }
  if (scroll_amount > 2000 && scroll_amount <= 2415) {
    setMaterialColor('cover_custom', 'first_color', map_range(2000, 2415, 0, 0.100481, scroll_amount), map_range(2000, 2415, 0.033105, 0, scroll_amount), map_range(2000, 2415, 0.174647, 0.046665, scroll_amount), '');
    setMaterialColor('cover_custom', 'second_color', map_range(2000, 2415, 0.048172, 0.491905, scroll_amount), map_range(2000, 2415, 0.14996, 0.043454, scroll_amount), map_range(2000, 2415, 0.391572, 0.105052, scroll_amount), '');
  } else if (scroll_amount > 2830 && scroll_amount <= 3250) {
    setMaterialColor('cover_custom', 'first_color', map_range(2830, 3250, 0.100481, 0.036379, scroll_amount), map_range(2830, 3250, 0, 0.100445, scroll_amount), map_range(2830, 3250, 0.046665, 0, scroll_amount), '');
    setMaterialColor('cover_custom', 'second_color', map_range(2830, 3250, 0.491905, 0.289759, scroll_amount), map_range(2830, 3250, 0.043454, 0.491905, scroll_amount), map_range(2830, 3250, 0.105052, 0.076963, scroll_amount), '');
  }
  registerRemoveTimer('myTimer');
  registerSetTimer('myTimer', 0.1, function() {
    page_scrolling = false;
  }, 1);
});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
