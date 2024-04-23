
import lexor from "./lexor.js";
import parser from "./parser.js";

window.validate_json = (string) => {
    console.log("Input JSON string: ", string);
    if (string === "") {
      throw new Error("Empty JSON string.");
    }

    let tokens = lexor(string);
    console.log("\n\nOutput tokens: ", tokens);

    let json = parser(tokens);
    console.log("\n\nOutput JSON: ", json);
}

export default validate_json;
