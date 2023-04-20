class SFComponent {

    routes = undefined;
    loaded = false;
    started = false;

    constructor(routes) {
        this.routes = routes;        
    }

    state = {};

    bindings = [];
    bindingsTo = [];

    classes = ``;

    tabs = 4;
    autoRender = true;

    template = ``;
    refs = {};
    intervals = [];

    create() {
        if (! this.loaded) {
            this.load();
            this.loaded = true;
        }
        if (this.autoRender) {
            this.render();
        }
    }

    render() {
        document.body.innerHTML = this.output();
        this.start();
        this.started = true;
    };

    nextThick(setters) {
        const cntn = setters();
        if (cntn != undefined && cntn == false) {
            return;
        }
        document.body.innerHTML = this.output();
     };

    output() {
        this.evaluate();
        this.elementTree = new SFElementTree(this);
        this.elementTree.build();
        return this.elementTree.output;
    }

    load() {}

    start() {}

    final() {
        this.intervals.forEach((q) => {
            clearInterval(q);
        });
        this.bindings = [];
    }
    
    evaluate() {
        this.state.Space = '&nbsp;';
        this.state.page = 'main.page';
        this.state.Lt = '&lt;';
        this.state.Gt = '&gt;';
        this.state.Br = '<br>';
    }

    range(from,to,step) {
        const arr = Array(~~((to - from + 1) / step));
        let n = 0;
        for (let x = from; x <= to; x+=step) {
            arr[n++] = { index: n, value: x };
        }
        return arr;
    }

    addBinding(ref, value, inputName, prop) {
        const obj = {value: value};
        const row = { ref: ref, value: obj, input: inputName, prop: prop, preValue: value };
        this.bindings.push(row);
        if (row.input != undefined) {
            document.getElementById(row.input).value = value;
        }
        this.bind(ref);
        return obj;
    }

    listenBindings() {
        const oneWayFunc = () => {
            this.bindings.forEach((item) => {
                if (item.value.value != item.preValue) {
                   
                    if (item.prop != undefined) {

                        if (item.prop == "value") {
                            document.getElementById(item.input).value = item.value.value.toString;
                        } else {
                            document.getElementById(item.input).setAttribute(prop, item.value.value.toString() );
                        }
                    } else {
                        this.bind(item.ref);
                    }
                    item.preValue = item.value.value;
                }
            });
        }

        oneWayFunc();
        let ival = setInterval(() => {
            oneWayFunc();
        }, 5);
        this.intervals.push(ival);
    }

    bind(ref) {
        const obj = (this.bindings.filter((q) => { return q.ref == ref; }))[0];
        let value = undefined;
        if (obj.prop != undefined) {
            if (obj.prop = "value") {
                value = document.getElementById(obj.input).value;
            } else {
                value = document.getElementById(obj.input).getAttribute(obj.prop);
            }
        } else {
            if (obj.input != undefined) {
                value = document.getElementById(obj.input).innerHTML;
            } else {
                value = obj.value.value;
            }
        }
        obj.value.value = value;
        obj.preValue = value;
        let objClasses = document.getElementsByClassName("." + ref + "SnwFl");
        if (objClasses != undefined && objClasses.length > 0) {
            for (let q = 0; q < objClasses.length; ++q)  {
                objClasses[q].innerHTML = value.toString();
            }
        }

        
    }

    ref(id) {
        if (this.refs[id] == undefined) {
            this.refs[id] = document.getElementById(id);
        }
        return this.refs[id];
    }

}