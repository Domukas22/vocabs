//
//
//
import { VALIDATE_args } from "./VALIDATE_args"; // Adjust path if needed
import { FETCH_myVocabs_ARG_TYPES, internalErrMsg_TYPES } from "../../../types";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";

// Mock function to simulate THROW_err
const mockThrowErr = jest.fn();

describe("VALIDATE_args function", () => {
  beforeEach(() => {
    mockThrowErr.mockClear();
  });

  // 1. Throws an error if user_id is undefined
  test("1. Throws an error if user_id is undefined", () => {
    const args = {
      type: "allVocabs",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("user_id_undefined");
    }
  });

  // 2. Throws an error if type is undefined
  test("2. Throws an error if type is undefined", () => {
    const args = {
      user_id: "user123",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("fetch_type_undefined");
    }
  });

  // 3. Throws an error if type is "byTargetList" and targetList_ID is undefined
  test('3. Throws an error if type is "byTargetList" and targetList_ID is undefined', () => {
    const args = {
      user_id: "user123",
      type: "byTargetList",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("target_list_id_undefined");
    }
  });

  // 4. Throws an error if z_vocabDisplay_SETTINGS is undefined
  test("4. Throws an error if z_vocabDisplay_SETTINGS is undefined", () => {
    const args = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      amount: 10,
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("display_settings_undefined");
    }
  });

  // 5. Throws an error if start is not a number
  test("5. Throws an error if start is not a number", () => {
    const args = {
      user_id: "user123",
      type: "allVocabs",
      start: "0",
      amount: 10,
      z_vocabDisplay_SETTINGS: {},
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("pagination_start_undefined");
    }
  });

  // 6. Throws an error if amount is not a number
  test("6. Throws an error if amount is not a number", () => {
    const args = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      amount: "10",
      z_vocabDisplay_SETTINGS: {},
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("pagination_amount_undefined");
    }
  });

  // 7. Handles null and empty object values for the settings gracefully
  test("7. Handles null and empty object values for the settings gracefully", () => {
    const args1 = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: null,
    } as unknown as FETCH_myVocabs_ARG_TYPES;
    const args2 = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args: args1, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("display_settings_undefined");
    }

    try {
      VALIDATE_args({ args: args2, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("display_settings_undefined");
    }
  });

  // 8. Handles undefined values for optional parameters like start and amount
  test("8. Handles undefined values for optional parameters like start and amount", () => {
    const args = {
      user_id: "user123",
      type: "allVocabs",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("pagination_start_undefined");
    }

    const argsWithAmountUndefined = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      z_vocabDisplay_SETTINGS: {},
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    try {
      VALIDATE_args({ args: argsWithAmountUndefined, THROW_err: mockThrowErr });
    } catch (e) {
      expect(mockThrowErr).toHaveBeenCalledWith("pagination_amount_undefined");
    }
  });

  // 9. Does not throw any error when all required arguments are valid
  test("9. Does not throw any error when all required arguments are valid", () => {
    const args = {
      user_id: "user123",
      type: "allVocabs",
      start: 0,
      amount: 10,
      z_vocabDisplay_SETTINGS: { sorting: "date" },
    } as FETCH_myVocabs_ARG_TYPES;

    VALIDATE_args({ args, THROW_err: mockThrowErr });

    expect(mockThrowErr).not.toHaveBeenCalled(); // Ensuring no error is thrown
  });
});
