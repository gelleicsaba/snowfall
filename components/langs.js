class Langs extends SFComponent {

    title = "Languages";

    state = {
        tableData : [ 
            { id: 1, name: "John", wage: "1200€" }
            , { id: 2, name: "Erika", wage: "1100€" }
        ]
    }

    classes = 
`.langs-th {
    width: 33%; background-color: #fdfdff
}
.langs-table {
    width: 100%
}
`

    template = 
`:Div
    @navbar:
    @Br:
    @Br:
    @Br:
    :Div
        :A onclick="@page:.changeLang('en')" href="#"
            ENGLISH
        @Space:|@Space:
        :A onclick="@page:.changeLang('de')" href="#"
            DEUTCH
        @Br:
    :Div
        :H2
            @~hello-world:
        @Br:
        :H3
            @~words:
        @Br:
        :H4
            @~time:
        @Br:
        :Table border="1" class="langs-table"
            :Thead
                :Tr
                    #foreach ~header
                        :Th class="langs-th"
                            @value:
            :Tbody
                #foreach tableData
                    :Tr
                        :Td
                            @id:
                        :Td
                            @name:
                        :Td
                            @wage:
`;

    create() {
        const d = new Date();
        const t = this;        
        t.state.theTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();        
        super.create();
    }

    render() {
        super.render();
    }

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
        t.setLangResource("time", String.format(t.getLangResource("time"), t.$.theTime));
    }

    changeLang(lang) {
        const t = this;
        t.nextThick(() => {
            super.changeLang(lang);
        });
    }

}
