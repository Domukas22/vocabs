//
//
//

import { FETCH_lists_ARGS, VocabQuery_TYPE } from "../../types";
import { BUILD_listSortingQuery } from "./BUILD_listSortingQuery";

describe("BUILD_vocabSortingQuery", () => {
  let mockQuery: VocabQuery_TYPE;

  beforeEach(() => {
    mockQuery = {
      order: jest.fn().mockReturnThis(),
    } as unknown as VocabQuery_TYPE;
  });

  test("1. Applies difficulty sorting when sorting is 'difficulty'", () => {
    const args = {
      sorting: "difficulty",
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("difficulty", {
      ascending: true,
    });
  });

  test("2. Applies difficulty sorting when sorting is 'difficulty' and direction is 'descending'", () => {
    const args = {
      sorting: "difficulty",
      sortDirection: "descending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("difficulty", {
      ascending: false,
    });
  });

  test("3. Applies date sorting when sorting is 'date'", () => {
    const args = {
      sorting: "date",
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
  });

  test("4. Applies date sorting when sorting is 'date' and direction is 'descending'", () => {
    const args = {
      sorting: "date",
      sortDirection: "descending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  test("5. Defaults to date sorting when sorting is not defined", () => {
    const args = {
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
  });

  test("6. Defaults to date sorting when sorting is an unknown value", () => {
    const args = {
      sorting: "unknown",
      sortDirection: "ascending",
    } as unknown as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
  });

  test("7. Handles undefined sortDirection gracefully", () => {
    const args = {
      sorting: "difficulty",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("difficulty", {
      ascending: false,
    });
  });

  test("8. Handles null sortDirection gracefully", () => {
    const args = {
      sorting: "difficulty",
      sortDirection: null,
    } as unknown as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("difficulty", {
      ascending: false,
    });
  });

  test("9. Handles undefined sorting gracefully", () => {
    const args = {
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    BUILD_listSortingQuery(mockQuery, args);
    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
  });
  test("10. Throws error when query is undefined", () => {
    expect(() => BUILD_listSortingQuery(undefined as any, {} as any)).toThrow(
      "'query' undefined when building vocab sorting"
    );
  });
});
