//
//
//

export function Delay(timeInMs: number = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Resolved after 2 seconds");
      // You can use `reject("Some error message")` to simulate an error.
    }, timeInMs);
  });
}
