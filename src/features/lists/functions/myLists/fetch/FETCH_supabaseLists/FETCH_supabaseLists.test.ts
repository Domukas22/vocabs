//
//
//

import FETCH_supabaseLists from "./FETCH_supabaseLists";
import { supabase } from "@/src/lib/supabase";
import { ExtendSupabaseListQuery_ERRS } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(),
        in: jest.fn(),
        or: jest.fn(),
        order: jest.fn(),
        range: jest.fn(),
        abortSignal: jest.fn(),
      })),
    })),
  },
}));

const mockSupabase = supabase.from("lists");
const function_NAME = "FETCH_supabaseLists";
const validSuapabse_METHODS = {
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  abortSignal: jest.fn().mockReturnThis(),
};

const GET_errorObjContent = (internal_MSG: string) => ({
  error_TYPE: "internal",
  user_MSG: ExtendSupabaseListQuery_ERRS.user.defaultInternal_MSG,
  internal_MSG: internal_MSG,
  function_NAME,
});

describe("FETCH_supabaseLists arguments", () => {
  it("1. Handles invalid list type", async () => {
    const invalidArgs = {
      type: undefined,
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.not_public_and_not_shared
        )
      ),
    });
  });
  it("2. Handles undefined list_ids when type is 'shared'", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: undefined,
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.shared_but_listIds_undefined
        )
      ),
    });
  });
  it("3. Search value that is not a string", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: {},
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.search_value_isnt_string
        )
      ),
    });
  });
  it("4. Handle undefined z_listDisplay_SETTINGS", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.z_display_settings_undefined
        )
      ),
    });
  });
  it("5. Handle language filters that aren't in an array", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: {},
      },
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.lang_filters_isnt_array
        )
      ),
    });
  });

  it("6. Handle language filters that aren't strings", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", {}, "fr"],
      },
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.lang_filters_arent_strings
        )
      ),
    });
  });

  it("7. Handle invalid sorting", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "something",
      },
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.invalid_sorting
        )
      ),
    });
  });
  it("8. Handle invalid sort direction", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "something",
      },
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.invalid_sort_direction
        )
      ),
    });
  });
  it("9. Handle invalid pagination start", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: "something",
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.undefined_query_start
        )
      ),
    });
  });
  it("10. Handle invalid pagination end", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: 1,
      end: "something",
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.undefined_query_end
        )
      ),
    });
  });
  it("10. Handle pagination end being smaller than start", async () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: 6,
      end: 5,
    };

    const result = await FETCH_supabaseLists(invalidArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_end_is_smaller_than_start
        )
      ),
    });
  });
});
describe("FETCH_supabaseLists validate query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validArgs = {
    type: "shared",
    list_ids: ["id1", "id2"],
    search: "example",
    z_listDisplay_SETTINGS: {
      langFilters: ["en", "fr"],
      sorting: "date",
      sortDirection: "ascending",
    },
    start: 0,
    end: 10,
  };

  it("1. Handles undefined query", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = undefined;

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_undefined
        )
      ),
    });
  });

  it("2. Handles undefined 'eq' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      in: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
      range: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_eq
        )
      ),
    });
  });

  it("3. Handles undefined 'in' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      eq: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
      range: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_in
        )
      ),
    });
  });

  it("4. Handles undefined 'or' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      eq: jest.fn(),
      in: jest.fn(),
      order: jest.fn(),
      range: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_or
        )
      ),
    });
  });

  it("5. Handles undefined 'order' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      eq: jest.fn(),
      in: jest.fn(),
      or: jest.fn(),
      range: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_order
        )
      ),
    });
  });
  it("6. Handles undefined 'range' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      eq: jest.fn(),
      in: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_range
        )
      ),
    });
  });
  it("7. Handles undefined 'abortSignal' method", async () => {
    // Mock the query object missing the `eq` method
    const mockQuery = {
      eq: jest.fn(),
      in: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
      range: jest.fn(),
    };

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining(
        GET_errorObjContent(
          ExtendSupabaseListQuery_ERRS.internal
            .query_doesnt_have_method_abortSignal
        )
      ),
    });
  });
});
describe("FETCH_supabaseLists apply filters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validArgs = {
    type: "shared",
    list_ids: ["id1", "id2"],
    search: "example",
    z_listDisplay_SETTINGS: {
      langFilters: ["en", "fr"],
      sorting: "date",
      sortDirection: "ascending",
    },
    start: 0,
    end: 10,
  };
  it("1. Calls everything successfully", async () => {
    // Mock the query object with chainable methods

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(validSuapabse_METHODS),
    });

    await FETCH_supabaseLists(validArgs as any);

    expect(validSuapabse_METHODS.eq).toHaveBeenCalledWith("type", "shared");
    expect(validSuapabse_METHODS.in).toHaveBeenCalledWith("id", ["id1", "id2"]);
    expect(validSuapabse_METHODS.or).toHaveBeenCalledWith(
      `name.ilike.%example%,description.ilike.%example%`
    );
    expect(validSuapabse_METHODS.or).toHaveBeenCalledWith(
      `collected_lang_ids.ilike.%en%,collected_lang_ids.ilike.%fr%`
    );
    expect(validSuapabse_METHODS.order).toHaveBeenCalledWith("created_at", {
      sort_direction: "ascending",
    });
    expect(validSuapabse_METHODS.range).toHaveBeenCalledWith(0, 9); // end - 1
    expect(validSuapabse_METHODS.abortSignal).toHaveBeenCalled();
  });
  it("2. Doesn't apply list_ids when 'type' !== shared", async () => {
    const args = {
      type: "public",
      list_ids: ["id1", "id2"],
      search: "example",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: 0,
      end: 10,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(validSuapabse_METHODS),
    });

    await FETCH_supabaseLists(args as any);

    expect(validSuapabse_METHODS.in).not.toHaveBeenCalledWith("id", [
      "id1",
      "id2",
    ]);
  });
  it("3. Doesn't apply empty lang ids", async () => {
    const args = {
      type: "public",
      list_ids: ["id1", "id2"],
      search: "example",
      z_listDisplay_SETTINGS: {
        langFilters: [],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: 0,
      end: 10,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(validSuapabse_METHODS),
    });

    await FETCH_supabaseLists(args as any);

    expect(validSuapabse_METHODS.or).not.toHaveBeenCalledWith(
      `collected_lang_ids.ilike.%en%,collected_lang_ids.ilike.%fr%`
    );
  });
  it("4. Applies 0,0 pagination if 'start' and 'end - 1' are the same", async () => {
    const args = {
      type: "public",
      list_ids: ["id1", "id2"],
      search: "example",
      z_listDisplay_SETTINGS: {
        langFilters: [],
        sorting: "date",
        sortDirection: "ascending",
      },
      start: 9,
      end: 10,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(validSuapabse_METHODS),
    });

    await FETCH_supabaseLists(args as any);

    expect(validSuapabse_METHODS.range).toHaveBeenCalledWith(0, 0);
  });
});
describe("FETCH_supabaseLists handling the fetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validArgs = {
    type: "shared",
    list_ids: ["id1", "id2"],
    search: "example",
    z_listDisplay_SETTINGS: {
      langFilters: ["en", "fr"],
      sorting: "date",
      sortDirection: "ascending",
    },
    start: 0,
    end: 10,
  };
  it("1. Handle supabase error properly", async () => {
    const mockError: PostgrestError = {
      code: "multi-error",
      message: "Multiple issues occurred",
      details: "Error1; Error2; Error3",
      hint: "Check your query",
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        abortSignal: jest.fn().mockReturnValue({
          data: null,
          error: mockError,
          count: 0,
        }),
      }),
    });

    const result = await FETCH_supabaseLists(validArgs as any);

    expect(result).toEqual({
      data: { lists: [], count: 0 },
      error: expect.objectContaining({
        error_TYPE: "internal",
        internal_MSG:
          ExtendSupabaseListQuery_ERRS.internal.failed_supabase_fetch,
        user_MSG: ExtendSupabaseListQuery_ERRS.user.defaultInternal_MSG,
        function_NAME: "FETCH_supabaseLists",
        error_DETAILS: mockError,
      }),
    });
  });
  it("2. Should handle abort signal correctly", async () => {
    const mockError: PostgrestError = {
      code: "abort-error",
      message: "Query aborted",
      details: "Request was canceled",
      hint: "Abort signal was triggered",
    };

    // Create a mock AbortController
    const abortController = new AbortController();

    // Mock the supabase query behavior with abortSignal handling
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        abortSignal: jest.fn().mockImplementation(() => {
          // Simulate that the operation is aborted
          abortController.abort(); // Abort the request immediately
          return Promise.reject(mockError); // Return an error to simulate the abort scenario
        }),
      }),
    });

    // Set the abort signal to be passed to the function
    const resultPromise = FETCH_supabaseLists({
      type: "public",
      list_ids: ["list1"],
      search: "test",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "date",
        sortDirection: "ascending",
      },
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
