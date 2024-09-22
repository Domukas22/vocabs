//
//
//
import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "../models";

export default function SUBSCRIBE_toVocabsForLists({ SET_lists }) {
  return supabase
    .channel("vocabs-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "vocabs" },
      (payload) => {
        // Handle insert, update, delete
        if (payload.eventType === "INSERT") {
          // Assuming that you have logic to add the vocab to the correct list
          // You might want to implement a method to do this
        } else if (payload.eventType === "UPDATE") {
          SET_lists((prevLists: List_MODEL[]) =>
            prevLists.map((list) => {
              // Update the specific vocab in the corresponding list
              return {
                ...list,
                vocabs: list.vocabs?.map((vocab) =>
                  vocab.id === payload.new.id
                    ? { ...vocab, ...payload.new }
                    : vocab
                ),
              };
            })
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
}
