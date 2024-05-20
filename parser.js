import {
    JSON_COMMA,
    JSON_COLON,
    JSON_LEFTBRACKET,
    JSON_RIGHTBRACKET,
    JSON_LEFTBRACE,
    JSON_RIGHTBRACE
} from './constants.js';
const JSON_QUOTE = '"';

const INVALID_OBJECT_VALUES = [JSON_COMMA, JSON_COLON, JSON_RIGHTBRACKET, JSON_QUOTE];
const INVALID_ARRAY_VALUES = [JSON_COMMA, JSON_COLON, JSON_RIGHTBRACE, JSON_QUOTE];

const parser = (tokens) => {
    let isRoot = true, root;
    while (tokens.length > 0) {
        if (tokens[0] === JSON_LEFTBRACE) {
            if (!isRoot) {
                throw new Error("Root cannot be more than one object.");
            }
            [tokens, root] = parse_object(tokens.slice(1));
        } else if (tokens[0] === JSON_LEFTBRACKET) {
            if (!isRoot) {
                throw new Error("Root cannot be more than one array.");
            }
            [tokens, root] = parse_array(tokens.slice(1));
        } else {
            if (!isRoot) {
                throw new Error("Root cannot be multi valued.");
            }
            root = tokens.shift();
            console.log("Root: ", root);
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
        if (tokens[0] === JSON_RIGHTBRACE) {
            if (key !== null && expectedState !== "comma") {
                if (expectedState === "key") {
                    throw new Error("Trailing comma.");
                } else if (expectedState === "colon") {
                    throw new Error("Expected colon.");
                } else {
                    throw new Error("Expected value.");
                }
            } else {
                return [tokens.slice(1), object];
            }
        }

        if (expectedState === "comma") {
            if (tokens[0] !== JSON_COMMA) {
                throw new Error("Expected comma.");
            } else {
                tokens.shift();
                expectedState = "key";
            }
        } else if (expectedState === "key") {
            if (typeof tokens[0] === "string") {
                key = tokens.shift();
                expectedState = "colon";
            } else {
                throw new Error("Expected key.");
            }
        } else if (expectedState === "colon") {
            if (tokens[0] !== JSON_COLON) {
                throw new Error("Expected colon.");
            } else {
                tokens.shift();
                expectedState = "value";
            }
        } else {
            if (tokens[0] === JSON_LEFTBRACE) {
                [tokens, value] = parse_object(tokens.slice(1));
                object[key] = value;
            } else if (tokens[0] === JSON_LEFTBRACKET) {
                [tokens, value] = parse_array(tokens.slice(1));
                object[key] = value;
            } else if (INVALID_OBJECT_VALUES.includes(tokens[0])) {
                if (tokens[0] === JSON_QUOTE) {
                    throw new Error("Unexpected quote.");
                } else if (tokens[0] === JSON_COLON) {
                    throw new Error("Unexpected colon.");
                } else if (tokens[0] === JSON_COMMA) {
                    throw new Error("Unexpected comma.");
                } else {
                    throw new Error("Unexpected right bracket.");
                }
            } else {
                object[key] = tokens.shift();
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
        if (tokens[0] === JSON_RIGHTBRACKET) {
            if (array.length > 0 && expectedState === "value") {
                throw new Error("Trailing comma.");
            } else {
                return [tokens.slice(1), array];
            }
        }

        if (expectedState === "comma") {
            if (tokens[0] !== JSON_COMMA) {
                throw new Error("Expected comma.");
            } else {
                tokens.shift();
                expectedState = "value";
            }
        } else {
            if (tokens[0] === JSON_LEFTBRACE) {
                let object;
                [tokens, object] = parse_object(tokens.slice(1));
                array.push(object);
            } else if (tokens[0] === JSON_LEFTBRACKET) {
                [tokens, array] = parse_array(tokens.slice(1));
                array.push(array);
            } else if (INVALID_ARRAY_VALUES.includes(tokens[0])) {
                if (tokens[0] === JSON_QUOTE) {
                    throw new Error("Unexpected quote.");
                } else if (tokens[0] === JSON_COLON) {
                    throw new Error("Unexpected colon.");
                } else if (tokens[0] === JSON_COMMA) {
                    throw new Error("Unexpected comma.");
                } else {
                    throw new Error("Unexpected right brace.");
                }
            } else {
                array.push(tokens.shift());
            }
            expectedState = "comma";
        }
    }

    throw new Error("Array not closed.");
}

export default parser;