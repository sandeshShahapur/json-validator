# JSON Validation Tool
This is a JavaScript-based tool for validating JSON strings through lexical analysis and syntactical analysis.

## Overview
JSON (JavaScript Object Notation) is a lightweight data-interchange format commonly used for data exchange between a server and a web application. Validating JSON strings is essential to ensure data integrity and compatibility between systems.

This tool performs lexical analysis to tokenize the input string and syntactical analysis to check the structure and validity of the JSON data as per the JSON specification.

## Features
Lexical Analysis: Tokenizes the input JSON string to identify individual tokens such as primitive data types and keywords.
Syntactical Analysis: Checks the structure and syntax of the JSON string to ensure it conforms to the JSON specification.
Error Handling: Provides error messages for invalid JSON strings.

It additionally constructs and returns an equivalent JavaScript object.

## Example
![image](https://github.com/sandeshShahapur/json-validator/assets/110241292/793d58d2-4558-42ca-aa33-476a709a6b24)


> [!WARNING]
> It currently does not accurately handle JSON strings where the keywords or constants are quoted (':', '{', '[', '}', ']' ',')
