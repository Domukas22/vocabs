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
        SET_lists((prevLists: List_MODEL[]) => {
          return prevLists.map((list) => {
            if (
              list.id === payload.new.list_id ||
              list.id === payload.old?.list_id
            ) {
              // Handle INSERT event
              if (payload.eventType === "INSERT") {
                return {
                  ...list,
                  vocabs: [...(list.vocabs || []), payload.new],
                };
              }

              // Handle UPDATE event
              if (payload.eventType === "UPDATE") {
                return {
                  ...list,
                  vocabs: list.vocabs?.map((vocab) =>
                    vocab.id === payload.new.id
                      ? { ...vocab, ...payload.new }
                      : vocab
                  ),
                };
              }

              // Handle DELETE event
              if (payload.eventType === "DELETE") {
                return {
                  ...list,
                  vocabs: list.vocabs?.filter(
                    (vocab) => vocab.id !== payload.old.id
                  ),
                };
              }
            }

            // Return the list unchanged if no relevant changes occurred
            return list;
          });
        });
      }
    )
    .subscribe();

  // Return the unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}
