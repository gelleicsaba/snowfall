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
        t.state.navbar = (new Navbar(t.routes)).output();
    }

}
