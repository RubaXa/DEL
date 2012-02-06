/**
 * DOM Event Listener
 * @author  RubaXa  <trash@rubaxa.org>
 *
 *
 * DEL.on({
 *    "[mouseover] .my-elm": overFn
 *  , "[mouseup mousedown] .my-elm": function (evt){}
 *  , "[click] a": function (evt){ }
 * });
 *
 *
 * DEL.pause('mouseup');
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
		  _rid      = /#([^\.]+)/i
		, _guid     = 1
		, _data     = {}
		, _proto    = 'prototype'

		, _slice    = Array[_proto].slice
		, _toStr    = Object[_proto].toString
		, _fbind    = Function[_proto].bind
		, _rtrim    = /(^\s+|\s+$)/g
		, _rspace   = /\s+/g
		, _revents  = /^\[([^\]]+)\]\s*/i

		, noop      = function (){}
		, document  = window.document
		, onwheel   = ('onmousewheel' in document) ? 'mousewheel' : 'DOMMouseScroll'

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
				  blur:         'focusout'
			    , focus:        'focusin'
				, mouseenter:   'mouseover'
				, mouseleave:   'mouseout'
			    , mousewheel:   onwheel
			},
			group: {
				  hover: 'mouseenter mouseleave'
			    , mouseclick: 'mouseup mousedown'
			},
			special: {
				  mouseenter:   withinElement
				, mouseleave:   withinElement
			},
			split: function (type){
				type    = (' '+type+' ').replace(/\s([^\s]+)/, function (a, name){ return ' '+(_event.group[name] || name) });
				return  _clean(type, 'trim').split(_rspace);
			},
			add: function (name, type, fn){
				if( fn ){
					_event.map[name] = type;
					_event.special[name] = fn;
				} else {
					_event.group[name] = type;
				}
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
	 * @param   fn
	 * @return  {Boolean}
	 */
	function isFn(fn){
		return  _toStr.call(fn) == '[object Function]';
	}


	/**
	 * Is boolean
	 *
	 * @param   val
	 * @return  {Boolean}
	 */
	function isBool(val){
		return  _toStr.call(val) == '[object Boolean]';
	}

	/**
	 * Is string
	 *
	 * @param str
	 * @return {Boolean}
	 */
	function isStr(str){
		return  typeof str == 'string';
	}


	/**
	 * Remove all spaces or trim
	 *
	 * @param   {String}    str
	 * @param   {String}    [mode]
	 * @return  {String}
	 */
	function _clean(str, mode){
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
	 * @param   {Object|Array|HTMLElement}    obj
	 * @param   {Function}  fn
	 */
	function _each(obj, fn){
		if( isStr(obj) || isNode(obj) ) obj = [obj];

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
		if( item.id !== undef ){
			return  elm.id == item.id;
		} else if( item.tag === undef || (elm.tagName == item.tag) ){
			if( item.mod !== undef ){
				var className = ' '+elm.className+' ', mod = item.mod, i = mod.length;

				if( i === 1 ){
					return  ~className.indexOf(' '+mod[0]+' ');
				}

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
			, oEvt = evt.originalEvent
		;

		if( type === onwheel && !('delta' in evt) ){
			if( oEvt.wheelDelta ) evt.delta = oEvt.wheelDelta/120;
			if( oEvt.detail ) evt.delta = -oEvt.detail/3;
		}

		if( items && items.length ) while( target !== null && target !== elm ){
			if( target.nodeType == 1 ){
				for( i = 0, n = items.length; i < n; i++ ){
					item    = items[i];
					if( item.on && _equal(target, item) ){
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

			target = target.parentNode;
		}
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
		sel = _clean(sel);
		var item = { type: type, fn: fn, sel: sel, on: true };

		if( sel.match(_rid) ){
			item.id = RegExp.$1;
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
		var fix;
		_each(data, function (items, type){
			if( type != 'fn' ){
				fix = '__on'+type;
				if( data.fn[fix] && !items.length ){
					data.fn[fix] = 0;
					_eventListener(elm, false, type, data.fn);
				}

				if( !data.fn[fix] && items.length ){
					data.fn[fix] = 1;
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
		if( isStr(elms) && !sel ){
			fn      = events;
			events  = elms;
			sel     = '*';
			elms    = undef;
		}
		else if( !isStr(elms) && isStr(events) && !fn ){
			fn  = sel;
			sel = '*';
		}

		if( !events ){
			events  = elms;
			elms    = undef;
		} else if( sel && !fn ){
			fn      = sel;
			sel     = events;
			events  = elms;
			elms    = undef;
		}

		elms    = elms || document.body;

		if( isStr(events) ){
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
	function unlisten(elms, type, sel, fn, pause){
		if( isBool(elms) ){
			var _fn = pause;
			pause   = elms;
			elms    = type;
			type    = sel;
			sel     = fn;
			fn      = _fn;
		}

		if( isStr(elms) ){
			fn      = sel;
			sel     = type;
			type    = elms;
			elms    = document.body;
		}

		if( isFn(sel) || isBool(fn) || sel === undef ){
			unlisten(elms, type, '', sel, pause);
			unlisten(elms, '', type, sel, pause);
			return;
		}

		_each(elms, function (elm){
			if( elm.uniqId && _data[elm.uniqId] ){
				var data = _data[elm.uniqId], i, item, remove;

				_each(data, function (items, cat){
					if( cat !== 'fn' ){
						for( i = items.length; i--; ){
							item    = items[i];
							_each(_event.split(type), function (type){
								remove  = (!type || type == item.type)
										&& (!fn || fn === item.fn)
										&& (!sel || sel.toLowerCase() == item.sel.toLowerCase());
								if( remove ){
									if( pause !== undef ){
										item.on = !pause;
									} else {
										items   = items.slice(0, i).concat(items.slice(i+1));
									}
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

		$.fn.listen     = function (events, sel, fn){
			listen(this, events, sel, fn);
			return  this;
		};

		$.fn.unlisten   = function (events, sel, fn){
			unlisten(this, events, sel, fn);
			return  this;
		};

		$.fn.pauseListen   = function (events, sel, fn){
			unlisten(this, events, sel, fn, true);
			return  this;
		};

		$.fn.unpauseListen   = function (events, sel, fn){
			unlisten(this, events, sel, fn, false);
			return  this;
		};
	}


	// GLOBALIZATION
	window.DEL = {
		  on:       listen
		, off:      unlisten
		, pause:    _proxy(noop, unlisten, true)
		, unpause:  _proxy(noop, unlisten, false)
		, event:    _event
	};
})(this, this.jQuery);
