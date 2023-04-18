class SFElementTree {

    constructor(control) {
        this.control = control;
    }


    build() {
        const t = this;
        const tabs = t.control.tabs;
        t.tabs = tabs;
        const template = t.control.template.replace(/\t/g, ' ');
        const classes = t.control.classes;
        const state = t.control.state;
        t.expl = template.split("\n");
        while (t.checkForCycles()) {};
        t.elements = Array(t.expl.length);
        for (let x = 0; x < t.elements.length; ++x) {
            t.elements[x] = { name: "", lvl: -1, props: "", next: [], selfClosed: false };
        }
        let crlvl = 0;
        for (let x = 0; x < t.expl.length; ++x) {
            let st = t.expl[x];
            // check distance level
            crlvl = -1;
            for (let y = 0; y < st.length; ++y) {
                if (st[y] != ' ') {
                    
                    if (st[y] == ':') {
                        let props = st.trim().split(' ');
                        t.elements[x].name = props[0];
                        let tmp = '';
                        for (let z = 1; z < props.length; ++z) {
                            if (props[z] == '/') {
                                t.elements[x].selfClosed = true;
                                continue;
                            } else if (props[z][0] == ':') {
                                if (props[z].substring(1,7) == 'click=') {
                                    let route = props[z].split("=")[1].replace(/\"/g,"").replace(/\'/g,"");
                                    props[z] = 'onclick="main.changeRoute(\'' + route + '\')"';
                                } else if (props[z].substring(1,6) == 'bind=') {
                                    let route = props[z].split("=")[1].replace(/\"/g,"").replace(/\'/g,"");
                                    props[z] = 'oninput="main.page.bind(\'' + route + '\')"';
                                }

                            }
                            if (z > 1) {
                                tmp += ' ' + props[z];
                            } else {
                                tmp += props[z];
                            }
                        }
                        t.elements[x].props = tmp;
                        t.elements[x].lvl = y;
                    } else {
                        t.elements[x].name = st.trim();
                        t.elements[x].props = "";
                        t.elements[x].lvl = y;
                    }
                    crlvl = y - tabs;
                    break;
                }

            }
            if (crlvl > -1) {
                for (let y = x-1; y >= 0; --y) {
                    if (t.elements[y].lvl == crlvl) {
                        t.elements[y].next.push(x);
                        break;
                    }
                }
            }
        }
        let classes2 = classes.split("\n");
        t.output = '<style>';
        for (let z = 0; z < classes2.length; ++z) {
            t.output += classes2[z].trim();
        }
        t.output += classes + '</style>';
        t.preorder(0);
        for (let name in state) {
            const value = state[name];
            if (! Array.isArray(value)) {
                const re = new RegExp('@'+name+':', 'g');
                t.output = t.output.replace(re, value);
                const re2 = new RegExp('{{'+name+'}}', 'g');
                t.output = t.output.replace(re2, "<label class=\"."+name+"SnwFl\"></label>");
            } else {
                const re = new RegExp('@@'+name+':', 'g');
                let arrvalue = '';
                value.forEach((item) => {
                    arrvalue += item;    
                });
                t.output = t.output.replace(re, arrvalue);
                
            }
        }



    }

    preorder(ix) {
        const item = this.elements[ix];
        let sldName = undefined;
        if (item.next.length > 0 || item.selfClosed) {
            sldName = item.name.slice(1).toLowerCase();
            this.output += '<' + sldName;
            if (item.props.length == 0) {
                this.output += '>';
            } else {
                this.output += ' ' + item.props + '>';
            }
        } else {
            this.output += item.name;
            return;
        }
        for (let x = 0; x < item.next.length; ++x) {
            this.preorder(item.next[x]);
        }
        if (item.next.length > 0 || item.selfClosed) {
            this.output += '</' + sldName + '>';
        }
    }


    checkForCycles() {
        const t = this;
        let objname = "";
        for (let x = 0; x < t.expl.length; ++x) {
            const tl = t.expl[x].trim();
            if (tl.length > 0 && tl[0] == '#') {
                if (tl.startsWith("#foreach ")) {
                    /* search for the end of the block */
                    objname = tl.split(' ')[1];
                    let blocklvl = -1;
                    for (let y = 0; y < t.expl[x].length; ++y) {
                        if (t.expl[x][y] != ' ') {
                            blocklvl = y;
                            break;
                        }
                    }
                    let blockStart = x;
                    let blockEnd = t.expl.length;
                    let stop = false;
                    for (let y = x + 1; y < t.expl.length; ++y) {
                        for (let z = 0; z < t.expl[y].length; ++z) {
                            if (t.expl[y][z] != ' ') {
                                const lvl = z;
                                if (lvl > blocklvl) {
                                    blockEnd = y;
                                } else {
                                    stop = true;
                                }
                                break;
                            }
                        }
                        if (stop) {
                            break;
                        }
                    }

                    const obj = t.control.state[objname];
                    if (obj.length == 0) {
                        t.expl[x-1] += " /"; // close the empty block
                    }
                    const head = t.expl.slice(0 , blockStart);
                    const foot = t.expl.slice(blockEnd+1);
                    const block = t.expl.slice(blockStart+1, blockEnd+1);
                    for (let y = 0; y < block.length; ++y) {
                        block[y] = block[y].slice(t.tabs);
                    }
                    
                    let blocks = [];
                    let nn = 0;

                    obj.forEach((myObject) => {
                        let clone = [].concat(block);
                        if (typeof myObject === 'object' && ! Array.isArray(myObject) ) {
                            for (let propertyName in myObject) {
                                for (let y = 0; y < clone.length; ++y) {
                                    const re = new RegExp('@'+ propertyName + ':', 'g');
                                    clone[y] = clone[y].replace(re, myObject[propertyName]);
                                }
                            }
                        } else {
                            const re = new RegExp('@value:', 'g');
                            const re2 = new RegExp('@index:', 'g');
                            for (let y = 0; y < clone.length; ++y) {
                                clone[y] = clone[y].replace(re, myObject);
                                clone[y] = clone[y].replace(re2, nn+1);
                            }
                        }
                        blocks = blocks.concat(clone);
                        ++nn;
                    });
                    t.expl = head.concat(blocks).concat(foot);
                    return true;
                } else if (tl.startsWith("#if ")) {
                    objname = tl.split(' ')[1];

                    let blocklvl = -1;
                    for (let y = 0; y < t.expl[x].length; ++y) {
                        if (t.expl[x][y] != ' ') {
                            blocklvl = y;
                            break;
                        }
                    }
                    let blockStart = x;
                    let blockEnd = t.expl.length;
                    let stop = false;
                    for (let y = x + 1; y < t.expl.length; ++y) {
                        for (let z = 0; z < t.expl[y].length; ++z) {
                            if (t.expl[y][z] != ' ') {
                                const lvl = z;
                                if (lvl > blocklvl) {
                                    blockEnd = y;
                                } else {
                                    stop = true;
                                }
                                break;
                            }
                        }
                        if (stop) {
                            break;
                        }
                    }
                    const head = t.expl.slice(0 , blockStart);
                    const foot = t.expl.slice(blockEnd+1);
                    const block = t.expl.slice(blockStart+1, blockEnd+1);
                    for (let y = 0; y < block.length; ++y) {
                        block[y] = block[y].slice(t.tabs);
                    }
                    const obj = t.control.state[objname];
                    let cc = head;
                    if (obj) {
                        cc = cc.concat(block).concat(foot);
                    } else {
                        cc = cc.concat(foot);
                    }
                    t.expl = cc;
                    return true;
                } else if (tl.startsWith("#else ")) {
                    objname = tl.split(' ')[1];

                    let blocklvl = -1;
                    for (let y = 0; y < t.expl[x].length; ++y) {
                        if (t.expl[x][y] != ' ') {
                            blocklvl = y;
                            break;
                        }
                    }
                    let blockStart = x;
                    let blockEnd = t.expl.length;
                    let stop = false;
                    for (let y = x + 1; y < t.expl.length; ++y) {
                        for (let z = 0; z < t.expl[y].length; ++z) {
                            if (t.expl[y][z] != ' ') {
                                const lvl = z;
                                if (lvl > blocklvl) {
                                    blockEnd = y;
                                } else {
                                    stop = true;
                                }
                                break;
                            }
                        }
                        if (stop) {
                            break;
                        }
                    }
                    const head = t.expl.slice(0 , blockStart);
                    const foot = t.expl.slice(blockEnd+1);
                    const block = t.expl.slice(blockStart+1, blockEnd+1);
                    for (let y = 0; y < block.length; ++y) {
                        block[y] = block[y].slice(t.tabs);
                    }
                    const obj = t.control.state[objname];
                    let cc = head;
                    if (! obj) {
                        cc = cc.concat(block).concat(foot);
                    } else {
                        cc = cc.concat(foot);
                    }
                    t.expl = cc;
                    return true;
                } else if (tl.startsWith("#component ")) {

                    let spaces = "";
                    for (let y = 0; y < t.expl[x].length; ++y) {
                        if (t.expl[x][y] != ' ') {
                            break;
                        }
                        spaces += ' ';
                    }

                    let tokens = tl.split(" ");
                    let name = tokens[1];
                    let objstr = "";
                    for (let z = 2; z < tokens.length; ++z) {
                        objstr += tokens[z];
                    }

                    let state = t.control.state;
                    if (objstr.indexOf("@") > -1 && objstr.indexOf(":")) {
                        for (let name in state) {
                            const value = state[name];
                            if (! Array.isArray(value)) {
                                const re = new RegExp('@'+name+':', 'g');
                                objstr = objstr.replace(re, "'" + value + "'");
                            } else {   
                                const re = new RegExp('@@'+name+':', 'g');
                                let arrvalue = '[';
                                let first = true;
                                value.forEach((item) => {
                                    if (! first) {
                                        arrvalue += ',';
                                        first = false;
                                    }
                                    arrvalue += "'" + item + "'";
                                });                                
                                objstr = objstr.replace(re, arrvalue + ']');
                            }
                        }
                    }
            
                    let obj = eval("(() => { const obj = new " + name + "([]); obj.state = " + objstr + "; return obj; })()");
                    t.expl[x] = spaces + obj.output();
                }




            }
        }
        return false;
    }
}
