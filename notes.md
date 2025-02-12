# JSDoc Comments Format:

- JSDoc comments start with /\*_ and end with _/. Inside the comment block, special tags are used to describe the function's parameters, return type, and other important details.
  These comments are picked up by TypeScript's type checker, editor tools, and IntelliSense to provide richer information.
  Types of JSDoc Tags:

**@param**: Describes a function's parameters, including the type and a description.
**@returns**: Describes the return value of the function.
**@throws** or **@throws {Type}**: Describes the types of errors the function might throw.
**@example**: Provides an example of how to use the function.
**@deprecated**: Marks the function as deprecated.
**@see**: Adds a link to related documentation.
**@since**: Indicates when the function or feature was introduced.

## Example of JSDoc Comments Above a Function

/\*\*

- Adds two numbers together.
-
- @param {number} a - The first number to add.
- @param {number} b - The second number to add.
- @returns {number} The sum of the two numbers.
- @throws {Error} Throws an error if a or b is not a number.
-
- @example
- add(1, 2); // Returns 3
- add(5, -3); // Returns 2
  \*/

function add(a: number, b: number): number {
if (typeof a !== 'number' || typeof b !== 'number') {
throw new Error("Both arguments must be numbers");
}
return a + b;
}

---
