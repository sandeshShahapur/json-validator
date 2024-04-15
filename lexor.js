const JSON_QUOTE = '"',
      JSON_TRUE = 'true',
      JSON_FALSE = 'false',
      JSON_NULL = 'null';

const JSON_SYNTAX = [',', ':', '{', '}', '[', ']'];
const WHITESPACE = [" ", "\t", "\n", "\r", "\0"];

lexor = (string) => {
    let tokens = [];
    while (string.length > 0) {
        console.log("current string: ", string);

        let json_string = null;
        [json_string, string] = lex_string(string);
        if (json_string !== null) {
            tokens.push(json_string);
            continue;
        }

        let json_bool = null;
        [json_bool, string] = lex_bool(string);
        if (json_bool !== null) {
            tokens.push(json_bool);
            continue;
        }

        let json_null = null;
        [json_null, string] = lex_null(string);
        if (json_null) {
            tokens.push(null);
            continue;
        }

        let json_number = null;
        [json_number, string] = lex_number(string);
        if (json_number !== null) {
            tokens.push(json_number);
            continue;
        }

        char = string.charAt(0);
        if (WHITESPACE.includes(char)) {
            string = string.substring(1);
        } else if (JSON_SYNTAX.includes(char)) {
            tokens.push(char);
            string = string.substring(1);
        } else {
            throw new Error("Unexpected character.");
        }
    }
    return tokens;
}

lex_string = (string) => {
    if (string.charAt(0) !== JSON_QUOTE)
        return [null, string];

    string = string.substring(1);
    let json_string = "";

    for (const char of string) {
        if (char === JSON_QUOTE) {
            return [json_string, string.substring(json_string.length + 1)];
        } else {
            json_string += char;
        }
    }

    throw new Error("Expected end-of-string quote.");
}

lex_bool = (string) => {
    if (string.startsWith(JSON_TRUE)) {
        return [true, string.substring(JSON_TRUE.length)];
    } else if (string.startsWith(JSON_FALSE)) {
        return [false, string.substring(JSON_FALSE.length)];
    } else {
        return [null, string];
    }
}

lex_null = (string) => {
    if (string.startsWith(JSON_NULL)) {
        return [true, string.substring(JSON_NULL.length)];
    } else {
        return [null, string];
    }
}

/**
 * JSON number specifications:
 * - Leading zeros are not allowed. (in javascript octal numbers begin with 0, but JSON does not support octal numbers)
 * - A number cannot have leading plus sign.
 * - A number cannot have leading exponent.
 * - Exonents can have leading zeros.
 */
lex_number = (string) => {
    let number = "";
    let is_float = false;
    let is_exponential = false;

    for (const char of string) {
        if (char === "+") {
            if (number === "")
                throw new Error("Number cannot have leading plus sign.");
            else if (number.charAt(number.length - 1) !== 'e' && number.charAt(number.length - 1) !== 'E')
                throw new Error("Missing exponent.");
            else
                number += char;
        } else if (char === "-") {
            if (number !== "" && (number.charAt(number.length - 1) !== 'e' && number.charAt(number.length - 1) !== 'E')) {
                throw new Error("Minus sign can only appear at the beginning of a number or after an exponent.");
            }
            number += char;
        } else if (char === ".") {
            if (is_float) {
                throw new Error("Number cannot have multiple decimal points.");
            } else {
                is_float = true;
                number += char;
            }
        } else if (char.toLowerCase() === "e") {
            if (number === "") {
                throw new Error("Number cannot have leading exponent.");
            } else if (is_exponential) {
                throw new Error("Number cannot have multiple exponents.");
            } else {
                is_exponential = true;
                number += char;
            }
        } else if (char.match(/[0-9]/)) {
            if (number === "0") {
                throw new Error("Number cannot have leading zeros.");
            } else {
                number += char;
            }
        } else {
            break;
        }
    }

    if (number === "") {
        return [null, string];
    } else if (is_float) {
        return [parseFloat(number), string.substring(number.length)];
    } else {
        return [parseInt(number), string.substring(number.length)];
    }
}
module.exports = lexor;