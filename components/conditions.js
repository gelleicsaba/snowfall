class Conditions extends SFComponent {

    title="Conditions";

    classes = ``;

    template = 
`:Div 
    @navbar:
    @Br:
    @Br:
    :Div class="hint"
        Conditions & events:
    :Div
        :Form
            :Input type="button" onclick="@page:.incCounter()" value="INCREASE COUNTER" /
            :Input type="button" onclick="@page:.decCounter()" value="DECREASE COUNTER" /
    @Br:
        Conditional statements (if/else): @Br:
        #if counterIsOdd
            The @counter: is an Odd number. @Br:
        #else counterIsOdd
            The @counter: is an Even number. @Br:
        #if counterIsPrime
            The @counter: is a Prime number. @Br:
        #else counterIsPrime
            The @counter: is NOT a Prime number. @Br:
    @Br:
`;

    constructor(obj) { 
        globals.counter = 1;
        super(obj);
    }

    render() {
        super.render();
    }

    evaluate() {
        super.evaluate();
        const t = this;
        t.$.navbar = (new Navbar(t.$r)).output();
        t.$.counter = globals.counter;
        t.$.counterIsPrime = t.isPrimeNumber(globals.counter);
        t.$.counterIsOdd = globals.counter % 2 == 1;
    }

    incCounter() {
        const t = this;
        t.nextThick(() => {
            if (globals.counter < 100) {
                globals.counter = globals.counter + 1;
                return true;
            }
            return false;
        });
    }

    decCounter() {
        const t = this;
        t.nextThick(() => {
            if (globals.counter > 1) {
                globals.counter = globals.counter - 1;
                return true;
            } else {
                return false; // doesn't need rendering
            }
        });
    }

    isPrimeNumber(num) {
        if (num >= 1 && num <= 3) return true;
        for (let x = 2; x < num-1; ++x) {
            if (num % x == 0) {
                return false;
            }
        }
        return true;
    }

}
