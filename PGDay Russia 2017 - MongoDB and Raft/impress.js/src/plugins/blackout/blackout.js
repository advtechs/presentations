/**
 * Blackout plugin
 *
 * Press Ctrl+b to hide all slides, and Ctrl+b again to show them.
 * Also navigating to a different slide will show them again (impress:stepleave).
 * 
 * Copyright 2014 @Strikeskids
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';
    
    var canvas = null;
    var blackedOut = false;
    
    // While waiting for a shared library of utilities, copying these 2 from main impress.js
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };

    var pfx = (function () {
        
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
        
        return function ( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {
                
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            
            }
            
            return memory[ prop ];
        };
    
    })();
    


    var removeBlackout = function() {
        if (blackedOut) {
            css(canvas, {
                display: 'block'
            });
            blackedOut = false;
        }
    }

    var blackout = function() {
        if (blackedOut) {
            removeBlackout();
        }
        else {
            css(canvas, {
                display: (blackedOut = !blackedOut) ? 'none' : 'block'
            });
            blackedOut = true;
        }
    }

    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
        var api = event.detail.api;
        var root = event.target;
        canvas = root.firstElementChild;
        var gc = api.lib.gc;
        
        gc.addEventListener(document, "keydown", function ( event ) {
            if ( event.ctrlKey && event.keyCode === 66 ) {
                event.preventDefault();
                if (!blackedOut) {
                    blackout();
                }
                else {
                    // Note: This doesn't work on Firefox. It will set display:block,
                    // but slides only become visible again upon next transition, which
                    // forces some kind of redraw. Works as intended on Chrome.
                    removeBlackout();
                }
            }
        }, false);
        
        gc.addEventListener(document, "keyup", function ( event ) {
            if ( event.ctrlKey && event.keyCode === 66 ) {
                event.preventDefault();
            }
        }, false);

    }, false);
        
    document.addEventListener("impress:stepleave", function (event) {
        removeBlackout();
    }, false);

})(document, window);

