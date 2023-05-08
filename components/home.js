class Home extends SFComponent {

    title = "Home";

    template = 
`:Div
    @navbar:
`;

    render() {
        super.render();
    }

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
    }

}
