/**
 * DOM Event Listener
 * @author  RubaXa  <trash@rubaxa.org>
 *
 *
 * @example
 * DEL.on({
 *    "[mouseover] .my-elm": overFn
 *  , "[mouseup mousedown] .my-elm": function (evt){}
 *  , "[click] a": function (evt){ }
 * });
 *
 *
 * DEL.off('.my-elm', overFn);
 *
 * DEL.off({
 *    '[mousedown] .my-elm': true
 *  , 'a': true
 * });
 *
 *
 *
 * @namespace   this.jQuery
 *
 *
 * @param   {window}    window
 * @param   {jQuery}    $
 * @param   [undef]
 */
(function (window, $, undef){
	var
		  _guid     = 1
		, _data     = {}
		, _proto    = 'prototype'

		, _slice    = Array[_proto].slice
		, _toStr    = Object[_proto].toString
		, _fbind    = Function[_proto].bind
		, _rtrim    = /(^\s+|\s+$)/g
		, _rspace   = /\s+/g
		, _revents  = /^\[([^\]]+)\]\s*/i

		, noop = function (){}
		, document = window.document

		, EventListener = 'EventListener'
		, addEventListener = 'add' + EventListener
		, removeEventListener = 'remove' + EventListener

		, returnTrue    = function (){ return true; }
		, returnFalse   = function (){ return false; }

		// MyEvent helper (jQuery, thx)
		, _event = {
			props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
			fix: function (event){ return new MyEvent(event); },
			map: {
				  blur: 'focusout'
			    , focus: 'focusin'
				, mouseenter: 'mouseover'
				, mouseleave: 'mouseout'
			},
			short: {
				hover: 'mouseenter mouseleave'
			},
			special: {
				  mouseenter: withinElement
				, mouseleave: withinElement
			},
			split: function (type){
				type    = (' '+type+' ').replace(/\s([^\s]+)/, function (a, name){ return ' '+(_event.short[name] || name) });
				return  _clear(type, 'trim').split(_rspace);
			}
		}
	;


	// jQuery: Checks if an event happened on an element within another element
	function withinElement(evt, elm){
		var related = evt.relatedTarget, inside = false;
		if( related !== elm ){
			if( related ){
				do {
					if( related === elm ){
						inside  = true;
						break;
					}
				} while( (related = related.parentNode) &&  related !== document.body );
			}
			return  !inside;
		}
		return  false;
	}


	/**
	 * Call method in context
	 *
	 * @private
	 * @param   {Object}    ctx
	 * @param   {Function}  fn
	 * @return  {Function}
	 */
	function _proxy(ctx, fn){
		var args = _slice.call(arguments, 2);

		if( _fbind !== undef ){
			return  _fbind.apply(fn, [ctx].concat(args));
		}

		var
			fNOP = function (){},
			fBound = function (){ return fn.apply(this instanceof fNOP ? this : ctx || window, args.concat(_slice.call(arguments))); };

		fNOP[_proto] = ctx[_proto];
		fBound[_proto] = new fNOP();

		return fBound;
	}


	/**
	 * Is dom element
	 *
	 * @param   {HTMLElement}   elm
	 * @return  {Boolean}
	 */
	function isNode(elm){
		return  elm && elm.nodeType == 1;
	}


	/**
	 * Is object
	 *
	 * @param   val
	 * @return  {Boolean}
	 */
	function isObj(val){
		return  _toStr.call(val) == '[object Object]';
	}


	/**
	 * Is function
	 *
	 * @param fn
	 * @return  {Boolean}
	 */
	function isFn(fn){
		return  _toStr.call(fn) == '[object Function]';
	}


	/**
	 * Remove all spaces
	 *
	 * @param {String} str
	 * @patam {String} [mode]
	 * @return  {String}
	 */
	function _clear(str, mode){
		if( mode === 'trim' ){
			return  str.replace(_rtrim, '');
		}
		return  str.replace(_rspace, '');
	}


	/**
	 * Add/remove event listener
	 *
	 * @param   {HTMLElement}   elm     Element
	 * @param   {Boolean}       on      on/off
	 * @param   {String}        name    event name
	 * @param   {Function}      fn
	 */
	function _eventListener(elm, on, name, fn){
		if( isNode(elm) ){
			if( $ ){
				$.event[on ? 'add' : 'remove'](elm, name, fn);
			} else if( elm[addEventListener] ){
				elm[on ? addEventListener : removeEventListener](name, fn, false);
			} else {
				elm[on ? 'attachEvent' : 'detachEvent']('on'+name, fn);
			}
		}
	}


	/**
	 * @param   {Object|Array}    obj
	 * @param   {Function}  fn
	 */
	function _each(obj, fn){
		if( typeof obj == 'string' || isNode(obj) ) obj = [obj];

		if( 'forEach' in obj ){
			obj.forEach(fn);
		} else if( 'length' in obj ){
			for( var i = 0, n = obj.length; i < n; i++ ) if( i in obj ){
				fn.call(this, obj[i], i);
			}
		} else {
			for( var key in obj ) if( obj.hasOwnProperty(key) ){
				fn.call(this, obj[key], key);
			}
		}
	}


	/**
	 * Equal element and item
	 *
	 * @param   {HTMLElement}   elm
	 * @param   {Object}        item
	 * @return  {Boolean}
	 */
	function _equal(elm, item) {
		if( 'id' in item ){
			return  elm.id == item.id;
		} else if( !('tag' in item) || (elm.tagName == item.tag) ){
			if( 'mod' in item ){
				var className = ' '+elm.className+' ', mod = item.mod, i = mod.length;
				for( ; i--; ) if( !~className.indexOf(' '+mod[i]+' ') ){
					return  false;
				}
			}
			return  true;
		}
		return  false;
	}


	/**
	 * @class   MyEvent   (Based on jQuery)
	 * @see     jQuery.event.fix
	 * @param   {MyEvent} original
	 */
	function MyEvent(original){
		var event = this;

		event.type = original.type;
		event.originalEvent = original;

		for( var i = _event.props.length, key; i--; ){
			key = _event.props[i];
			this[key]   = original[key];
		}

		if( !event.target ) event.target = event.srcElement || document;
		if( event.target.nodeType === 3 ) event.target = event.target.parentNode;
		if( !event.relatedTarget && event.fromElement ) event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

		if( event.pageX == null && event.clientX != null ){
			var eventDocument = event.target.ownerDocument || document, doc = eventDocument.documentElement, body = eventDocument.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		if( event.which == null && (event.charCode != null || event.keyCode != null) ) event.which = event.charCode != null ? event.charCode : event.keyCode;
		if( !event.metaKey && event.ctrlKey ) event.metaKey = event.ctrlKey;
		if( !event.which && event.button !== undefined ) event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
	}
	MyEvent[_proto] = {
		preventDefault: function() {
			this.isDefaultPrevented = returnTrue;
			var e = this.originalEvent;
			if( e.preventDefault ) e.preventDefault();
			else e.returnValue = false;
		},
		stopPropagation: function() {
			this.isPropagationStopped = returnTrue;
			var e = this.originalEvent;
			if( e.stopPropagation ) e.stopPropagation();
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function(){
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};


	/**
	 * @param {String} id
	 * @param {HTMLElement} elm
	 * @param evt
	 */
	function _onEvent(id, elm, evt){
		evt = _event.fix(evt || window.event);

		var
			  data = _data[id]
			, i
			, n
			, type = evt.type
			, target = evt.target
			, item
			, items = data[type]
			, special
		;

		if( items && items.length ) do {
			if( target.nodeType == 1 ){
				for( i = 0, n = items.length; i < n; i++ ){
					item    = items[i];
					if( _equal(target, item) ){
						special = _event.special[item.type];
						if( special === undef || special(evt, target) ){
							evt.type = item.type;
							evt.currentTarget = target;

							if( item.fn.call(target, evt) === false ){
								evt.preventDefault();
								evt.stopPropagation();
							}

							evt.type = type;

							if( evt.isPropagationStopped() ){
								// exit
								return;
							}
						}
					}
				}
			}
		}
		while( (target = target.parentNode) && elm !== target );
	}


	/**
	 * Push item to data
	 *
	 * @param   {Array}     data
	 * @param   {String}    sel
	 * @param   {String}    type
	 * @param   {Function}  fn
	 */
	function _pushItem(data, sel, type, fn){
		sel = _clear(sel);
		var item = { type: type, fn: fn, sel: sel };

		if( sel.charAt(0) == '#' ){
			item.id = sel.substr(1);
		} else {
			sel = sel.split('.');

			if( sel[0] && sel[0] != '*' ) item.tag = sel[0].toUpperCase();
			if( sel.length > 1 ) item.mod = sel.slice(1);
		}

		type = _event.map[type] || type;
		(data[type] = (data[type] || [])).push(item);
	}


	/**
	 * On/off event listeners
	 *
	 * @param {HTMLElement} elm
	 * @param {Object} data
	 */
	function _updListeners(elm, data){
		_each(data, function (items, type){
			if( type != 'fn' ){
				_eventListener(elm, false, type, data.fn);
				if( items.length ){
					_eventListener(elm, true, type, data.fn);
				}
			}
		});
	}


	/**
	 * Listen
	 *
	 * @param   {HTMLElement|Array} elms
	 * @param   {(Object|String)}   events
	 * @param   {String}            [sel]
	 * @param   {Function}          [fn]
	 */
	function listen(elms, events, sel, fn){
		if( !events ){
			events  = elms;
			elms    = document.body;
		} else if( sel && !fn ){
			fn      = sel;
			sel     = events;
			events  = elms;
			elms    = document.body;
		}

		if( typeof events == 'string' ){
			var tmp = {};
			tmp['['+ events +'] '+ sel] = fn;
			events = tmp;
		}


		_each(elms, function (elm){
			var
				  id = (elm.uniqId || (elm.uniqId = ++_guid))
				, data = (_data[id] = _data[id] || {})
				, types
			;

			_each(events, function (fn, rule){
				if( types = rule.match(_revents) ){
					rule = rule.replace(_revents, '');

					_each(_event.split(types[1]), function (type){
						_each(rule.split(','), function (sel){
							_pushItem(data, sel, type, fn);
						});
					});
				} else if( isObj(fn) ){
					_each(fn, function (fn, types){
						_each(rule.split(','), function (sel){
							_each(_event.split(types), function (type){
								_pushItem(data, sel, type, fn);
							});
						});
					});
				} else {
					_pushItem(data, rule, 'click', fn);
				}
			});

			if( !data.fn ){
				data.fn = function (evt){ _onEvent(id, elm, evt); };
			}

			_updListeners(elm, data);
		});
	}


	/**
	 * Unlisten
	 */
	function unlisten(elms, type, sel, fn){
		if( typeof elms == 'string' ){
			fn      = sel;
			sel     = type;
			type    = elms;
			elms    = document.body;
		}

		if( isFn(sel) || sel === undef ){
			unlisten(elms, type, '', sel);
			unlisten(elms, '', type, sel);
			return;
		}

		_each(elms, function (elm){
			if( elm.uniqId && _data[elm.uniqId] ){
				var data    = _data[elm.uniqId];

				_each(data, function (items, cat){
					if( cat !== 'fn' ){
						var a = items.length;

						for( var i = items.length, item, remove; i--; ){
							item    = items[i];
							_each(_event.split(type), function (type){
								remove  = (!type || type == item.type)
										&& (!fn || fn === item.fn)
										&& (!sel || sel.toLowerCase() == item.sel.toLowerCase());
								if( remove ){
									items   = items.slice(0, i).concat(items.slice(i+1));
								}
							});
						}

						data[cat]   = items;
						_updListeners(elm, data);
					}
				});
			}
		});
	}


	// jQuery support
	if( $ ){
		_event.fix      = function (evt){ return evt; };
		_event.props    = $.event.props;
		_event.special  = {};

		$.fn.listen     = function (events, sel, fn){
			listen(this, events, sel, fn);
			return  this;
		};

		$.fn.unlisten   = function (events, sel, fn){
			unlisten(this, events, sel, fn);
			return  this;
		};
	}


	_eventListener(document, true, 'propertychange', function (evt){
	});


	// GLOBALIZATION
	window.DEL = {
		  on:       listen
		, off:      unlisten
		, event:    _event
	};
})(this, this.jQuery);
