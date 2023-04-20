class DataBindings extends SFComponent {

    constructor(obj) { super(obj); }

    title="Data bindings";

    state = {
        myInputValue: { value: undefined}
        , myText: { value: undefined}
    };

    template = 
`:Div
    @navbar:
    @Br:
    :Div class="hint"
        Binding input value to variable @Br:
    :Input id="myInput" type="text" value="" :bind=myInputValue /
    @Br:@Br:
    :Table cellspacing="10" cellpadding="10" border="1"
        :Tr
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
        :Tr
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
        :Tr
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
            :Td
                {{myInputValue}}
    @Br:
    @Br:
    :Div class="hint"
        Binding text element to variable
    @Br:
    :Div
        1: {{myText}}
        @Br:@Br:
        2: {{myText}}
        @Br:@Br:
        3: {{myText}}
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
    }

    start() {
        super.start();
        const t = this;

        /* add input bindings */
        t.state.myInputValue = t.addBinding("myInputValue", "My Text", "myInput", "value");
        t.state.myText = t.addBinding("myText", "Initial text");
        t.listenBindings();

        let myCounter = 1;
        const intvalFunc = () => {
            t.state.myText.value = myCounter.toString();
            ++ myCounter;
        }
        
        intvalFunc();
        let myIntval = setInterval(intvalFunc, 1000);
        this.intervals.push(myIntval);
    }
        
}
