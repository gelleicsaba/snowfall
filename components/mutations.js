class Mutatations extends SFComponent {

    constructor(obj) { super(obj); }

    title="Binding mutations";

    state = {
        myInputValue: { value: undefined}
        , factorial: { value: undefined}
    };

    template = 
`:Div
    @navbar:
    @Br:
    :Div class="hint"
        Binding input value to variable @Br:
    :Div
        :Form
            :Input id="myInput" type="text" value="" :bind=myInputValue /
            @Br:@Br:
            The {{myInputValue}} factorial is {{factorial}}.
`;

    mutatations = {
        "myInputValue": (value) => {
            const fact = (x) => {
                if (x==0 || isNaN(x)) return 1;
                return x * fact(x-1);
            };
            const factValue = fact(parseInt(value));
            this.state.factorial.value = factValue;
            return value;
        }
    };

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
    }

    start() {
        super.start();
        const t = this;

        /* add input bindings */
        const initValue = "1";
        t.state.myInputValue = t.addBinding("myInputValue", initValue, "myInput", "value");
        t.state.factorial = t.addBinding("factorial", initValue);
        t.listenBindings();
    }
        
}
