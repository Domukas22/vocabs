//
//
//

import {
  FETCH_lists_ARGS,
  itemVisibility_TYPE,
  vocabFetch_TYPES,
} from "../../types";
import { VALIDATE_fetchListsArgs } from "./VALIDATE_fetchListsArgs";

describe("VALIDATE_args", () => {
  test("1. Throws an error when user_id is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: undefined as any,
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrow(
      new Error("User id undefined")
    );
  });

  test("2. Throws an error when fetch_TYPE is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: undefined as any,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Fetch type undefined")
    );
  });

  test("3. Throws an error when list_TYPE is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: undefined as any,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("List type undefined")
    );
  });

  test("4. Throws an error when targetList_ID is undefined while fetch_TYPE is 'byTargetList'", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: undefined,
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("targetList_ID undefined")
    );
  });

  test("5. Throws an error when langFilters is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: undefined as any,
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Language filters undefined")
    );
  });

  test("6. Throws an error when difficultyFilters is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: undefined as any,
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Difficulty filters undefined")
    );
  });

  test("7. Throws an error when sortDirection is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: undefined as any,
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Sort direction undefined")
    );
  });

  test("8. Throws an error when sorting is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: undefined as any,
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Sorting direction undefined")
    );
  });

  test("9. Throws an error when excludeIds is undefined", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: undefined as any,
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Excluded ids undefined")
    );
  });

  test("10. Throws an error when amount is not a number", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: "string" as any,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Pagination amount undefined")
    );
  });

  test("11. Throws an error when search is not a string", () => {
    const args: FETCH_lists_ARGS = {
      search: 12345 as any,
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).toThrowError(
      new Error("Search was not a string")
    );
  });

  test("12. Passes validation when all arguments are correct", () => {
    const args: FETCH_lists_ARGS = {
      search: "test",
      signal: undefined as unknown as AbortSignal,
      amount: 10,
      user_id: "user1",
      list_TYPE: "type1" as itemVisibility_TYPE,
      excludeIds: new Set(["id1"]),
      fetch_TYPE: "byTargetList" as vocabFetch_TYPES,
      langFilters: ["en"],
      difficultyFilters: [1],
      sortDirection: "ascending",
      sorting: "difficulty",
      targetList_ID: "some-target",
    };

    expect(() => VALIDATE_fetchListsArgs(args)).not.toThrow();
  });
});
