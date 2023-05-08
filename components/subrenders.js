class SubRenders extends SFComponent {

    title = "Rendering subcomponents";

    classes = ``;

    template = 
`:Div 
    @navbar:
    @Br:
    @Br:
    :Div class="hint"
        Rendering sub-components:
    :Div
        @subComponent1:
        @subComponent2:
`;

    constructor(obj) { 
        globals.counter = 1;
        super(obj);
    }

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
        t.$.subComponent1 = t.getSubComponent({greetings:"Hi", name:"Joe"});
        t.$.subComponent2 = t.getSubComponent({greetings:"Astalavista", name:"Baby"});
    }

    getSubComponent(params) {

        class SubComponent extends SFComponent {
            constructor(obj) { super(obj); }
            state = params;
            title = null;
            classes = 
`.another-style { 
    color: blue;
    background-color: lightgreen;
    font-size: 28px;
    margin: 20px 20px 20px 20px;
    padding: 20px 20px 20px 20px;
    text-align: center;
}`
            template = 
`:Div class="another-style"
    @greetings: @name:!`;
        }

        return (new SubComponent()).output();
    }    


}
