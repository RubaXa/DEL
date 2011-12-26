# DEL

DEL —  DOM Event listener


## Features
* easy interface
* not need jQuery
* small size ~2.4KB (Minified and Gzipped)


## Examples
```js
DEL.on(parent/*:(Node|Array.<Node>|NodeList)*/, eventType/*:String*/, selectors/*:String*/, fn/*:Function*/);
DEL.on(eventType/*:String*/, selectors/*:String*/, fn/*:Function*/);
DEL.on(parent, {
	"[eventType] selectors": fn/*:Function*/,
	"selectors": {
		"eventType": fn/*:Function*/
	}
});


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

var MyElm = document.getElementById('MyElm');
DEL.on(MyElm, "click", ".jpg,.png", function (evt){  });
DEL.on(MyElm, {  });

DEL.off(MyElm, "click");

var parent = document.querySelectorAll(".parent");
DEL.on(parent, "hover", ".jpg,.png", function (evt){  });

// or if you use jQuery

$(".parent").listen({   });

$(".parent").unlisten({   });

```


## Event object (thanks jQuery :])
@see http://api.jquery.com/category/events/event-object/



## Support events
* click
* dblclick
* mousedown
* mouseup
* mousemove
* mouseover
* mouseout
* mouseenter
* mouseleave
* hover
* select
* keydown
* keypress
* keyup
* blur (!)
* focus (!)
* focusin (!)
* focusout (!)
* change (!)
* submit (!)

(!) — all "normal" browsers and IE9+, if before DEL.js include jQuery 1.5+, then IE6+ also gets support
