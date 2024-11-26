import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import FETCH_supabaseLists from "./FETCH_supabaseLists";
import { fetchSupabaseLists_ERRS } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

// Mock dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      abortSignal: jest.fn().mockReturnThis(),
    }),
  },
}));
jest.mock("../BUILD_supabaseListQuery/BUILD_supabaseListQuery", () =>
  jest.fn().mockReturnThis()
);

describe("FETCH_supabaseLists", () => {
  const MOCK_SIGNAL = new AbortController().signal;
  const MOCK_Z_LIST_DISPLAY_SETTINGS = {
    sorting: "date",
    sortDirection: "ascending",
    langFilters: ["en", "de"],
  } as z_listDisplaySettings_PROPS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. Should throw an error if 'type' is not 'public' or 'shared'", async () => {
    // Call the function with the invalid type
    const result = await FETCH_supabaseLists({
      type: "somethingInvalid" as "public", // the "as public" is to avoid typescript error
      list_ids: ["list1"],
      search: "test",
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: MOCK_SIGNAL,
    });

    // Check if the validation error is thrown correctly
    expect(result).toEqual({
      data: {
        lists: [],
        count: 0,
      },
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
        internal_MSG: fetchSupabaseLists_ERRS.internal.inproperListType,
      }),
    });
  });

  it("2. Should throw an error if 'type' is 'shared' and 'list_ids' is not provided", async () => {
    const sharedType = "shared"; // Valid type, but no list_ids

    // Call the function with the 'shared' type and no list_ids
    const result = await FETCH_supabaseLists({
      type: sharedType,
      list_ids: undefined,
      search: "test",
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: MOCK_SIGNAL,
    });

    // Check if the validation error is thrown correctly for missing list_ids
    expect(result).toEqual({
      data: {
        lists: [],
        count: 0,
      },
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
        internal_MSG: fetchSupabaseLists_ERRS.internal.listIdsUndefined,
      }),
    });
  });

  it("3. Should call EXTEND_supabaseListQuery with the correct arguments", async () => {
    const mockExtendSupabaseListquery = require("../BUILD_supabaseListQuery/BUILD_supabaseListQuery");

    const list_ids = ["list1"];
    const type = "public";
    const search = "test";

    await FETCH_supabaseLists({
      type,
      list_ids,
      search,
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: MOCK_SIGNAL,
    });

    expect(mockExtendSupabaseListquery).toHaveBeenCalledWith({
      query: expect.anything(), // The query object can be any, we just care about the call
      list_ids,
      type,
      search,
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
    });
  });

  it("4. Should handle Supabase error properly", async () => {
    const mockError: PostgrestError = {
      code: "multi-error",
      message: "Multiple issues occurred",
      details: "Error1; Error2; Error3",
      hint: "Check your query",
    };

    const mockExtendSupabaseListquery = require("../BUILD_supabaseListQuery/BUILD_supabaseListQuery");

    mockExtendSupabaseListquery.mockReturnValueOnce({
      abortSignal: jest.fn().mockResolvedValue({
        error: mockError,
      }),
    });

    const result = await FETCH_supabaseLists({
      type: "shared",
      list_ids: ["list1"],
      search: "test",
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: MOCK_SIGNAL,
    });

    // Check if the error response matches the expected structure
    expect(result).toEqual({
      data: {
        lists: [],
        count: 0,
      },
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
        internal_MSG: fetchSupabaseLists_ERRS.internal.failedSupabaseFetch,
      }),
    });
  });

  it("5. Should return data and count when Supabase query is successful", async () => {
    const mockData = [
      { id: "list1", name: "Test List", description: "Test description" },
    ];
    const mockCount = 1;

    const mockExtendSupabaseListquery = require("../BUILD_supabaseListQuery/BUILD_supabaseListQuery");
    mockExtendSupabaseListquery.mockReturnValueOnce({
      abortSignal: jest.fn().mockResolvedValue({
        data: mockData,
        count: mockCount,
        error: null,
      }),
    });

    const result = await FETCH_supabaseLists({
      type: "public",
      list_ids: ["list1"],
      search: "test",
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: MOCK_SIGNAL,
    });

    expect(result).toEqual({
      data: {
        lists: mockData,
        count: mockCount,
      },
    });
  });

  it("6. Should handle abort signal correctly", async () => {
    const mockError: PostgrestError = {
      code: "abort-error",
      message: "Query aborted",
      details: "Request was canceled",
      hint: "Abort signal was triggered",
    };

    // Create a mock AbortController
    const abortController = new AbortController();

    // Mock the behavior of supabase query with abortSignal handling
    const mockExtendSupabaseListquery = require("../BUILD_supabaseListQuery/BUILD_supabaseListQuery");

    // Mock the abortSignal function to simulate the query being aborted
    mockExtendSupabaseListquery.mockReturnValueOnce({
      abortSignal: jest.fn().mockImplementation(() => {
        // Simulate that the operation is aborted
        abortController.abort(); // Abort the request immediately
        return Promise.reject(mockError); // Return an error to simulate the abort scenario
      }),
    });

    // Set the abort signal to be passed to the function
    const resultPromise = FETCH_supabaseLists({
      type: "public",
      list_ids: ["list1"],
      search: "test",
      z_listDisplay_SETTINGS: MOCK_Z_LIST_DISPLAY_SETTINGS,
      start: 0,
      end: 10,
      signal: abortController.signal, // Pass the signal here
    });

    // Trigger the abort before the query resolves
    abortController.abort();

    // Await the result and check if the correct error handling occurred
    await expect(resultPromise).resolves.toEqual({
      data: {
        lists: [],
        count: 0,
      },
      error: expect.objectContaining({
        error_TYPE: "unknown",
        internal_MSG: "Query aborted",
      }),
    });
  });
});
