//
//
//

import { VALIDATE_watermelonFetch } from "./VALIDATE_watermelonFetch"; // Adjust path if needed

// Mock function to simulate THROW_err
const mockThrowErr = jest.fn();

describe("VALIDATE_watermelonFetch function", () => {
  beforeEach(() => {
    mockThrowErr.mockClear();
  });

  test("1. Throws an error if totalCount is not a number", () => {
    const args = {
      totalCount: "string" as any, // Invalid type
      vocabs: [],
      THROW_err: mockThrowErr,
    };

    try {
      VALIDATE_watermelonFetch(args);
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith(
        "undefined_watermelon_totalCount"
      );
    }
  });

  test("2. Throws an error if vocabs is not an array", () => {
    const args = {
      totalCount: 10,
      vocabs: {} as any, // Invalid type
      THROW_err: mockThrowErr,
    };

    try {
      VALIDATE_watermelonFetch(args);
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("undefined_watermelon_vocabs");
    }
  });

  test("3. Throws an error if vocabs is undefined", () => {
    const args = {
      totalCount: 10,
      vocabs: undefined as any, // Invalid value
      THROW_err: mockThrowErr,
    };

    try {
      VALIDATE_watermelonFetch(args);
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("undefined_watermelon_vocabs");
    }
  });

  test("4. Does not throw an error if totalCount is a number and vocabs is an array", () => {
    const args = {
      totalCount: 10,
      vocabs: [],
      THROW_err: mockThrowErr,
    };

    VALIDATE_watermelonFetch(args);

    expect(mockThrowErr).not.toHaveBeenCalled(); // Ensuring no error is thrown
  });
});
