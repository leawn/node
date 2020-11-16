const NAME = 'Max';
const AGE = 29;

const person = {
    name: 'Max',
    age: 20
}

const toArray = (...args) => args;

const destructObj = ({ name }) => {
    console.log(name);
}

const { name, age } = person;
console.log(name, age);

console.log(toArray(1, 2, 3, 54, 52));

//console.log(NAME, AGE);