//
//
//

import { supabase } from "@/src/lib/supabase";

export default function SUBSCRIBE_toLists({ SET_lists }) {
  return supabase
    .channel("lists-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "lists" },
      (payload) => {
        // console.log("List change received!", payload);

        // Handle insert, update, delete
        if (payload.eventType === "INSERT") {
          SET_lists((prevLists) => [...prevLists, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          SET_lists((prevLists) =>
            prevLists.map((list) =>
              list.id === payload.new.id ? payload.new : list
            )
          );
        } else if (payload.eventType === "DELETE") {
          SET_lists((prevLists) =>
            prevLists.filter((list) => list.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();
}
