const util = require("util");
const lexor = require("./lexor.js");
const parser = require("./parser.js");


let string =
`{
    "name": "John Doe",
    "age": 30,
    "isStudent": false,
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "country": "USA",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    },
    "languages": ["JavaScript", "Python", "Java"],
    "friends": [
      {
        "name": "Alice",
        "age": 28,
        "isStudent": true
      },
      {
        "name": "Bob",
        "age": 32,
        "isStudent": false
      }
    ],
    "pets": {
      "dogs": [
        {
          "name": "Max",
          "breed": "Labrador",
          "age": 5
        },
        {
          "name": "Bella",
          "breed": "Golden Retriever",
          "age": 3
        }
      ],
      "cats": [
        {
          "name": "Simba",
          "breed": "Siamese",
          "age": 2
        },
        {
          "name": "Luna",
          "breed": "Persian",
          "age": 4
        }
      ]
    }
  }
  `

let validate_json = (string) => {
    console.log("Input JSON string: ", string);
    if (string === "") {
        return false;
    }

    let tokens;
    try {
        tokens = lexor(string);
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
    console.log("\n\nTokens produced: ", tokens);

    let json;
    try {
        json = parser(tokens);
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
    console.log("\n\nOutput JSON: ", json);
    return true;
}

console.log("Is the JSON valid:", validate_json(string))