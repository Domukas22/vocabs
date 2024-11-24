import { supabase } from "@/src/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import CHECK_ifNetworkFailure from "@/src/utils/CHECK_ifNetworkFailure";
import FETCH_listIdsSharedWithMe, { errs } from "./FETCH_listIdsSharedWithMe";

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

describe("FETCH_listIdsSharedWithMe", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Helper to mock Supabase and return custom data
  const mockSupabaseResponse = (response: any) => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue(response),
    });
  };

  // Helper to mock network failure
  const mockNetworkFailure = (isNetworkFailure: boolean) => {
    (CHECK_ifNetworkFailure as jest.Mock).mockReturnValue(isNetworkFailure);
  };

  // Common expected error structure
  const commonError = (internalMessage: string, userMessage: string) => ({
    data: [],
    error: expect.objectContaining({
      error_TYPE: "internal",
      user_MSG: userMessage,
      internal_MSG: internalMessage,
    }),
  });

  it.each([
    [undefined, errs.internal.noUserId],
    ["", errs.internal.noUserId],
  ])("1. Throws error if user_id is %p", async (user_id, expectedMessage) => {
    await expect(FETCH_listIdsSharedWithMe(user_id as any)).resolves.toEqual(
      commonError(errs.internal.noUserId, errs.user.defaultInternal_MSG)
    );
  });

  it("2. Returns empty data if no accesses are found", async () => {
    mockSupabaseResponse({ data: [] });
    const result = await FETCH_listIdsSharedWithMe("user123");
    expect(result).toEqual({ data: [] });
  });

  it("3. Handles network failure gracefully", async () => {
    const mockError: PostgrestError = {
      code: "fetch-failed",
      message: "Network failure",
      details: "",
      hint: "",
    };
    mockSupabaseResponse({ error: mockError });
    mockNetworkFailure(true);

    const result = await FETCH_listIdsSharedWithMe("user123");

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "user_network",
        user_MSG: errs.user.networkFailure,
      }),
    });
  });

  it("4. Handles Supabase error not caused by network failure", async () => {
    const mockError: PostgrestError = {
      code: "some-error",
      message: "Database error",
      details: "Details of the error",
      hint: "",
    };
    mockSupabaseResponse({ error: mockError });
    mockNetworkFailure(false);

    const result = await FETCH_listIdsSharedWithMe("user123");

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: errs.user.defaultInternal_MSG,
        internal_MSG: errs.internal.failedSupabaseFetch,
        error_DETAILS: mockError,
      }),
    });
  });

  it("5. Returns valid data when accesses are found", async () => {
    const mockData = [{ list_id: "list1" }, { list_id: "list2" }];
    mockSupabaseResponse({ data: mockData });

    const result = await FETCH_listIdsSharedWithMe("user123");

    expect(result).toEqual({ data: mockData });
  });

  it("6. Handles invalid data format returned by Supabase", async () => {
    const mockData = [{ wrong_field: "value" }];
    mockSupabaseResponse({ data: mockData });

    const result = await FETCH_listIdsSharedWithMe("user123");

    expect(result).toEqual({
      data: [],
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: errs.user.defaultInternal_MSG,
        internal_MSG: errs.internal.invalidDataReturned,
      }),
    });
  });
});
