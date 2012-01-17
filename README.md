# DEL — DOM Event Listener

A listener to events for all elements that match the selector, now or in the future.


## Features
* easy interface: `on/off` and `pause/unpause`
* support IE6+, FF, Chrome, Opera
* small size 2.4KB (minified + gzipped)
* not need jQuery



### Description
```js
// Add listener
DEL.on(
	  root/*:(Node|Array.<Node>|NodeList|jQuery) — root element*/
	, eventType/*:String — A string containing one or more space-separated event types, such as "click" or "keydown"*/
	, selectors/*:String — A selector to filter the elements that trigger the event.*/
	, fn/*:Function(eventObject) — A function to execute at the time the event is triggered.*/
);

// root === document.body
DEL.on(eventType/*:String*/, selectors/*:String*/, fn/*:Function*/);

DEL.on(root, {
	"[eventType] selectors": fn,
	"selectors": {
		"eventType": fn,
		"eventType": fn
	}
});

// Remove listener
DEL.off(root, eventType, selectors, fn);
DEL.off(root, eventType, selectors);
DEL.off(root, eventTypeOrSelectors);
DEL.off(eventTypeOrSelectors);

// Pause/Unpause listener
// @see DEL.off
DEL.pause(root, eventType, selectors, fn);
DEL.unpause(root, eventType, selectors, fn);

// or if you use jQuery

$(".root").listen({   });
$(".root").unlisten({   });
$(".root").pauseListen({   });
$(".root").unpauseListen({   });
```

### Warning
`selectors` — does not support html-attributes, only id, tagName and classNames

```js
// Support
DEL.on('.class1.classN', 'click', fn);
DEL.on('#id.class1.classN', 'click', fn);
DEL.on('div.class1.classN', 'click', fn);
DEL.on('div#id.class1.classN', 'click', fn); // === DEL.on('#id.class1.classN', 'click', fn);

// Not support
DEL.on('input[type="name"]', 'click', fn);
```


### Examples
```js
DEL.on("click", "a", function (evt/*Event*/){ /* evt.currentTarget — this link */ });

DEL.on({
	"[mouseenter] .sel-1": function (evt){  },
	"[keyup keydown] input.txt,input.pass": function (evt){  },
	"[hover] a.items": function (evt){ $("#hint")[evt.type == "mouseenter" ? "show" : "hide"](); },
	"input": {
		"blur":  function (evt){  },
		"focus": function (evt){  }
	}
});


DEL.off("click");
DEL.off(".sel-1");
DEL.off("blur", "input");
DEL.off("focus", "input", fn);


var root = document.getElementById('MyElm');
DEL.on(root, "click", ".jpg,.png", function (evt){  });
DEL.on(root, {  });

DEL.off(root, "click");


var rootList = document.querySelectorAll(".root");
DEL.on(rootList, "hover", ".jpg,.png", function (evt){  });
```



### Event object (thanks jQuery :])
@see http://api.jquery.com/category/events/event-object/
(!) add custom property `DEL.event.props.push("dataTransfer");`



### Support events
* click
* dblclick
* mousedown
* mouseup
* mouseclick: `mousedown mouseup`
* mousemove
* mouseover
* mouseout
* mouseenter
* mouseleave
* mousewheel: `event.delta`
* hover: `mouseenter mouseleave`
* keydown
* keypress
* keyup
* blur (!)
* focus (!)
* focusin (!)
* focusout (!)
* change (!)
* submit (!)
* input (!!)

(!) — all "normal" browsers and IE9+, if before DEL.js include jQuery 1.4.3+, then IE6+ also gets support

(!!) — IE9+ and others



### Special events
```js
// Create custom group
DEL.event.add(
	  'inp'                /*:String — event name */
	, 'focus blur change'  /*:String — space-separated event types */
);

// Create custom event
DEL.event.add(
	  'rightclick' /*:String — event name */
	, 'mousedown'  /*:String — single event type */
	, function (event/*:Event*/, node/*:HTMLElement*/){
		/* this check function */
		return  (event.which == 3);
	}
);
DEL.on('rightclick', function (evt){ });

// Example: shift+click
DEL.event.add('shift+click', 'click', function (evt){ return evt.shiftKey; });
DEL.on('shift+click', function (evt){ });
```
