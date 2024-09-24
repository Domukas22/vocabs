//
//
//

import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "../models";
import React from "react";

export default function SUBSCRIBE_toLists({
  SET_lists,
  totalListCount,
  SET_totalListCount,
}: {
  SET_lists: React.Dispatch<React.SetStateAction<List_MODEL[]>>;
  totalListCount: number | null;
  SET_totalListCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const subscription = supabase
    .channel("lists-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "lists" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          SET_lists((prevLists: List_MODEL[]) => [payload.new, ...prevLists]);
          SET_totalListCount((prev) => prev + 1);
        } else if (payload.eventType === "UPDATE") {
          SET_lists((prevLists: List_MODEL[]) =>
            prevLists.map((list) =>
              list.id === payload.new.id ? payload.new : list
            )
          );
        } else if (payload.eventType === "DELETE") {
          SET_lists((prevLists: List_MODEL[]) =>
            prevLists.filter((list) => list.id !== payload.old.id)
          );
          SET_totalListCount((prev) => prev - 1);
        }
      }
    )
    .subscribe();

  // Return the unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}
