//
//
//

import List_MODEL from "@/src/db/models/List_MODEL";
import User_MODEL from "@/src/db/models/User_MODEL";
import RENAME_list from "./RENAME_list";
import { renameList_ERRS } from "./RENAME_list";
import { RenameList_ARGS, RenameList_RESPONSE } from "./types";

// Mock external dependencies
jest.mock("@/src/utils/SEND_internalError", () => jest.fn());

// 1. Name not provided
// 2. Provided same name
// 3. User object undefined
// 4. List name taken
// 5. List object undefined
// 6. Watermelon rename failed
// 7. Success

describe("RENAME_list", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Name not provided", async () => {
    const result = await RENAME_list({
      user: { id: "xxx" } as User_MODEL,
      list: { id: "xxx", name: "Old Name" } as List_MODEL,
      new_NAME: "", // empty name
    });

    expect(result).toEqual({
      data: false,
      error: expect.objectContaining({
        error_TYPE: "form_input",
        user_MSG: renameList_ERRS.user.falsyInput,
        falsyForm_INPUTS: [
          {
            input_NAME: "name",
            message: "Please provide a new name for the list",
          },
        ],
      }),
    });
  });

  it("2. Provided same name", async () => {
    const result = await RENAME_list({
      user: { id: "xxx" } as User_MODEL,
      list: { id: "xxx", name: "Old name" } as List_MODEL,
      new_NAME: "Old name", // same name
    });

    expect(result.data).toBe(true);
  });

  it("3. User object undefined", async () => {
    const result = await RENAME_list({
      user: undefined, // User undefined
      list: { id: "xxx" } as List_MODEL,
      new_NAME: "New List Name",
    });

    expect(result).toEqual({
      data: false,
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: renameList_ERRS.user.defaultmessage,
        message: renameList_ERRS.internal.userUndefined,
      }),
    });
  });

  it("4. List name taken", async () => {
    const args: RenameList_ARGS = {
      user: {
        id: "xxx",
        DOES_userHaveListWithThisName: jest.fn().mockResolvedValue(true),
      } as unknown as User_MODEL,
      list: { id: "xxx", name: "Old Name" } as List_MODEL,
      new_NAME: "New List Name", // Mock a name that is taken
    };

    const result: RenameList_RESPONSE = await RENAME_list(args);

    expect(result).toEqual({
      data: false,
      error: expect.objectContaining({
        error_TYPE: "form_input",
        user_MSG: renameList_ERRS.user.falsyInput,
        falsyForm_INPUTS: renameList_ERRS.user.listNameTaken_OBJ,
      }),
    });
  });

  it("5. List object undefined", async () => {
    const result = await RENAME_list({
      user: {
        id: "xxx",
        DOES_userHaveListWithThisName: jest.fn().mockResolvedValue(false),
      } as unknown as User_MODEL,
      list: undefined, // list undefined
      new_NAME: "New List Name",
    });

    expect(result).toEqual({
      data: false,
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: renameList_ERRS.user.defaultmessage,
        message: renameList_ERRS.internal.listUndefined,
      }),
    });
  });

  it("6. Watermelon rename failed", async () => {
    const result = await RENAME_list({
      user: {
        id: "xxx",
        DOES_userHaveListWithThisName: jest.fn().mockResolvedValue(false),
      } as unknown as User_MODEL,
      list: {
        id: "xxx",
        name: "Old Name",
        rename: jest.fn().mockResolvedValue(false),
      } as unknown as List_MODEL, // Cast to 'unknown' then to 'List_MODEL'
      new_NAME: "New List Name",
    });

    expect(result).toEqual({
      data: false,
      error: expect.objectContaining({
        error_TYPE: "internal",
        user_MSG: renameList_ERRS.user.defaultmessage,
        message: renameList_ERRS.internal.watermelonRename,
      }),
    });
  });
  it("7. Success", async () => {
    const result = await RENAME_list({
      user: {
        id: "xxx",
        DOES_userHaveListWithThisName: jest.fn().mockResolvedValue(false),
      } as unknown as User_MODEL,
      list: {
        id: "xxx",
        name: "Old Name",
        rename: jest.fn().mockResolvedValue(true),
      } as unknown as List_MODEL, // Cast to 'unknown' then to 'List_MODEL'
      new_NAME: "New List Name",
    });

    expect(result).toEqual({
      data: true,
    });
  });
});
