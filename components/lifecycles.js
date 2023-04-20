class Lifecycles extends SFComponent {
    constructor(obj) { 
        super(obj); 
        this.state.lfc.push("constructor() performed");
    }

    state = {
        lfc : []
    };

    classes = 
`
.lf {
    font-size: 18px;
    margin: 10px 10px 10px 10px;
    padding: 20px 10px 10px 50px;
    width: 1200px;
    height: 30px;
    /*text-align: center;*/
    border-radius: 15px;
}
.create-lf {
    background-color: red;
    color: white;
}
.load-lf {
    background-color: green;
    color: yellow;
}
.render-lf {
    background-color: blue;
    color: white;
}
.eval-lf {
    background-color: cyan;
    color: red;
}
.start-lf {
    background-color: coral;
    color: blue;
}
.final-lf {
    background-color: yellow;
    color: black;
}
`;

    template = 
`:Div
    @navbar:
    @Br:
    :Div class="hint"
        Component lifecycles
    @Br:
    @Br:
    :Div class="lf create-lf"
        create(): It performs after constructor. The create calls "load" and "render" too in superclass.
    :Div class="lf load-lf"
        load(): Its called by create. It runs only once! (It's an empty method in superclass, but you can override it)
    :Div class="lf eval-lf"
        evaluate(): Its called by render as first step. (It's an empty method in superclass, but you can override it)
    :Div class="lf render-lf"
        render(): Its called by create, but you can turn off the automation with the "autorender" property. This function will make the html & replace vars/bindings, etc...
    :Div class="lf start-lf"
        start(): Its called by render as final step. You can set up here the final operations.
    :Div class="lf final-lf"
        final(): Its called when you change the route. It stops the intervals and clears the data bindings.

    @Br:
    @Br:
    :Div class="hint"
        The lifecycle log.
    :Ul
        #foreach lfc
            :Li
                @index:. @value:  

`;

    create() {
        this.state.lfc.push("create() starts");
        super.create();
        this.state.lfc.push("create() ends");
    }

    render() {
        this.state.lfc.push("render() starts");
        super.render();
        this.state.lfc.push("render() ends");
    }

    load() {
        this.state.lfc.push("load() starts");
        super.load();
        this.state.lfc.push("load() ends");
    }

    start() {
        this.state.lfc.push("start() starts");
        super.start();                
        setTimeout(() => {
            this.nextThick((q) => {
                this.state.lfc.push("start() ends");
                this.state.lfc.push("nextThick() called");
            });
        }, 250);
        
    }

    evaluate() {
        this.state.lfc.push("evaluate() starts");
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
        this.state.lfc.push("evaluate() ends");
    }

    final() {
        this.state.lfc = [];
        super.final();
        alert("Lifecycle log:\nThe 'final' function has been performed.")
    }


}
