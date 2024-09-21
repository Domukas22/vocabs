//
//
//

import { supabase } from "@/src/lib/supabase";

export default function SUBSCRIBE_toVocabs({ SET_vocabs }) {
  return supabase
    .channel("lists-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "vocabs" },
      (payload) => {
        console.log("Change received!", payload);

        // Handle insert, update, delete
        if (payload.eventType === "INSERT") {
          SET_vocabs((prevLists) => [...prevLists, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          SET_vocabs((prevLists) =>
            prevLists.map((list) =>
              list.id === payload.new.id ? payload.new : list
            )
          );
        } else if (payload.eventType === "DELETE") {
          SET_vocabs((prevLists) =>
            prevLists.filter((list) => list.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();
}
