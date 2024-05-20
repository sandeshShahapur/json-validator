
import lexor from "./lexor.js";
import parser from "./parser.js";

window.validate_json = (json_string) => {
    console.log("Input JSON string: ", json_string);
    if (json_string === "") throw new Error("Empty JSON string.");

    let tokens = lexor(json_string);
    console.log("\n\nOutput tokens: ", tokens);

    let json = parser(tokens);
    console.log("\n\nOutput JSON: ", json);
}

export default validate_json;
