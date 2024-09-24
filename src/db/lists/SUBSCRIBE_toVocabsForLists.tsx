//
//
//
import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "../models";

export default function SUBSCRIBE_toVocabsForLists({ SET_lists }) {
  const subscription = supabase
    .channel("vocabs-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "vocabs" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          // Custom logic to handle vocab insertions
        } else if (payload.eventType === "UPDATE") {
          SET_lists((prevLists: List_MODEL[]) =>
            prevLists.map((list) => ({
              ...list,
              vocabs: list.vocabs?.map((vocab) =>
                vocab.id === payload.new.id
                  ? { ...vocab, ...payload.new }
                  : vocab
              ),
            }))
          );
        } else if (payload.eventType === "DELETE") {
          SET_lists((prevLists: List_MODEL[]) =>
            prevLists.map((list) => ({
              ...list,
              vocabs: list.vocabs?.filter(
                (vocab) => vocab.id !== payload.old.id
              ),
            }))
          );
        }
      }
    )
    .subscribe();

  // Return the unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}
