class Ress extends SFComponent {

    title = "Resources";

    template = 
`:Div
    @navbar:
    @Br:
    @Br:
    :Div class="hint"
        Resources like image, icons, texts etc...
    @Br:
    :Div class="hint"
        Use logical name, not physical path. like e.g.: img/hello  or  icon/add
    :Div
        :Img src="@=img/hello:" width="100" /
    :Div
        :Img src="@=img/os:" width="100" /
    :Div
        :Img src="@=icon/add:" width="50" /
    :Div
        :H3
            @=text/greeting:
        :H4
            @capitalGreeting:
            
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
        this.$.capitalGreeting = t.getResource("text/greeting").toUpperCase();

    }

}
