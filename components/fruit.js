class Fruit extends SFComponent {
    constructor(obj) { super(obj); }
    
    title = null;

    state = {};

    classes = 
`.fruit-style { 
background-color: lightblue;
font-size: 18px;
margin: 20px 20px 20px 20px;
padding: 20px 20px 20px 20px;
width: 160px;
height: 120px;
text-align: center;
border-radius: 25px;
float: left;
}`

    template = 
`:Div class="fruit-style"
    :Table cellpadding="5" cellspacing="0"
        :Tr
            :Td
                Name
            :Td
                @name:
        :Tr
            :Td
                Color
            :Td
                @color:
        :Tr
            :Td
                Price
            :Td
                @price:
        :Tr
            :Td
                Quantity
            :Td
                @qty:@unit:
`;

    evaluate() {
        super.evaluate();
        const t = this;
        t.state.price = (t.state.price * 378.0).toFixed(0);
    }

}
