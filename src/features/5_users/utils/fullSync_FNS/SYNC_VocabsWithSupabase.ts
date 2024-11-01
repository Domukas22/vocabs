//
//
//

import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import { Vocab_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb"; // Ensure you have the query functions imported

export default async function SYNC_vocabsWithSupabase({
  supabase_VOCABS = [],
  watermelon_USER,
}: {
  supabase_VOCABS: Vocab_MODEL[] | undefined;
  watermelon_USER: User_MODEL | undefined;
}) {
  if (!watermelon_USER) return;

  // Fetch existing vocabs from WatermelonDB
  const existing_VOCABS = await Vocabs_DB.query(
    Q.where("user_id", watermelon_USER.id)
  ).fetch();

  // Create a Set of existing vocab IDs for quick lookup
  const existingVocabIds = new Set(existing_VOCABS.map((vocab) => vocab.id));

  // Prepare a batch operation for performance
  await db.write(async () => {
    for (const supabaseVocab of supabase_VOCABS) {
      if (!existingVocabIds.has(supabaseVocab.id)) {
        // Create new vocab if it doesn't exist

        const target_LIST = await Lists_DB.query(
          Q.where("id", supabaseVocab?.list?.id || "")
        );

        if (!target_LIST?.[0]) return; // log out an error, but dont stop the fucntion, just skip this vocab

        await Vocabs_DB.create((vocab) => {
          vocab.user.set(watermelon_USER);
          vocab.list.set(target_LIST?.[0]);

          vocab.difficulty = supabaseVocab.difficulty;
          vocab.description = supabaseVocab.description;

          vocab.trs = supabaseVocab.trs;
          vocab.lang_ids = supabaseVocab.lang_ids;
          vocab.searchable = supabaseVocab.searchable;

          vocab.is_marked = supabaseVocab.is_marked;
        });
      } else {
        // Update existing vocab
        const existingVocab = existing_VOCABS.find(
          (vocab) => vocab.id === supabaseVocab.id
        );

        if (existingVocab) {
          const current_LIST = await Lists_DB.query(
            Q.where("id", existingVocab?.list?.id || "")
          );
          const listPoitedAtOnSupabase_LIST = await Lists_DB.query(
            Q.where("id", supabaseVocab?.list?.id || "")
          );

          if (!listPoitedAtOnSupabase_LIST?.[0] && !current_LIST?.[0]) return; // log out an error, but dont stop the fucntion, just skip this vocab

          await existingVocab.update((vocab) => {
            vocab.list.set(
              !listPoitedAtOnSupabase_LIST?.[0] || !current_LIST?.[0]
            );

            vocab.difficulty = supabaseVocab.difficulty;
            vocab.description = supabaseVocab.description;

            vocab.trs = supabaseVocab.trs;
            vocab.lang_ids = supabaseVocab.lang_ids;
            vocab.searchable = supabaseVocab.searchable;

            vocab.is_marked = supabaseVocab.is_marked;
          });
        }
      }
    }
  });
}
