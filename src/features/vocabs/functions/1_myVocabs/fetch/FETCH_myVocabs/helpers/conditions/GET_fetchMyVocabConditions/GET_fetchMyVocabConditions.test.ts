//
//
//

import { GET_fetchMyVocabConditions } from "./GET_fetchMyVocabConditions";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import { default as BUILD_fetchMyVocabsFilterConditions } from "../BUILD_fetchMyVocabsFilterConditions/BUILD_fetchMyVocabsFilterConditions";
import { default as BUILD_fetchMyVocabsSortingConditions } from "../BUILD_fetchMyVocabsSortingConditions/BUILD_fetchMyVocabsSortingConditions";
import { default as BUILD_fetchMyVocabsPaginationConditions } from "../BUILD_fetchMyVocabsPaginationConditions/BUILD_fetchMyVocabsPaginationConditions";

// Mock the helper functions with jest.Mock type
jest.mock(
  "../BUILD_fetchMyVocabsFilterConditions/BUILD_fetchMyVocabsFilterConditions",
  () => ({
    __esModule: true,
    default: jest.fn() as jest.Mock,
  })
);

jest.mock(
  "../BUILD_fetchMyVocabsSortingConditions/BUILD_fetchMyVocabsSortingConditions",
  () => ({
    __esModule: true,
    default: jest.fn() as jest.Mock,
  })
);

jest.mock(
  "../BUILD_fetchMyVocabsPaginationConditions/BUILD_fetchMyVocabsPaginationConditions",
  () => ({
    __esModule: true,
    default: jest.fn() as jest.Mock,
  })
);

describe("GET_fetchMyVocabConditions", () => {
  // 1. Returns combined conditions from all helpers
  it("1. Returns combined conditions from all helpers", () => {
    const mockFilterConditions = "mockFilterConditions";
    const mockSortingConditions = "mockSortingConditions";
    const mockPaginationConditions = "mockPaginationConditions";

    // Mock the return of the helper functions
    (BUILD_fetchMyVocabsFilterConditions as jest.Mock).mockReturnValue(
      mockFilterConditions
    );
    (BUILD_fetchMyVocabsSortingConditions as jest.Mock).mockReturnValue(
      mockSortingConditions
    );
    (BUILD_fetchMyVocabsPaginationConditions as jest.Mock).mockReturnValue(
      mockPaginationConditions
    );

    const args = {} as FETCH_myVocabs_ARG_TYPES;
    const result = GET_fetchMyVocabConditions(args);

    expect(result).toEqual({
      filter_CONDITIONS: mockFilterConditions,
      sorting_CONDITIONS: mockSortingConditions,
      pagination_CONDITIONS: mockPaginationConditions,
    });
  });

  // 2. Calls the correct helper functions with correct arguments
  it("2. Calls the correct helper functions with correct arguments", () => {
    const args = { user_id: "user_123" } as FETCH_myVocabs_ARG_TYPES;

    // Call the function
    GET_fetchMyVocabConditions(args);

    // Ensure the helper functions were called with the correct arguments
    expect(BUILD_fetchMyVocabsFilterConditions).toHaveBeenCalledWith(args);
    expect(BUILD_fetchMyVocabsSortingConditions).toHaveBeenCalledWith(args);
    expect(BUILD_fetchMyVocabsPaginationConditions).toHaveBeenCalledWith(args);
  });

  // 3. Handles missing arguments gracefully
  it("3. Handles missing arguments gracefully", () => {
    const args = {} as FETCH_myVocabs_ARG_TYPES;

    // Mock the return of the helper functions
    (BUILD_fetchMyVocabsFilterConditions as jest.Mock).mockReturnValue(
      "filter"
    );
    (BUILD_fetchMyVocabsSortingConditions as jest.Mock).mockReturnValue(
      "sorting"
    );
    (BUILD_fetchMyVocabsPaginationConditions as jest.Mock).mockReturnValue(
      "pagination"
    );

    const result = GET_fetchMyVocabConditions(args);

    expect(result).toEqual({
      filter_CONDITIONS: "filter",
      sorting_CONDITIONS: "sorting",
      pagination_CONDITIONS: "pagination",
    });
  });

  // 4. Returns empty conditions when helper functions return undefined or null
  it("4. Returns empty conditions when helper functions return undefined or null", () => {
    // Mock the return of the helper functions
    (BUILD_fetchMyVocabsFilterConditions as jest.Mock).mockReturnValue(
      undefined
    );
    (BUILD_fetchMyVocabsSortingConditions as jest.Mock).mockReturnValue(null);
    (BUILD_fetchMyVocabsPaginationConditions as jest.Mock).mockReturnValue(
      undefined
    );

    const args = {} as FETCH_myVocabs_ARG_TYPES;
    const result = GET_fetchMyVocabConditions(args);

    expect(result).toEqual({
      filter_CONDITIONS: undefined,
      sorting_CONDITIONS: null,
      pagination_CONDITIONS: undefined,
    });
  });

  // 5. Verifies that the return value structure is consistent with the expected format
  it("5. Verifies that the return value structure is consistent with the expected format", () => {
    const mockFilterConditions = "mockFilterConditions";
    const mockSortingConditions = "mockSortingConditions";
    const mockPaginationConditions = "mockPaginationConditions";

    // Mock the return values
    (BUILD_fetchMyVocabsFilterConditions as jest.Mock).mockReturnValue(
      mockFilterConditions
    );
    (BUILD_fetchMyVocabsSortingConditions as jest.Mock).mockReturnValue(
      mockSortingConditions
    );
    (BUILD_fetchMyVocabsPaginationConditions as jest.Mock).mockReturnValue(
      mockPaginationConditions
    );

    const args = {} as FETCH_myVocabs_ARG_TYPES;
    const result = GET_fetchMyVocabConditions(args);

    // Ensure that the returned object has the correct structure
    expect(result).toHaveProperty("filter_CONDITIONS");
    expect(result).toHaveProperty("sorting_CONDITIONS");
    expect(result).toHaveProperty("pagination_CONDITIONS");
  });
});
