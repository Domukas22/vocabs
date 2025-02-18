//
//
//

import { VocabQuery_TYPE, FETCH_lists_ARGS } from "../../types";
import { BUILD_listFilterQuery } from "../BUILD_listFilterQuery/BUILD_listFilterQuery";
import { BUILD_listPaginationQuery } from "../BUILD_listPaginationQuery/BUILD_listPaginationQuery";
import { BUILD_listSortingQuery } from "../BUILD_listSortingQuery/BUILD_listSortingQuery";
import { FETCH_finalLists } from "./FETCH_finalLists";

// Mock the dependencies
jest.mock("../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery", () => ({
  BUILD_vocabFilterQuery: jest.fn(),
}));

jest.mock("../BUILD_vocabSortingQuery/BUILD_vocabSortingQuery", () => ({
  BUILD_vocabSortingQuery: jest.fn(),
}));

jest.mock("../BUILD_vocabPaginationQuery/BUILD_vocabPaginationQuery", () => ({
  BUILD_vocabPaginationQuery: jest.fn(),
}));

describe("FETCH_finalVocabs", () => {
  let mockArgs: FETCH_lists_ARGS;
  let mockQuery: VocabQuery_TYPE;

  beforeEach(() => {
    mockArgs = {
      sorting: "date",
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    mockQuery = {
      // Assuming VocabQuery_TYPE has a structure, populate it here if necessary
    } as VocabQuery_TYPE;

    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("1. Returns vocabs when no error occurs", async () => {
    const mockVocabs = [
      { id: 1, word: "hello" },
      { id: 2, word: "world" },
    ];

    // Mock the chain of query-building functions
    (BUILD_listFilterQuery as jest.Mock).mockReturnValueOnce("filteredQuery");
    (BUILD_listSortingQuery as jest.Mock).mockReturnValueOnce("sortedQuery");
    (BUILD_listPaginationQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest
        .fn()
        .mockResolvedValueOnce({ data: mockVocabs, error: null }),
    });

    const result = await FETCH_finalLists(mockQuery, mockArgs);

    expect(result).toEqual({ vocabs: mockVocabs });
    expect(BUILD_listFilterQuery).toHaveBeenCalledWith(
      mockQuery,
      mockArgs,
      true
    );
    expect(BUILD_listSortingQuery).toHaveBeenCalledWith(
      "filteredQuery",
      mockArgs
    );
    expect(BUILD_listPaginationQuery).toHaveBeenCalledWith(
      "sortedQuery",
      mockArgs
    );
  });

  test("2. Throws error when an error occurs during query execution", async () => {
    const mockError = new Error("Error occurred while fetching vocabs");

    // Mock the chain of query-building functions
    (BUILD_listFilterQuery as jest.Mock).mockReturnValueOnce("filteredQuery");
    (BUILD_listSortingQuery as jest.Mock).mockReturnValueOnce("sortedQuery");
    (BUILD_listPaginationQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest
        .fn()
        .mockResolvedValueOnce({ data: null, error: mockError }),
    });

    await expect(FETCH_finalLists(mockQuery, mockArgs)).rejects.toThrow(
      mockError
    );
    expect(BUILD_listFilterQuery).toHaveBeenCalledWith(
      mockQuery,
      mockArgs,
      true
    );
    expect(BUILD_listSortingQuery).toHaveBeenCalledWith(
      "filteredQuery",
      mockArgs
    );
    expect(BUILD_listPaginationQuery).toHaveBeenCalledWith(
      "sortedQuery",
      mockArgs
    );
  });

  test("3. Returns empty vocabs when no data is returned", async () => {
    // Mock the chain of query-building functions
    (BUILD_listFilterQuery as jest.Mock).mockReturnValueOnce("filteredQuery");
    (BUILD_listSortingQuery as jest.Mock).mockReturnValueOnce("sortedQuery");
    (BUILD_listPaginationQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest.fn().mockResolvedValueOnce({ data: null, error: null }),
    });

    const result = await FETCH_finalLists(mockQuery, mockArgs);

    expect(result).toEqual({ vocabs: [] });
    expect(BUILD_listFilterQuery).toHaveBeenCalledWith(
      mockQuery,
      mockArgs,
      true
    );
    expect(BUILD_listSortingQuery).toHaveBeenCalledWith(
      "filteredQuery",
      mockArgs
    );
    expect(BUILD_listPaginationQuery).toHaveBeenCalledWith(
      "sortedQuery",
      mockArgs
    );
  });

  test("4. Calls abortSignal with the provided signal argument", async () => {
    const mockSignal = new AbortController().signal;
    const mockVocabs = [{ id: 1, word: "test" }];

    // Mock the chain of query-building functions
    const mockAbortSignal = jest
      .fn()
      .mockResolvedValueOnce({ data: mockVocabs, error: null });
    (BUILD_listFilterQuery as jest.Mock).mockReturnValueOnce("filteredQuery");
    (BUILD_listSortingQuery as jest.Mock).mockReturnValueOnce("sortedQuery");
    (BUILD_listPaginationQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: mockAbortSignal,
    });

    await FETCH_finalLists(mockQuery, {
      ...mockArgs,
      signal: mockSignal,
    });

    // Ensure abortSignal was called with the correct signal
    expect(mockAbortSignal).toHaveBeenCalledWith(mockSignal);
  });

  test("5. Throws error if query is undefined", async () => {
    const mockError = new Error("'query' undefined when fetching final vocabs");

    await expect(
      FETCH_finalLists(undefined as unknown as VocabQuery_TYPE, mockArgs)
    ).rejects.toThrow(mockError);
  });
});
