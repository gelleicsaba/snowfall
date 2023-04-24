class Routes {

    routes = [];

    tree = {
        /* put routes here  */
        /*   '/your_route': new YourComponent(this) */

        '/' : new Home(this)
        , '/home' : new Home(this)
        , '/simple-vars' : new SimpleVars(this)
        , '/data-bindings' : new DataBindings(this)
        , '/subcomponents' : new SubComponents(this)
        , '/foreloops' : new ForeachLoops(this)
        , '/conditions' : new Conditions(this)
        , '/subrenders' : new SubRenders(this)
        , '/lifecycles' : new Lifecycles(this)
        , '/calc' : new Calculator(this)
        , '/mutations' : new Mutatations(this)
    }

    push(route) {
        if (this.get() == route) {
            return false;
        }
        this.routes.push(route);
        return true;
    }

    pop() {
        if (this.routes.length < 2) {
            return null;
        }
        return this.routes.pop();
    }

    get() {
        if (this.routes.length == 0) {
            return null;
        }
        return this.routes[this.routes.length - 1];
    }

}