// Variables JS

// SCOPES
// Globals
var variable1; // SE VE EN TODO EL PROYECTO
const varibale2 = 1; // SE VE SOLO EN EL CONTEXTO EN EL QUE FUE DEFINIDA;
let variable3 = 3;

// Clases
const Persona = (nombre, apellido, dni) => {
    const nombre = nombre;

    function hablar() { // metodo
        console.log("HOLA MI NOMBRE ES: ", this.nombre, this.apellido);
    }

    function garchar(persona) {
        persona.gemir();
        this.gemir();
    }

    function grita() { // metodo
        this.hablar();
        console.log("AAAAAAH!!!!");
    }

}


class Persona {
    constructor(nombre, apellido, dni) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
    }

    hablar() { // metodo
        console.log("HOLA MI NOMBRE ES: ", this.nombre, this.apellido);
    }

    garchar(persona) {
        persona.gemir();
        this.gemir();
    }

    grita() { // metodo
        this.hablar();
        console.log("AAAAAAH!!!!");
    }

    static nacer(name, surname) { // Metodo de clase
        return new Persona(name, surname, null);
    }

    static garchar(persona, persona2)
}

// CLASS -> OBJECT -> ENTITY

const sofia = new Persona("Sofia", "Viera", "39211246");
const facu = Persona.nacer("Facundo", "Perez");

sofia.garchar(facu);
sofia.grita();

facu.hablar();

Persona.garchar(sofia, facu);

// Functions

// Anonimas
() => {
    console.log("Soy anonima.");
}

function division(param1, params2) {
    // body

    return param1 / params2;
}

const mul = (param1, param2) => {
    return param1 * param2;
}

const operacion = (param1, param2, callback) => {
    return callback(param1, param2);
}

division(1, 2);
mul(3, 5);
operacion(1, 2, mul);



// op

if (true)
switch(true) {
    case 1 === 1:
    case 1 !== 1:
        break;
    default:       
}

for(i = 0; i<= 10; i++) {
    // body
}

while(true) {
    // body
}


do {
    // boyd
} while(1 !== 1);

// op logicos

&& -> true && false -> false
|| -> true || false -> true