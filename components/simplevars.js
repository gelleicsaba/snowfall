class SimpleVars extends SFComponent {

    constructor(obj) { super(obj); }

    title = "Simple var replaces";

    state = {
        myVar: "World"
        , myText: ["Nice", " to", "@Br:", "meet", "@Br:", "you", "!"]
        , myEvalText: "Unknown time"
        , myNumber: 0
    };

    template = 
`:Div
    @navbar:
    @Br:
    @Br:
    :Div class="hint"
        Simple var replace. (No data-bindig)
    :Div
        HELLO @myVar:!
    @Br:
    @Br:
    :Div class="hint"
        Simple text array replace. (No data-bindig)
    :Div
        @@myText:
    @Br:
    @Br:
    :Div class="hint"
        Simple var replace with evaluation. (No data-bindig)
    :Div
        You got this at @myEvalText:.
        @Br:
        Your fortune number is @myNumber:.
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
                
        const d = new Date();
        const dt = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        
        t.state.myEvalText = dt;        
        t.state.myNumber = ~~(Math.random() * 45 + 1);
    }
        
}
