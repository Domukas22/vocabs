//
//
//

import { Q } from "@nozbe/watermelondb";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import BUILD_fetchMyVocabsPaginationConditions from "./BUILD_fetchMyVocabsPaginationConditions";

describe("BUILD_fetchMyVocabsPaginationConditions", () => {
  it("1. Returns [Q.take(0)] when 'start' is not a number", () => {
    const args = {
      start: undefined,
      amount: 10,
    } as unknown as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.take(0)]);
  });

  it("2. Returns [Q.take(0)] when 'amount' is not a number", () => {
    const args = {
      start: 0,
      amount: undefined,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.take(0)]);
  });

  it("3. Returns [Q.take(0)] when 'amount' is less than or equal to 0", () => {
    const argsZero = {
      start: 0,
      amount: 0,
    } as FETCH_myVocabs_ARG_TYPES;
    const resultZero = BUILD_fetchMyVocabsPaginationConditions(argsZero);

    const argsNegative = {
      start: 0,
      amount: -5,
    } as FETCH_myVocabs_ARG_TYPES;
    const resultNegative =
      BUILD_fetchMyVocabsPaginationConditions(argsNegative);

    expect(resultZero).toEqual([Q.take(0)]);
    expect(resultNegative).toEqual([Q.take(0)]);
  });

  it("4. Handles valid 'start' and 'amount' correctly", () => {
    const args = {
      start: 5,
      amount: 15,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.skip(5), Q.take(15)]);
  });

  it("5. Returns [Q.take(0)] when both 'start' and 'amount' are undefined", () => {
    const args = {
      start: undefined,
      amount: undefined,
    } as unknown as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.take(0)]);
  });

  it("6. Handles null values gracefully", () => {
    const args = {
      start: null as unknown as number,
      amount: null as unknown as number,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.take(0)]);
  });

  it("7. Handles edge case where 'start' is 0 and 'amount' is valid", () => {
    const args = {
      start: 0,
      amount: 10,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.skip(0), Q.take(10)]);
  });

  it("8. Handles edge case where 'amount' is large but valid", () => {
    const args = {
      start: 0,
      amount: 1000,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.skip(0), Q.take(1000)]);
  });

  it("9. Handles inputs with extra undefined properties", () => {
    const args = {
      start: 5,
      amount: 10,
      extra: undefined,
    } as unknown as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.skip(5), Q.take(10)]);
  });

  it("10. Does not break when called with an empty object", () => {
    const args = {} as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsPaginationConditions(args);

    expect(result).toEqual([Q.take(0)]);
  });
});
