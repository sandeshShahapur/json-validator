
import lexor from "./lexor.js";
import parser from "./parser.js";

// Global function to validate JSON string
window.validate_json = (string) => {
    console.log("Input JSON string: ", string);
    if (string === "") {
      throw new Error("Empty JSON string.");
    } else if (string.charAt(0) === "\"") {
      if (string.charAt(string.length - 1) !== "\"") {
        throw new Error("Root JSON string not properly closed");
      }
      string = string.substring(1, string.length - 1);
    }

    let tokens = lexor(string);
    console.log("\n\nOutput tokens: ", tokens);

    let json = parser(tokens);
    console.log("\n\nOutput JSON: ", json);
}

export default validate_json;
