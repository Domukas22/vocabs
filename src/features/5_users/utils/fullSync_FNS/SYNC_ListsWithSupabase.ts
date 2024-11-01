//
//
//

import db, { Lists_DB } from "@/src/db";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb"; // Ensure you have the query functions imported

export default async function SYNC_ListsWithSupabase({
  supabase_LISTS = [],
  watermelon_USER,
}: {
  supabase_LISTS: List_MODEL[] | undefined;
  watermelon_USER: User_MODEL | undefined;
}) {
  if (!watermelon_USER) return;

  // Fetch existing lists from WatermelonDB
  const existing_LISTS = await Lists_DB.query(
    Q.where("user_id", watermelon_USER.id)
  ).fetch();

  // Create a Set of existing list IDs for quick lookup
  const existingListIds = new Set(existing_LISTS.map((list) => list.id));

  console.log(
    "Existing lists: ",
    existing_LISTS.map((list) => list.id)
  );
  console.log(
    "Incoming list ids: ",
    supabase_LISTS?.map((l) => l.id)
  );

  // Prepare a batch operation for performance
  await db.write(async () => {
    for (const supabaseList of supabase_LISTS) {
      if (!existingListIds.has(supabaseList.id)) {
        // Create new list if it doesn't exist
        await Lists_DB.create((list) => {
          list._raw.id = supabaseList.id;
          list.user.set(watermelon_USER);
          list.original_creator.set(watermelon_USER);

          list.name = supabaseList.name;
          list.type = supabaseList.type;

          list.saved_count = supabaseList.saved_count;
          list.description = supabaseList.description;

          list.default_lang_ids = supabaseList.default_lang_ids;
          list.collected_lang_ids = supabaseList.collected_lang_ids;

          list.is_submitted_for_publish = supabaseList.is_submitted_for_publish;
          list.was_accepted_for_publish = supabaseList.was_accepted_for_publish;
        });
      } else {
        // Update existing list
        const existingList = existing_LISTS.find(
          (list) => list.id === supabaseList.id
        );
        if (existingList) {
          await existingList.update((list) => {
            list.name = supabaseList.name;
            list.description = supabaseList.description;

            list.is_submitted_for_publish =
              supabaseList.is_submitted_for_publish;
            list.was_accepted_for_publish =
              supabaseList.was_accepted_for_publish;

            list.type = supabaseList.type;
            list.saved_count = supabaseList.saved_count;

            list.collected_lang_ids = supabaseList.collected_lang_ids;
            list.default_lang_ids = supabaseList.default_lang_ids;
          });
        }
      }
    }
  });
}
