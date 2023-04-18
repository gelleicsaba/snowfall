class Home extends SFComponent {

    template = 
`:Div
    @navbar:
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
    }

}
