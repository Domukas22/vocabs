import { supabase } from "@/src/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import CHECK_ifNetworkFailure from "@/src/utils/CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";
import {
  fetchListParticipants_ERRS,
  FETCH_listParticipants,
} from "./FETCH_listParticipants";

// Mock external dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({}),
    }),
  },
}));
jest.mock("@/src/utils/CHECK_ifNetworkFailure", () => jest.fn());

describe("FETCH_listParticipants", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Throws error if list_id is undefined", async () => {
    await expect(
      FETCH_listParticipants({ list_id: undefined, owner_id: "owner123" })
    ).resolves.toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.noListId,
      }),
    });
  });

  it("2. Throws error if owner_id is undefined", async () => {
    await expect(
      FETCH_listParticipants({ list_id: "list123", owner_id: undefined })
    ).resolves.toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.noOwnerId,
      }),
    });
  });

  it("3. Returns empty data if no participants are found", async () => {
    // Mocking the supabase chain properly
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [] }), // Resolve the final promise
      }),
    });

    // Call your function
    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    // Expectation for empty data
    expect(result).toEqual({
      data: [],
    });
  });

  it("4. Handles network failure gracefully", async () => {
    const mockError: PostgrestError = {
      code: "fetch-failed",
      message: "Network failure",
      details: "",
      hint: "",
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: mockError }),
      }),
    });

    (CHECK_ifNetworkFailure as jest.Mock).mockReturnValue(true);

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "user_network",
        user_MSG: fetchListParticipants_ERRS.user.networkFailure,
      }),
    });
  });

  it("5. Handles Supabase error not caused by network failure", async () => {
    const mockError: PostgrestError = {
      code: "some-error",
      message: "Database error",
      details: "Details of the error",
      hint: "",
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: mockError }),
      }),
    });

    (CHECK_ifNetworkFailure as jest.Mock).mockReturnValue(false);

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.failedSupabaseFetch,
        error_DETAILS: mockError,
      }),
    });
  });

  it("6. Throws error if list_id is an empty string", async () => {
    await expect(
      FETCH_listParticipants({ list_id: "", owner_id: "owner123" })
    ).resolves.toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.noListId,
      }),
    });
  });

  it("7. Throws error if owner_id is an empty string", async () => {
    await expect(
      FETCH_listParticipants({ list_id: "list123", owner_id: "" })
    ).resolves.toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.noOwnerId,
      }),
    });
  });
  it("8. Handles null data from Supabase gracefully", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null }),
      }),
    });

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: [],
    });
  });
  it("9. Handles multiple errors from Supabase", async () => {
    const mockError: PostgrestError = {
      code: "multi-error",
      message: "Multiple issues occurred",
      details: "Error1; Error2; Error3",
      hint: "Check your query",
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: mockError }),
      }),
    });

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.failedSupabaseFetch,
        error_DETAILS: mockError,
      }),
    });
  });
  it("10. Handles invalid data shape gracefully", async () => {
    const invalidData = [{ invalidField: "unexpected" }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: invalidData }),
      }),
    });

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.invalidDataReturned,
      }),
    });
  });
  it("11. Success", async () => {
    const mockData = [
      { id: "user1", username: "User One" },
      { id: "user2", username: "User Two" },
    ];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: mockData }),
      }),
    });

    const result = await FETCH_listParticipants({
      list_id: "list123",
      owner_id: "owner123",
    });

    expect(result).toEqual({
      data: mockData,
    });
  });
});
