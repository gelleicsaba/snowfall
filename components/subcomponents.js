class SubComponents extends SFComponent {

    constructor(obj) { super(obj); }

    title = "Components & properties";

    state = {};

    classes = 
`.about {
    color: green; 
    background-color: lightblue; 
    text-align: center;
}`;

    template = 
`:Div
    @navbar:
    @Br:
    :Div class="hint"
        Add components with props:
    :Div
        #component Fruit {name: "Apple", color: "Red", price: 1.0, qty: 1.0, unit: "kg"}
        #component Fruit {name: "Pear", color: "Green", price: 0.8, qty: 1.0, unit: "kg"}
        #component Fruit {name: "Banana", color: "Yellow", price: 0.75, qty: 500.0, unit: "g"}
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
    }
        
}
