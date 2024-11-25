import FETCH_supabaseLists from "./FETCH_supabaseLists";
import { FetchSupabaseLists_ARGS } from "./types";
import { supabase } from "@/src/lib/supabase";
import CHECK_ifNetworkFailure from "@/src/utils/CHECK_ifNetworkFailure";

// Mock necessary modules
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn(),
    }),
  },
}));

jest.mock("@/src/utils/CHECK_ifNetworkFailure", () => jest.fn());

describe("FETCH_supabaseLists", () => {
  const mockSelect = jest.fn();
  const mockRange = jest.fn();
  const mockAbortSignal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect.mockReturnValue({
        range: mockRange,
        abortSignal: mockAbortSignal,
      }),
    });
  });

  const testArgs: FetchSupabaseLists_ARGS = {
    search: "test search",
    list_ids: ["1", "2"],
    z_listDisplay_SETTINGS: {
      langFilters: [],
      sorting: "date",
      sortDirection: "ascending",
    },
    start: 0,
    end: 10,
    type: "shared",
  };

  it("returns correct data with valid args", async () => {
    mockRange.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "List 1",
          description: "Desc 1",
          collected_lang_ids: [],
          username: "user1",
          vocabs: [{ count: 3 }],
        },
      ],
      count: 1,
    });

    const result = await FETCH_supabaseLists(testArgs);

    expect(result).toEqual({
      data: {
        lists: [
          {
            id: 1,
            name: "List 1",
            description: "Desc 1",
            collected_lang_ids: [],
            username: "user1",
            vocabs: [{ count: 3 }],
          },
        ],
        count: 1,
      },
    });
  });

  it("returns empty data if no lists are found", async () => {
    mockRange.mockResolvedValueOnce({
      data: [],
      count: 0,
    });

    const result = await FETCH_supabaseLists(testArgs);

    expect(result).toEqual({
      data: {
        lists: [],
        count: 0,
      },
    });
  });

  it("throws an error if type is invalid", async () => {
    const invalidArgs = { ...testArgs, type: "invalid" };
    await expect(FETCH_supabaseLists(invalidArgs)).resolves.toEqual({
      data: { lists: [], count: 0 },
      error: {
        error_TYPE: "internal",
        function_NAME: "FETCH_supabaseLists",
        user_MSG: "An internal error occurred. Please try again later.",
        internal_MSG: "Invalid list type provided.",
      },
    });
  });

  it("throws an error if list_ids are missing for shared type", async () => {
    const invalidArgs = { ...testArgs, type: "shared", list_ids: null };
    await expect(FETCH_supabaseLists(invalidArgs)).resolves.toEqual({
      data: { lists: [], count: 0 },
      error: {
        error_TYPE: "internal",
        function_NAME: "FETCH_supabaseLists",
        user_MSG: "An internal error occurred. Please try again later.",
        internal_MSG: "List IDs are required for shared type.",
      },
    });
  });

  //   it("handles Supabase network failure", async () => {
  //     mockRange.mockRejectedValueOnce(new Error("Network error"));
  //     (CHECK_ifNetworkFailure as jest.Mock).mockReturnValueOnce(true);

  //     const result = await FETCH_supabaseLists(testArgs);

  //     expect(result).toEqual({
  //       data: { lists: [], count: 0 },
  //       error: {
  //         error_TYPE: "user_network",
  //         function_NAME: "FETCH_supabaseLists",
  //         user_MSG: "Network error occurred. Please check your connection.",
  //       },
  //     });
});

// -------------------------------

// jest.mock(
//     "@/src/lib/supabase/utils/APPLY_supabasePagination/APPLY_supabasePagination",
//     () => ({
//       __esModule: true, // if using ES modules

//       default: jest.fn().mockImplementation((query, start, end) => {
//         // Mock the range behavior of the query object
//         query.range = jest.fn().mockReturnValue(query); // Mock the query.range method
//         return end - 1 <= start ? query.range(0, 0) : query.range(start, end - 1);
//       }),
//     })
//   );

// -------------------------------

//   it("should throw an error when the 'type' is invalid", async () => {
//     const invalidArgs = { ...validArgs, type: "invalidType" };

//     await expect(FETCH_supabaseLists(invalidArgs)).rejects.toThrowError(
//       fetchSupabaseLists_ERRS.internal.inproperListType
//     );
//   });

//   it("should throw an error when 'list_ids' are required but not provided", async () => {
//     const invalidArgs = { ...validArgs, list_ids: null, type: "shared" };

//     await expect(FETCH_supabaseLists(invalidArgs)).rejects.toThrowError(
//       fetchSupabaseLists_ERRS.internal.listIdsUndefined
//     );
//   });

//   it("should handle network failure error correctly", async () => {
//     const errorResponse = { message: "Network error" };
//     CHECK_ifNetworkFailure.mockReturnValue(true);

//     supabase.from().select.mockResolvedValueOnce({ error: errorResponse });

//     await expect(FETCH_supabaseLists(validArgs)).rejects.toThrowError(
//       fetchSupabaseLists_ERRS.user.networkFailure
//     );
//   });

//   it("should handle other errors correctly", async () => {
//     const errorResponse = { message: "Supabase fetch error" };
//     supabase.from().select.mockResolvedValueOnce({ error: errorResponse });

//     await expect(FETCH_supabaseLists(validArgs)).rejects.toThrowError(
//       fetchSupabaseLists_ERRS.internal.failedSupabaseFetch
//     );
//   });

//   it("should apply pagination correctly", async () => {
//     const mockData = { data: [{ id: 1, name: "List 1" }], count: 1 };
//     supabase.from().select.mockResolvedValueOnce(mockData);

//     const result = await FETCH_supabaseLists({
//       ...validArgs,
//       start: 0,
//       end: 5,
//     });

//     expect(result.data.lists.length).toBeGreaterThan(0);
//     expect(result.data.count).toBe(1);
//   });
