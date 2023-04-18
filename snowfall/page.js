class Page {

    constructor() {
        this.route = new URL(window.location.href).searchParams.get("route");
        if (this.route == null) {
            this.route = "/";
        }
        this.routes = new Routes();
        this.routes.push(this.route);
        this.page = this.routes.tree[this.route];
        this.page.create();
    }


    updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
          return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
          return uri + separator + key + "=" + value;
        }
    }

    changeRoute(route) {
        window.event.preventDefault();
        this.page.final();
        const newurl = this.updateQueryStringParameter(window.location.href, "route", route);
        window.history.pushState({}, document.title, newurl);
        this.route = route;
        this.page = this.routes.tree[route];
        this.routes.push(route);
        this.page.create();
    }

    stepBack() {
        window.event.preventDefault();
        this.routes.pop();
        const backPage = this.routes.get();
        if (backPage == null) {
            return false;
        }
        this.page.final();
        const newurl = this.updateQueryStringParameter(window.location.href, "route", backPage);
        window.history.pushState({}, document.title, newurl);
        this.page = this.routes.tree[backPage];
        this.page.create();
        return true;
    }

}

var globals = {};
