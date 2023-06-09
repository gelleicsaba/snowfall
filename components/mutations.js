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
        Binding mutations @Br:
    :Div
        Factorial calculator: @Br:
        :Form
            :Input id="myInput" type="text" value="" :bind=myInputValue /
            @Br:@Br:
            The {{myInputValue}} factorial is {{factorial}}.
`;

    mutations = {
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
        t.$.navbar = (new Navbar(t.$r)).output();
    }

    start() {
        super.start();
        const t = this;

        /* add input bindings */
        const initValue = "1";
        t.$.myInputValue = t.addBinding("myInputValue", initValue, "myInput", "value");
        t.$.factorial = t.addBinding("factorial", initValue);
        t.listenBindings();
    }
        
}
