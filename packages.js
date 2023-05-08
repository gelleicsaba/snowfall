const headTitleDefault = "Exmples";

const metaElements = [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" }
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
    , "./components/mutations"
    , "./components/langs"
    , "./components/ress"
];
const cssInjects = [
    "main"
];

const langSettings = {
    languages: ["en", "de"],
    default: "en",
    strict: true,
};
const resourceSettings = {
    apply: true,
    path: "public"
};
(() => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('title');
    script.innerText = headTitleDefault;
    head.insertBefore(script, head.children[1]);
})();

metaElements.forEach((item) => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('meta');
    for (let name in item) {
        script.setAttribute(name, item[name]);
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
var defaultLang = undefined;
if (langSettings.languages.length > 0) {
    langSettings.languages.forEach((q) => {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.src = "./resources/lang/" + q + ".js";
        script.type = 'text/javascript';
        head.insertBefore(script, head.children[head.children.length - 1]);
    });
}
if (!String.format) {
    String.format = function(format) {
      var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
if (resourceSettings.apply) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = "./resources/resources.js";
    script.type = 'text/javascript';
    head.insertBefore(script, head.children[head.children.length - 1]);
}
var main = undefined; 
window.addEventListener("load", (event) => {
    let good = true;
    if (langSettings.languages.length > 0) {
        defaultLang = eval("structuredClone(" + langSettings.default + "Lang)");
        if (langSettings.strict) {
            langSettings.languages.forEach((q) => {
                if (q != langSettings.default) {
                    const checkLang = eval(q + "Lang");
                    for (let propname in defaultLang) {
                        if (checkLang[propname] == undefined) {
                            document.writeln("Strict mode: The langauge file is invalid!<br>");
                            document.writeln("Strict mode: The '"+propname+"' does not exist in "+ q +"Lang !<br>");
                            good = false;
                        }
                    }
                }
            });
        }
    }
    if (! good) return;
    main = new Main();
});
