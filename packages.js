const metaElements = [
    { charset: "utf-8" }
    , { name: "viewport", content: "width=device-width, initial-scale=1.0" }
];

const cdns = [
    { src:"https://code.jquery.com/jquery-3.6.4.min.js", integrity:"sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=", crossorigin:"anonymous" }
];

const injects = [
    "./components/navbar"
    , "./components/simplevars"
    , "./components/databindings"
    , "./components/subcomponents"
    , "./components/foreloops"
    , "./components/conditions"
    , "./components/subrenders"
    , "./components/lifecycles"
    , "./components/home"
    , "./components/fruit"
    , "./components/calculator"
];
const cssInjects = [
    "main"
];

metaElements.forEach((item) => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('meta');
    for (let name in item) {
        if (name != "charset") {
            script[name] = item[name];
        } else {
            script.setAttribute(name, item[name]);
        }
    }
    head.insertBefore(script, head.children[1]);
});
function requireCDN(props) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    for (propname in props) {
        if (propname != "crossorigin") {
            script[propname] = props[propname];    
        } else {
            script.setAttribute(propname, props[propname]);
        }
    }
    
    head.insertBefore(script, head.children[head.children.length - 1]);
    return true;
}
cdns.forEach((item) => {
    requireCDN(item);
});
let injected = [];
function require(fname) {
    const filename = fname + '.js';
    if (injected.filter((q) => { return q == filename; }).length > 0) {
        return false;
    }
    injected.push(filename);
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    head.insertBefore(script, head.children[head.children.length - 1]);
    return true;
}
require("./snowfall/tree");
require("./snowfall/component");
require("./routes");
require("./snowfall/page");
require("./main");
injects.forEach((element) => {
    require(element);    
});
let injectedCSS = [];
function requireCSS(fname) {
    const filename = fname + '.css';
    if (injectedCSS.filter((q) => { return q == filename; }).length > 0) {
        return false;
    }
    injectedCSS.push(filename);
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('link');
    script.src = filename;
    script.setAttribute('rel', 'stylesheet');
    script.setAttribute('type', 'text/css');
    script.setAttribute('href', filename);
    head.insertBefore(script, head.children[head.children.length - 1]);
    return true;
}
cssInjects.forEach((element) => {
    requireCSS(element);    
});
var main = undefined; 
window.addEventListener("load", (event) => {
    main = new Main();
});
