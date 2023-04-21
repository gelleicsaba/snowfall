const fs = require('fs');
const http = require('http');
const https = require('https');

const 
  FgBlack = "\x1b[30m"
  ,FgRed = "\x1b[31m"
  ,FgGreen = "\x1b[32m"
  ,FgYellow = "\x1b[33m"
  ,FgBlue = "\x1b[34m"
  ,FgMagenta = "\x1b[35m"
  ,FgCyan = "\x1b[36m"
  ,FgWhite = "\x1b[37m"
  ,FgGray = "\x1b[90m";


if (process.argv.length == 2) {
  console.log(
`Snowfall CLI tool (v1.1)

create project:
  node sf create prj YOUR_PROJECT_NAME

add a component:
  node sf add comp YOUR_COMPONENT

add a route:
  node sf add route ROUTE_NAME COMPONENT_NAME

`);

process.exit();
}


const progress = (q) => {
  console.log(FgCyan + q +"...");
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const httpsGet = (url, callback) => {

  const options = {};

  https.get(url, options, res => {
        let s = "";
        res.on("data", d => s += d)
        res.on("end", _ => callback(s)) // error-first callback
      })
      .on("error", e => callback(null));         // error-first callback 
}


if (process.argv.length == 5 && process.argv[2] == "create" && process.argv[3] == "prj") {
  console.log("creating project...");


  const prjName = process.argv[4];
  if (fs.existsSync(prjName)) {
    process.stderr.write(FgRed + "project or path is exists\ncheck the path ./" + prjName);
    process.exit();
  }
  fs.mkdirSync(prjName);
  fs.mkdirSync(prjName+"/" + "snowfall");
  fs.mkdirSync(prjName+"/" + "components");

  step7 = (q) => {
    fs.writeFileSync("./" + prjName + "/index.html", q);
    fs.writeFileSync("./" + prjName + "/main.css", "\n");
    fs.copyFileSync('sf.js', './' + prjName + '/sf.js');
    console.log(FgGreen + "done.");
    process.exit();
  };

  step6 = (q) => {
    fs.writeFileSync("./" + prjName + "/snowfall/tree.js", q);
    progress("  GET index.html");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/index.html", step7 );

  };

  step5 = (q) => {
    fs.writeFileSync("./" + prjName + "/snowfall/page.js", q);
    progress("  GET tree.js");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/snowfall/tree.js", step6 );
  };

  step4 = (q) => {
    fs.writeFileSync("./" + prjName + "/snowfall/component.js", q);
    progress("  GET page.js");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/snowfall/page.js", step5 );
  };

  step3 = (q) => {
    fs.writeFileSync("./" + prjName + "/routes.js", q);
    progress("  GET component.js");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/snowfall/component.js", step4 );
  };

  step2 = (q) => {
    fs.writeFileSync("./" + prjName + "/packages.js", q);
    progress("  GET routes.js");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/base/routes.js", step3 );
  };

  step1 = (q) => {
    fs.writeFileSync("./" + prjName + "/main.js", q);
    progress("  GET packages.js");
    httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/base/packages.js", step2 );  
  };

  progress("  GET main.js");
  httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/base/main.js", step1 );
 

} else if (process.argv.length == 5 && process.argv[2] == "add" && process.argv[3] == "comp") {

  console.log("add component...");

  let compName = process.argv[4];
  compName = capitalizeFirstLetter(compName);
  const compFileName = "./components/" + compName + ".js";

  if (fs.existsSync(compFileName)) {
    process.stderr.write(FgRed + "the component is already exists.");
    process.exit();
  };

  if (! fs.existsSync("./components")) {
    process.stderr.write(FgRed + "project or path is not exists\ncheck the path");
    process.exit();    
  }
  if (! fs.existsSync("./snowfall")) {
    process.stderr.write(FgRed + "project or path is not exists\ncheck the path");
    process.exit();    
  }


  step2 = () => {
    // 
    progress("  CHANGE packages.js");
    let q = fs.readFileSync("./packages.js", {encoding:'utf8', flag:'r'});
    if (q.indexOf("const injects = [\n];") > -1 || q.indexOf("const injects = [\r\n];") > -1) {
      q = q.replace("const injects = [", "const injects = [\n" + "  \"" + compName + "\"\n");
    } else {
      q = q.replace("const injects = [", "const injects = [\n" + "  \"" + compName + "\" ,\n");
    }
    fs.writeFileSync("./packages.js", q);
    console.log(FgGreen + "done.");
    process.exit();
  };

  step1 = (q) => {
    progress("  CHANGE component");
    q = q.replace("Home", compName).replace('"Page title"', '"'+compName+'"');
    fs.writeFileSync(compFileName, q);
    step2();    
  };

  progress("  GET component");
  httpsGet("https://raw.githubusercontent.com/gelleicsaba/snowfall/main/base/home.js", step1 );


} else if (process.argv.length == 6 && process.argv[2] == "add" && process.argv[3] == "route") {

  console.log("add route to component...");

  if (process.argv[4].indexOf(":/") > -1) {
    process.stderr.write(FgRed + "Use // instead of /");
    process.exit();
  }

  let routeName = process.argv[4].replace("//","/");
  let compName = process.argv[5];
  compName = capitalizeFirstLetter(compName);  

  if (routeName[0] != '/') {
    routeName = "/" + routeName;
  }

  if (! fs.existsSync("./components")) {
    process.stderr.write(FgRed + "project or path is not exists\ncheck the path");
    process.exit();    
  }
  if (! fs.existsSync("./snowfall")) {
    process.stderr.write(FgRed + "project or path is not exists\ncheck the path");
    process.exit();    
  }

  let p = fs.readFileSync("./packages.js", {encoding:'utf8', flag:'r'});
  if (p.indexOf('"' + compName + '"') == -1) {
    process.stderr.write(FgRed + "component not found\ncheck it in the package.js");
    process.exit();    
  }

  progress("  CHANGE routes.js");
  let q = fs.readFileSync("./routes.js", {encoding:'utf8', flag:'r'});  

  if (q.indexOf("\"" + routeName + "\"") > -1 || q.indexOf("'" + routeName + "'") > -1) {
    process.stderr.write(FgRed + "the route element is already exists.");
    process.exit();    
  }

  if (q.indexOf("    tree = {\n    }") > -1 || q.indexOf("    tree = {\r\n    }") > -1) {
    q = q.replace("    tree = {", "    tree = {\n" + "    \"" + routeName + "\": new " + compName + "(this)\n");
  } else {
    q = q.replace("    tree = {", "    tree = {\n" + "    \"" + routeName + "\": new " + compName + "(this) ,\n");
  }
  fs.writeFileSync("./routes.js", q);

  console.log(FgGreen + "done.");
  process.exit();  

} else {
  process.stderr.write(FgRed + "invalid command");
  process.exit();    
}
