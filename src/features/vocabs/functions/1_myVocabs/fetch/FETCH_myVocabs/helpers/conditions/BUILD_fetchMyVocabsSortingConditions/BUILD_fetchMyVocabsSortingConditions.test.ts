//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import BUILD_fetchMyVocabsSortingConditions from "./BUILD_fetchMyVocabsSortingConditions";
import { Q } from "@nozbe/watermelondb";

describe("BUILD_fetchMyVocabsSortingConditions function", () => {
  // 1. Returns sortBy with "difficulty" in ascending order
  test('1. Returns sortBy with "difficulty" in ascending order', () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sorting: "difficulty",
        sortDirection: "ascending",
      },
    } as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("difficulty", Q.asc));
  });

  // 2. Returns sortBy with "difficulty" in descending order
  test('2. Returns sortBy with "difficulty" in descending order', () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sorting: "difficulty",
        sortDirection: "descending",
      },
    } as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("difficulty", Q.desc));
  });

  // 3. Returns sortBy with "created_at" in ascending order when sorting is "date"
  test('3. Returns sortBy with "created_at" in ascending order when sorting is "date"', () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sorting: "date",
        sortDirection: "ascending",
      },
    } as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("created_at", Q.asc));
  });

  // 4. Returns sortBy with "created_at" in descending order when sorting is "date"
  test('4. Returns sortBy with "created_at" in descending order when sorting is "date"', () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sorting: "date",
        sortDirection: "descending",
      },
    } as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("created_at", Q.desc));
  });

  // 5. Defaults to sorting by "created_at" in descending order when sorting is undefined
  test('5. Defaults to sorting by "created_at" in descending order when sorting is undefined', () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sortDirection: "descending",
      },
    } as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("created_at", Q.desc));
  });

  // 6. Defaults to sorting by "created_at" in descending order when no settings are provided
  test('6. Defaults to sorting by "created_at" in descending order when no settings are provided', () => {
    const args = {} as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("created_at", Q.desc));
  });

  // 7. Handles invalid sortDirection gracefully and defaults to descending
  test("7. Handles invalid sortDirection gracefully and defaults to descending", () => {
    const args = {
      z_vocabDisplay_SETTINGS: {
        sorting: "difficulty",
        sortDirection: "invalid_direction",
      },
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_fetchMyVocabsSortingConditions(args);
    expect(result).toEqual(Q.sortBy("difficulty", Q.desc));
  });
});
