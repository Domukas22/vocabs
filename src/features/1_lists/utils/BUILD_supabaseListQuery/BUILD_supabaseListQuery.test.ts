//
//
//

import BUILD_supabaseListQuery from "./BUILD_supabaseListQuery";
import { supabase } from "@/src/lib/supabase";
import { ExtendSupabaseListQuery_ERRS } from "./types";

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
const function_NAME = "EXTEND_supabaseListQuery";
const validSuapabse_METHODS = {
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  abortSignal: jest.fn().mockReturnThis(),
};

const GET_error = (internal_MSG: string) => ({
  error: {
    error_TYPE: "internal",
    user_MSG: ExtendSupabaseListQuery_ERRS.user.defaultInternal_MSG,
    internal_MSG: internal_MSG,
    function_NAME,
  },
});

describe("BUILD_supabaseListQuery arguments", () => {
  it("1. Handles invalid list type", () => {
    const invalidArgs = {
      type: undefined,
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.not_public_and_not_shared)
    );
  });
  it("2. Handles undefined list_ids when type is 'shared'", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: undefined,
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.shared_but_listIds_undefined
      )
    );
  });
  it("3. Search value that is not a string", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: {},
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.search_value_isnt_string)
    );
  });
  it("4. Handle undefined z_listDisplay_SETTINGS", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.z_display_settings_undefined
      )
    );
  });
  it("5. Handle language filters that aren't in an array", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: {},
      },
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.lang_filters_isnt_array)
    );
  });

  it("6. Handle language filters that aren't strings", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", {}, "fr"],
      },
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.lang_filters_arent_strings
      )
    );
  });

  it("7. Handle invalid sorting", () => {
    const invalidArgs = {
      type: "shared",
      list_ids: ["id1"],
      search: "search",
      z_listDisplay_SETTINGS: {
        langFilters: ["en", "fr"],
        sorting: "something",
      },
    };

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.invalid_sorting)
    );
  });
  it("8. Handle invalid sort direction", () => {
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

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.invalid_sort_direction)
    );
  });
  it("9. Handle invalid pagination start", () => {
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

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.undefined_query_start)
    );
  });
  it("10. Handle invalid pagination end", () => {
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

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.undefined_query_end)
    );
  });
  it("10. Handle pagination end being smaller than start", () => {
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

    const result = BUILD_supabaseListQuery(invalidArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_end_is_smaller_than_start
      )
    );
  });
});
describe("BUILD_supabaseListQuery query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockQuery = mockSupabase.select() as any;

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

  it("1. Handles undefined query", () => {
    // Mock the query object missing the `eq` method
    const mockQuery = undefined;

    // Mock the Supabase `from` function to return the mocked query
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(mockQuery),
    });

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(ExtendSupabaseListQuery_ERRS.internal.query_undefined)
    );
  });

  it("2. Handles undefined 'eq' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_eq
      )
    );
  });

  it("3. Handles undefined 'in' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_in
      )
    );
  });

  it("4. Handles undefined 'or' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_or
      )
    );
  });

  it("5. Handles undefined 'order' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_order
      )
    );
  });
  it("6. Handles undefined 'range' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal.query_doesnt_have_method_range
      )
    );
  });
  it("6. Handles undefined 'abortSignal' method", () => {
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

    const result = BUILD_supabaseListQuery(validArgs as any);

    expect(result).toEqual(
      GET_error(
        ExtendSupabaseListQuery_ERRS.internal
          .query_doesnt_have_method_abortSignal
      )
    );
  });
});
describe("BUILD_supabaseListQuery apply filters", () => {
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

    const query: any = BUILD_supabaseListQuery(validArgs as any);
    query.abortSignal();

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

    BUILD_supabaseListQuery(args as any);

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

    BUILD_supabaseListQuery(args as any);

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

    BUILD_supabaseListQuery(args as any);

    expect(validSuapabse_METHODS.range).toHaveBeenCalledWith(0, 0);
  });
});
