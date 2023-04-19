# **Snowfall**

## 01. What's this
This a funny vanilla js framework, very easy and simple, and very beta version.   
Why the name is snowfall? There was a snow falling when i started this in april.   
Inspiring things: yaml, python, VueJs

## 02. Files

main.css -> common css   
packages.js -> js,css,cdn includes & meta settings   
routes.js -> routes   
main.js -> starting page component   
snowfall/component.js -> template component superclass   
snowfall/page.js -> page factory & route manager
snowfall/component.js -> template component superclass
snowfall/tree.js -> template rendering   

## 03. Components

You can create a component, and you can use it as page or subcomponent.
Every components must be extends the 'SFComponent' class.   

There are three main parts in a component.   
* state
* template and css
* superclass expansions (e.g. render() function)

A simple component code:
```
class Home extends SFComponent {

    state = { myVar: "World" };

    template = 
`:Div
    Hello @myVar:!
`;
}

```

## 04. Routes

You can create route paths and assign page comps to these. There are some route manager
functions. You can push or pop it, or you can load a page by giving the route path.

```
class Routes {
    ...
    tree = {
        '/' : new Home(this)
        , '/about' : new About(this)
    }
    ...
}
```
Change the routes.js, and give the routes in the tree object.

## 05. Simple replaces

You can give the template vars in your component here:
```
    ...
    state = { myVar: "Abc" };
    
    template = 
`:Div
    This is my variable - @myVar:
`;
```
There's no data binding here. Therefore you can call the nextThick() function if your var changed.

```
    this.nextThick(() => { 
        this.state.myVar = "Xyz";
        // you can give return false, if you need to cancel rendering
    });
```

## 06. Data bindings

You can use data-bindings in input elements, or a simple label.
An input element with binding in template:
```
    template = 
`:Div
    :Form
        :Input id="myInput" type="text" value="" :bind=myInputValue /
    :Div
        You typed {{myInputValue}}.
    ...
`

    start() {    
        const t = this;
        t.state.myInputValue = t.addBinding("myInputValue", "Initial Text", "myInput", "value");
        ...
    }
```
In that case you have to specify the variable name, initial value, input id, input prop name (e.g. "value")

In other case there's only simple label element that connect to the state var.
```
    template = 
`:Div
    Copy my text here {{myText}}
    @Br:
    and here {{myText}}
    ...

    start() {    
        const t = this;
        t.state.myText = t.addBinding("myText", "Initial text");
        t.listenBindings();
        ...
    }
```

## 07. Sub components & props

You can insert sub components to a page component with its properties.
Create a sub component that extends the same superclass (SFComponent).

```
class Car extends SFComponent {
    template = 
`:Div
    Car 
    @Br:
    Type: @type:
    @Br:
    Year: @year:
    @Br:
    Age: @age:
`
    evaluate() {
        super.evaluate();
        const t = this;
        t.state.age = 2023 - parseInt(t.state.year) + 1;
    }    
}
```
You can also use evaluate() function, if there are some other calculations.

In the container component, you can use the #component word with classname and props:
```
    template = 
`:Div
    :Div
        #component Car {type: "BMW", year: 2018}
        #component Car {type: "Honda", year: 2004}
`

```


## 08. Events

You can use ":click" on an input element and you can specify the route path to here.
```
    ...
    :Form
        :Input type="button" value="HOME" :click="/home" /
```
The ":click='/home'" is actually a shorter specification of the following definition:
```
        :Input ... onclick="main.changeRoute('/home')" ...
```

To specify other events, you can use this property definition:
```
    ...
    :Form
        :Input type="button" value="HOME" onclick="@page:.myEvent()" /
    ...
    
    myEvent() {
        window.event.preventDefault();
        console.log("Click event starts")
    }
```
## 09. Conditions & Loops

You can use if/else conditions in the tamplate with a prepared variable:
```
    state {
        myNum : 13
    };
    ...
    template = 
`:Div    
    #if myNumIsOdd
        The @myNum: is an Odd number. @Br:
    #else myNumIsOdd
        The @myNum: is an Even number. @Br:
    ...
    evaluate() {
        super.evaluate();
        this.state.myNumIsOdd = this.state.myNum % 2 != 0;
    }
```

In a loop cycle, you have to define an array or an object array. After that you can
use #foreach in template.

1. type is a simple array
```
    ...
    state={
        myArr: ["one", "two", "much", "plenty"]
    }

    template = 
`:Div
    Tribal counting:
    :Ul
        #foreach myArray
            :Li
                @index:. @value:
`
    ...
```

2. type is an object array
```
    ...
    state = {
        myObjArr: [
            { name: "grass", color: "green"}
            , { name: "sky", color: "blue"}
            , { name: "snow", color: "white"}
        ]
    };

    template = 
`:Div
    :Ul
        #foreach myObjArr
            :Li
                The :@name: is @color:.
`
    ...
```

3. type is a nested array

```
    ...
    state = {
        { name: "John Wick", cars: ["BMW", "Volkswagen"] }
        , { name: "Mr. Robot", cars: ["Toyota", "Honda"] }
        , { name: "Indiana Jones", cars: [ "Ford"] }
    };

    template = 
`:Div
    :Ul
        #foreach myObjArray
            :Li
                @name:
                @Br:
                Cars:
                    @carComponent:
`

    evaluate() {
        super.evaluate();
        this.renderCars();
    }

    renderCars() {
        const t = this;
        class CarComponent extends SFComponent {
            template = 
`:Ul
    #foreach cars
        :Li
            @value:`;
        }
        t.state.myObjArray.forEach((item) => {
            let carComponent = new CarComponent();
            carComponent.state.cars = item.cars;
            item.carComponent = carComponent.output();
        });
    }           
    ...
```

## 0A. Lifecycles

The functions can be found in snowfall/component.js, and you can view the lifecycle in here.


1. create(): It performs after constructor. The create calls "load" and "render" too in superclass.
1. load(): Its called by create. It runs only once! (It's an empty method in superclass, but you can override it)
1. evaluate(): Its called by render as first step. (It's an empty method in superclass, but you can override it)
1. render(): Its called by create, but you can turn off automation with "autorender" property. This function will make the html & replace vars/bindings, etc...
1. start(): Its called by render as final step. You can set up here the final operations.
1. final(): Its called when you change the route. It stops the intervals and clear data bindings.

