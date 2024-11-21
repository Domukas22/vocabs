//
//
//

import { List_MODEL } from "@/src/db/watermelon_MODELS";
import RENAME_list, {
  RenameList_ARGS,
  RenameList_RESPONSE,
} from "./RENAME_list";

// Describe the test suite
describe("RENAME_list function", () => {
  it("should return an error when user is not defined", async () => {
    // Arrange: Define test inputs
    const args: RenameList_ARGS = {
      user: undefined, // User is not defined
      list: { id: "xxx" } as List_MODEL,
      new_NAME: "xxx",
    };

    // Act: Call the function
    const result: RenameList_RESPONSE = await RENAME_list(args);

    // Assert: Check the expected behavior
    expect(result.success).toBe(false);
    expect(result.error).toBe("User object undefined when renaming list");
    expect(result.error).toBe("internal");
  });
});
