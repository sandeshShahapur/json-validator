const lexor = require("./lexor.js");

let string = "";

let validate_json = (string) => {
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

    console.log(tokens);
    return true;
}

console.log(validate_json(string));