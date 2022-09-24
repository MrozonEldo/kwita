
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let initialUsers = [
        {
            id: "679e4ddf-684f-4369-8f7b-b1db9e2976b8",
            name: "smalec"
        },
        {
            id: "f801ab89-c94f-44eb-b278-c08854e9feb3",
            name: "mruza"
        },
        {
            id: "ad9819ea-9fef-44c3-8d8a-bb680f61b9d7",
            name: "kuba"
        }
    ];
    let defaultExpenseCategories = [
        {
            id: "d127d779-055e-47d4-bf3b-aeda01d79c62",
            name: "Najm i czynsz"
        },
        {
            id: "8d605a7b-eb1c-4ddd-b8ad-984a0806f640",
            name: "Zakupy"
        },
        {
            id: "16afbf69-ee08-429f-98f2-05b54aedb20e",
            name: "Inne"
        }
    ];
    const expenseCategories = writable(defaultExpenseCategories);
    const user = writable(initialUsers[0]);
    const expenses = writable(new Array);

    /* src\lib\AddExpenseCard.svelte generated by Svelte v3.50.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\lib\\AddExpenseCard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (27:8) {#each $expenseCategories as c}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*c*/ ctx[10].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*c*/ ctx[10];
    			option.value = option.__value;
    			add_location(option, file$2, 27, 12, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$expenseCategories*/ 8 && t_value !== (t_value = /*c*/ ctx[10].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$expenseCategories*/ 8 && option_value_value !== (option_value_value = /*c*/ ctx[10])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:8) {#each $expenseCategories as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let input0;
    	let t1;
    	let br0;
    	let t2;
    	let input1;
    	let t3;
    	let br1;
    	let t4;
    	let select;
    	let t5;
    	let br2;
    	let br3;
    	let t6;
    	let input2;
    	let mounted;
    	let dispose;
    	let each_value = /*$expenseCategories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Ile:\r\n    ");
    			input0 = element("input");
    			t1 = space();
    			br0 = element("br");
    			t2 = text("\r\n    Tytuł:\r\n    ");
    			input1 = element("input");
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\r\n    Rodzaj rachunku:\r\n    ");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t6 = space();
    			input2 = element("input");
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$2, 19, 4, 430);
    			add_location(br0, file$2, 20, 4, 484);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 22, 4, 506);
    			add_location(br1, file$2, 23, 4, 550);
    			attr_dev(select, "id", "categories");
    			if (/*category*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$2, 25, 4, 582);
    			add_location(br2, file$2, 30, 4, 756);
    			add_location(br3, file$2, 30, 8, 760);
    			attr_dev(input2, "type", "button");
    			input2.value = "+";
    			attr_dev(input2, "class", "add_button svelte-fz92nq");
    			add_location(input2, file$2, 31, 4, 770);
    			attr_dev(div, "class", "box svelte-fz92nq");
    			add_location(div, file$2, 16, 0, 394);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, input0);
    			set_input_value(input0, /*amountDecimal*/ ctx[0]);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, input1);
    			set_input_value(input1, /*title*/ ctx[1]);
    			append_dev(div, t3);
    			append_dev(div, br1);
    			append_dev(div, t4);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*category*/ ctx[2]);
    			append_dev(div, t5);
    			append_dev(div, br2);
    			append_dev(div, br3);
    			append_dev(div, t6);
    			append_dev(div, input2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(input2, "click", /*Add*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*amountDecimal*/ 1 && to_number(input0.value) !== /*amountDecimal*/ ctx[0]) {
    				set_input_value(input0, /*amountDecimal*/ ctx[0]);
    			}

    			if (dirty & /*title*/ 2 && input1.value !== /*title*/ ctx[1]) {
    				set_input_value(input1, /*title*/ ctx[1]);
    			}

    			if (dirty & /*$expenseCategories*/ 8) {
    				each_value = /*$expenseCategories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*category, $expenseCategories*/ 12) {
    				select_option(select, /*category*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $expenses;
    	let $user;
    	let $expenseCategories;
    	validate_store(expenses, 'expenses');
    	component_subscribe($$self, expenses, $$value => $$invalidate(8, $expenses = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(9, $user = $$value));
    	validate_store(expenseCategories, 'expenseCategories');
    	component_subscribe($$self, expenseCategories, $$value => $$invalidate(3, $expenseCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddExpenseCard', slots, []);
    	let amountDecimal = null;
    	let title;
    	let category;

    	function Add() {
    		let newExpense = {
    			id: crypto.randomUUID(),
    			amount: amountDecimal * 100,
    			payer: $user,
    			title
    		};

    		set_store_value(expenses, $expenses = [newExpense, ...$expenses], $expenses);
    		console.log($expenses);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<AddExpenseCard> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		amountDecimal = to_number(this.value);
    		$$invalidate(0, amountDecimal);
    	}

    	function input1_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	function select_change_handler() {
    		category = select_value(this);
    		$$invalidate(2, category);
    	}

    	$$self.$capture_state = () => ({
    		expenses,
    		user,
    		expenseCategories,
    		amountDecimal,
    		title,
    		category,
    		Add,
    		$expenses,
    		$user,
    		$expenseCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('amountDecimal' in $$props) $$invalidate(0, amountDecimal = $$props.amountDecimal);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('category' in $$props) $$invalidate(2, category = $$props.category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		amountDecimal,
    		title,
    		category,
    		$expenseCategories,
    		Add,
    		input0_input_handler,
    		input1_input_handler,
    		select_change_handler
    	];
    }

    class AddExpenseCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddExpenseCard",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    let currencyFormater = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    });
    function formatMoney(amount) {
        return currencyFormater.format(amount / 100);
    }

    /* src\lib\ExpenseCard.svelte generated by Svelte v3.50.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\lib\\ExpenseCard.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1_value = /*expense*/ ctx[0].payer.name + "";
    	let t1;
    	let t2;
    	let t3_value = formatMoney(/*expense*/ ctx[0].amount) + "";
    	let t3;
    	let t4;
    	let t5_value = /*expense*/ ctx[0].title + "";
    	let t5;
    	let t6;
    	let t7;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Hej ");
    			t1 = text(t1_value);
    			t2 = text("! Chcę ci powiedzieć, że zapłaciłeś ");
    			t3 = text(t3_value);
    			t4 = text(" za ");
    			t5 = text(t5_value);
    			t6 = text(". Spoko ok?");
    			t7 = space();
    			input = element("input");
    			add_location(p, file$1, 14, 4, 344);
    			attr_dev(input, "type", "button");
    			input.value = "USUŃ";
    			add_location(input, file$1, 15, 4, 476);
    			attr_dev(div, "class", "expense_card svelte-13u5fny");
    			add_location(div, file$1, 13, 0, 312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(div, t7);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*expense*/ 1 && t1_value !== (t1_value = /*expense*/ ctx[0].payer.name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*expense*/ 1 && t3_value !== (t3_value = formatMoney(/*expense*/ ctx[0].amount) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*expense*/ 1 && t5_value !== (t5_value = /*expense*/ ctx[0].title + "")) set_data_dev(t5, t5_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $expenses;
    	validate_store(expenses, 'expenses');
    	component_subscribe($$self, expenses, $$value => $$invalidate(3, $expenses = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpenseCard', slots, []);
    	let { expense } = $$props;

    	function Delete(e) {
    		console.log(e);
    		set_store_value(expenses, $expenses = $expenses.filter(item => item.id !== e), $expenses);
    		console.log(expenses);
    	}

    	const writable_props = ['expense'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ExpenseCard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => Delete(expense.id);

    	$$self.$$set = $$props => {
    		if ('expense' in $$props) $$invalidate(0, expense = $$props.expense);
    	};

    	$$self.$capture_state = () => ({
    		formatMoney,
    		expenses,
    		expense,
    		Delete,
    		$expenses
    	});

    	$$self.$inject_state = $$props => {
    		if ('expense' in $$props) $$invalidate(0, expense = $$props.expense);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [expense, Delete, click_handler];
    }

    class ExpenseCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { expense: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpenseCard",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*expense*/ ctx[0] === undefined && !('expense' in props)) {
    			console_1.warn("<ExpenseCard> was created without expected prop 'expense'");
    		}
    	}

    	get expense() {
    		throw new Error("<ExpenseCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expense(value) {
    		throw new Error("<ExpenseCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (17:4) {#each $expenses as expense}
    function create_each_block(ctx) {
    	let expensecard;
    	let current;

    	expensecard = new ExpenseCard({
    			props: { expense: /*expense*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(expensecard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(expensecard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const expensecard_changes = {};
    			if (dirty & /*$expenses*/ 1) expensecard_changes.expense = /*expense*/ ctx[1];
    			expensecard.$set(expensecard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expensecard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expensecard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(expensecard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:4) {#each $expenses as expense}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let addexpensecard;
    	let t3;
    	let t4;
    	let div2;
    	let current;
    	addexpensecard = new AddExpenseCard({ $$inline: true });
    	let each_value = /*$expenses*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Kwita jo";
    			t2 = space();
    			div1 = element("div");
    			create_component(addexpensecard.$$.fragment);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			if (!src_url_equal(img.src, img_src_value = "src/assets/k.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Kwita Logo");
    			attr_dev(img, "class", "logo svelte-praz20");
    			add_location(img, file, 8, 6, 268);
    			attr_dev(a, "href", "https://github.com/k144/kwita");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 7, 4, 203);
    			add_location(div0, file, 6, 2, 192);
    			add_location(h1, file, 11, 2, 351);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file, 13, 2, 374);
    			add_location(div2, file, 19, 2, 508);
    			add_location(main, file, 5, 0, 182);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			mount_component(addexpensecard, div1, null);
    			append_dev(main, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t4);
    			append_dev(main, div2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$expenses*/ 1) {
    				each_value = /*$expenses*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addexpensecard.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addexpensecard.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(addexpensecard);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $expenses;
    	validate_store(expenses, 'expenses');
    	component_subscribe($$self, expenses, $$value => $$invalidate(0, $expenses = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AddExpenseCard,
    		ExpenseCard,
    		expenses,
    		$expenses
    	});

    	return [$expenses];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
