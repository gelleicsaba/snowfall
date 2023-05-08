class Calculator extends SFComponent {

    title = "Calculator";

    state = {
        result: "0"
    };

    MAX = () => { return 17; }
    MAX_FRACTIONS = () => { return 12; }
    ERROR = "ERROR";

    C_STATE = () => {
        return {
            dot: false
            , rewrite: false
            , instructions: []
            , preBtn: ''
        };
    }   

    objState = this.C_STATE();

    classes =
`
.table {
    width: 500px;
}
.result {
    width: 100%;
    border-width: 1px 1px 1px 1px;
    border-style: solid;
    height: 30px;
    margin: 5px 5px 5px 5px;
    padding: 2px 5px 2px 8px;
    text-align: right;
    font-family: Courier New, monospace;
    font-size: 16px;
}
.tr {
    vertical-align: middle;
    padding: 0;
}
.td {
    text-align: center;
    padding: 0;
}
.input {
    width: 50px;
    height: 50px;
    text-align: center;
}
.op {
    font-weight: bolder; 
}
.table-calc {
    margin: 50px 50px 50px 50px;
    border-collapse: collapse;
}
`;

    template = 
`:Div
    @navbar:
    :Table class="table-calc"
        :Tr
            :Td colspan="4" class="result"
                @result:
        :Tr class="tr"
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('C')" value="C" class="input op" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('CE')" value="CE" class="input op" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('<')" value="&lArr;" class="input op" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('/')" value="÷" class="input op" /
        :Tr class="tr"
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('7')" value="7" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('8')" value="8" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('9')" value="9" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('*')" value="×" class="input op" /
        :Tr class="tr"
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('4')" value="4" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('5')" value="5" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('6')" value="6" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('+')" value="+" class="input op" /
        :Tr class="tr"
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('1')" value="1" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('2')" value="2" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('3')" value="3" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('-')" value="-" class="input op" /
        :Tr class="tr"
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('+-')" value="+/-" class="input op" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('0')" value="0" class="input" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('.')" value="." class="input op" /
            :Td class="td"
                :Input type="button" onclick="@page:.pushBtn('=')" value="=" class="input op" /
    @Br:
    @Br:
`;

    constructor(obj) { 
        super(obj);
    }

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
    }



    pushBtn(btn) {
        window.event.preventDefault();        
        const t = this;
        let isNum = btn >= '0' && btn <= '9';

        if (! isNum && t.objState.preBtn == btn && btn != '+-' && btn != '<') {
            // skip redundant operators
            return;
        }
        if (isNum && (t.$.result.length < t.MAX() || t.objState.rewrite) ) {
            if (t.objState.rewrite) {
                // rewrite the previous result value
                t.$.result = '0';
                t.objState.rewrite = false;
            }
            if (t.$.result == '0') {
                t.nextThick((q) => { t.$.result = btn; });
            } else {
                t.nextThick((q) => { t.$.result = t.$.result + btn; });
            }
        } else if (btn == '.' && t.$.result.length < t.MAX()) {
            if (! t.objState.dot) {
                t.nextThick((q) => { 
                    t.objState.dot = true;
                    t.$.result = t.$.result + btn; 
                });
            }
        } else if (btn == '<' && t.$.result.length > 0) {
            t.nextThick((q) => { 
                t.$.result = t.$.result.substring(0, t.$.result.length - 1);
                if (t.$.result == '') {
                    t.$.result = "0";
                } else {
                    if (t.$.result[t.$.result.length - 1] == '.') {
                        t.$.result = t.$.result.substring(0, t.$.result.length - 1);
                        t.objState.dot = false;
                    }
                }
            });
        } else if (btn == '+' || btn == '-' || btn == '*' || btn == '/') {
            t.nextThick((q) => {
                if (t.objState.instructions.length != 1) {
                    t.objState.instructions.push(t.$.result);
                }                
                t.objState.instructions.push(btn);
                t.calculate();
                t.objState.rewrite = true;
                t.objState.dot = false;
            });
        } else if (btn == '=') {
            if (t.objState.instructions.length > 0) {
                t.nextThick((q) => {
                    t.objState.instructions.push(t.$.result);
                    t.objState.instructions.push("=");
                    t.calculate();
                    t.objState.rewrite = true;
                    t.objState.instructions = [];
                    t.objState.instructions.push(t.$.result);
                    t.objState.dot = false;
                });
            }
        } else if (btn == "C") {
            t.nextThick((q) => {
                t.objState = t.C_STATE();
                t.$.result = "0";
            });
        } else if (btn == "CE") {
            t.nextThick((q) => {
                t.$.result = "0";
                t.objState.rewrite = false;
                t.objState.dot = false;
            });
        } else if (btn == "+-") {
            t.nextThick((q) => {

                if (t.$.result != 0.0) {
                    t.$.result = -t.$.result;
                }   

                t.objState.rewrite = false;
                t.objState.dot = false;
            });
        }

        t.objState.preBtn = btn;

    }

    calculate() {
        const frac = (f) => {
            return f % 1;
        }
        const trimEnd0 = (s) => { return s.replace(/0+$/, ''); }

        const t = this;
        let instructions = t.objState.instructions;
        let num = 0.0;
        let op = '';

        for (let x = 0; x < instructions.length; ++x) {
            if (instructions[x] == t.ERROR) {
                t.$.result = "ERROR";
                return;
            } else if (instructions[x] == "+" || instructions[x] == "-" || instructions[x] == "*" || instructions[x] == "/" || instructions[x] == "=")  {
                op = instructions[x];
            } else {
                switch (op) {
                    case "+":
                        num += parseFloat(instructions[x]);
                        break;
                    case "-":
                        num -= parseFloat(instructions[x]);
                        break;
                    case "*":
                        num = num * parseFloat(instructions[x]);
                        break;
                    case "/":
                        if (parseFloat(instructions[x]) == 0.0) {
                            t.$.result = t.ERROR;
                            return;
                        }
                        num = num / parseFloat(instructions[x]);
                        break;
                    case "":
                        num = parseFloat(instructions[x]);
                        break;
                    case "=":
                        break;
                }
                //
            }

        }
        if (frac(num) == 0) {
            t.$.result = num.toFixed(0).substring(0, t.MAX());
        } else {
            t.$.result = trimEnd0(num.toFixed(t.MAX_FRACTIONS())); //.substring(0, t.MAX());
        }
    }



}