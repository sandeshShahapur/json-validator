import {
    JSON_COMMA,
    JSON_COLON,
    JSON_LEFTBRACKET,
    JSON_RIGHTBRACKET,
    JSON_LEFTBRACE,
    JSON_RIGHTBRACE
} from './constants.js';
const JSON_QUOTE = '"';


const parser = (tokens) => {
    let isRoot = true, root;
    while (tokens.length > 0) {
        const token = tokens.shift();
        if (token.type === "syntax") {
            if (token.value === JSON_LEFTBRACE) {
                if (!isRoot) throw new Error("Root cannot be more than one object.");
                [tokens, root] = parse_object(tokens);
            } else if (token.value === JSON_LEFTBRACKET) {
                if (!isRoot) throw new Error("Root cannot be more than one array.");
                [tokens, root] = parse_array(tokens);
            } else throw new Error("Unexpected syntax at root.");
        } else {
            if (!isRoot) throw new Error("Root cannot be multi valued.");
            root = token.value;
        }

        isRoot = false;
    }
    return root;
}

const parse_object = (tokens) => {
    let object = {};
    let expectedState = "key"; // key, colon, value, comma

    let key = null, value = null;
    while (tokens.length > 0) {
        const token = tokens.shift();
        if (token.type === "syntax" && token.value === JSON_RIGHTBRACE) {
            if (key !== null && expectedState !== "comma") {  // empty object will have key as expectedState
                if (expectedState === "key") throw new Error("Trailing comma.");
                else if (expectedState === "colon") throw new Error("Expected colon.");
                else throw new Error("Expected value.");
            } else {  // empty or valid object
                return [tokens, object];
            }
        }

        if (expectedState === "comma") {
            if (token.type !== "syntax" || token.value !== JSON_COMMA) throw new Error("Expected comma.");
            expectedState = "key";
        } else if (expectedState === "key") {
            if (token.type !== "string") throw new Error("Expected key string.");
            key = token.value;
            expectedState = "colon";
        } else if (expectedState === "colon") {
            if (token.type !== "syntax" || token.value !== JSON_COLON) throw new Error("Expected colon.");
            expectedState = "value";
        } else {
            if (token.type === "syntax") {
                if (token.value === JSON_LEFTBRACE) {
                    [tokens, value] = parse_object(tokens);
                    object[key] = value;
                } else if (token.value === JSON_LEFTBRACKET) {
                    [tokens, value] = parse_array(tokens);
                    object[key] = value;
                } else throw new Error("Unexpected syntax.");
            } else {
                object[key] = token.value;  // number, bool, null, string
            }
            expectedState = "comma";
        }
    }

    throw new Error("Object not closed.");
}

const parse_array = (tokens) => {
    let array = [];
    let expectedState = "value";

    while (tokens.length > 0) {
        const token = tokens.shift();
        if (token.type === "syntax" && token.value === JSON_RIGHTBRACKET) {
            if (array.length > 0 && expectedState === "value") throw new Error("Trailing comma.");
            else return [tokens, array];
        }

        if (expectedState === "comma") {
            if (token.type !== "syntax" || token.value !== JSON_COMMA) throw new Error("Expected comma.");
            expectedState = "value";
        } else {
            if (token.type === "syntax") {
                if (token.value === JSON_LEFTBRACE) array.push(parse_object(tokens));
                else if (token.value === JSON_LEFTBRACKET) array.push(parse_array(tokens));
                else throw new Error("Unexpected syntax.");
            } else {
                array.push(token.value);  // number, bool, null, string
            }

            expectedState = "comma";
        }
    }

    throw new Error("Array not closed.");
}

export default parser;