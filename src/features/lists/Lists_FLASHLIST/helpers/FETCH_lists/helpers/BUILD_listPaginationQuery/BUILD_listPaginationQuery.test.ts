//
//
//

import { FETCH_lists_ARGS, VocabQuery_TYPE } from "../../types";
import { BUILD_listPaginationQuery } from "./BUILD_listPaginationQuery";

describe("BUILD_vocabPaginationQuery", () => {
  let mockQuery: VocabQuery_TYPE;

  beforeEach(() => {
    mockQuery = {
      limit: jest.fn().mockReturnThis(),
    } as unknown as VocabQuery_TYPE;
  });

  test("1. Applies limit filter when amount is provided", () => {
    const args = {
      amount: 10,
    } as FETCH_lists_ARGS;

    const result = BUILD_listPaginationQuery(mockQuery, args);
    expect(mockQuery.limit).toHaveBeenCalledWith(10);
  });

  test("2. Applies limit filter when amount is not provided", () => {
    const args = {} as FETCH_lists_ARGS;

    BUILD_listPaginationQuery(mockQuery, args);
    expect(mockQuery.limit).toHaveBeenCalledWith(0);
  });

  test("3. Throws error when query is undefined", () => {
    expect(() =>
      BUILD_listPaginationQuery(undefined as any, {} as any)
    ).toThrow("'query' undefined when building vocab pagination");
  });

  test("4. Handles undefined amount gracefully", () => {
    const args = {} as FETCH_lists_ARGS;

    BUILD_listPaginationQuery(mockQuery, args);
    expect(mockQuery.limit).toHaveBeenCalledWith(0);
  });
});
