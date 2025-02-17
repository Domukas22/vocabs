//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { SET_error_PAYLOAD } from "../../types";
import { SET_reducerError } from "./SET_reducerError";

// Mock payload
const errorPayload = { message: "An error occurred" } as SET_error_PAYLOAD;

// Alternative error if payload is missing
const alternativeError = new General_ERROR({
  function_NAME: "SET_reducerError",
  message: "An error has been triggered, but hasn't been provided properly",
});

describe("SET_reducerError", () => {
  test("1. Sets the error in the reducer when payload is provided", () => {
    const updatedState = SET_reducerError(errorPayload);
    expect(updatedState?.error).toEqual(errorPayload);
    expect(updatedState?.z_myVocabsLoading_STATE).toBe("error");
  });

  test("2. Sets the alternative error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as SET_error_PAYLOAD;
    const updatedState = SET_reducerError(invalidPayload);
    expect(updatedState?.error).toEqual(alternativeError);
    expect(updatedState?.z_myVocabsLoading_STATE).toBe("error");
  });
});
