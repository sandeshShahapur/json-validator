
import lexor from "./lexor.js";
import parser from "./parser.js";

window.validate_json = (string) => {
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

export default validate_json;
