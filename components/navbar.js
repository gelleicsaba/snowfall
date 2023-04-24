class Navbar extends SFComponent {
    constructor(obj) { super(obj); }

    title = null;

    state = {};

    classes = 
`.input-navbar {
    width: 300px;
    height: 80px;
    text-align: center;
}
.div-navbar {
    width: 95%;
    background-color: lightblue;
    padding: 20px 20px 20px 20px;
}
.a-navbar {
    background-color: lightgreen;
    color: green;
    font-decoration: none;    
}
.route-navbar {
    background-color: yellow;
    color: red;
    font-family: Courier New, monospace;
}
`;

    template = 
`:Div 
    :Div class="hint"
        Rendering a simple sub component:
    :Div class="div-navbar"
        :Form
            :Input type="button" :click="/" value="HOME" class="input-navbar" /
            :Input type="button" :click="/simple-vars" value="SIMPLE REPLACE" class="input-navbar" /
            :Input type="button" :click="/data-bindings" value="DATA BINDINGS" class="input-navbar" /
            :Input type="button" :click="/subcomponents" value="COMPONENTS & PROPS" class="input-navbar" /
            :Input type="button" :click="/foreloops" value="LOOPS" class="input-navbar" /            
            :Input type="button" :click="/conditions" value="CONDITIONS & EVENTS" class="input-navbar" /
            :Input type="button" :click="/subrenders" value="SUBCOMPONENT RENDERING" class="input-navbar" /
            :Input type="button" :click="/lifecycles" value="LIFECYCLES" class="input-navbar" /
            :Input type="button" :click="/mutations" value="MUTATIONS" class="input-navbar" /
            :Input type="button" :click="/calc" value="CALCULATOR" class="input-navbar" /
    :Div class="hint"
        Routes history & log: @Br:
    :Div
        :A onclick="main.stepBack()" href="#" class="a-navbar"
            &lArr;@Space:BACK
        @Space:@Space:
        :Div:
            #foreach routePath
                :Span class="route-navbar"
                    @value:
                @Space:@Space:
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.routePath = t.routes.routes;
    }


}
