class ForeachLoops extends SFComponent {

    constructor(obj) { super(obj); }

    state = {
        myObjArray: [ 
            { name: "John Wick", phone: "100-JOHN", cars: [ { name:"BMW" }, { name:"Volkswagen"} ] }
            , { name: "The Satan", phone: "666", cars: [ { name:"Audi" } ] }
            , { name: "Mr. Robot", phone: "01001000110", cars: [ { name:"Toyota" } ] }
        ]
        , myArr: ["one", "two", "much", "plenty"]
    };

    template = 
`:Div
    @navbar:
    @Br:
    @Br:
    :Div class="hint"
        Foreach object array & get object values @Br:
    :Div
        :Ul
            #foreach myObjArray
                :Li
                    @name:
                    @Br:
                        :Ul
                            :Li
                                Phone: @phone: 
                            :Li
                                Cars:
                                @carComponent:

    :Div class="hint"
        Foreach an array & get index and value @Br:
    @Br:
    Tribal counting:
    :Ul
        #foreach myArr
            :Li
                @index:. @value:                                
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.navbar = (new Navbar(t.routes)).output();
        t.renderCars();       
    }

    renderCars() {
        const t = this;
        class CarComponent extends SFComponent {
            constructor(obj) { super(obj); }
            template = 
`:Ul
    #foreach cars
        :Li
            @name:`;
        }

        t.state.myObjArray.forEach((item) => {
            let carComponent = new CarComponent();
            carComponent.state.cars = item.cars;
            item.carComponent = carComponent.output();
        });
    }    
        
}
