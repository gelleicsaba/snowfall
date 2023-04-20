class Routes {

    routes = [];

    tree = {
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