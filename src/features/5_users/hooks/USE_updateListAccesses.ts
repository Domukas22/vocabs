import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_updateListAccesses() {
  const [ARE_accessesUpdating, SET_accessesUpdating] = useState(false);
  const [accessesUpdate_ERROR, SET_error] = useState<string | null>(null);

  const UPDATE_listAccesses = useCallback(
    async ({
      owner_id,
      list_id,
      participant_ids,
    }: {
      owner_id: string;
      list_id: string;
      participant_ids: string[];
    }) => {
      SET_accessesUpdating(true);
      SET_error(null);

      try {
        // Step 1: Fetch current list accesses for the specific owner and list
        const { data: currentAccessesData, error: fetchError } = await supabase
          .from("list_accesses")
          .select("participant_id")
          .eq("owner_id", owner_id)
          .eq("list_id", list_id);

        if (fetchError) {
          console.error("Error fetching current list accesses:", fetchError);
          SET_error("🔴 Error fetching current list accesses. 🔴");
          return {
            success: false,
            msg: "🔴 Error fetching current list accesses. 🔴",
            error: fetchError.message,
          };
        }

        // Step 2: Create an array of existing participant IDs
        const existingParticipantIds =
          currentAccessesData?.map((access) => access.participant_id) || [];

        // Step 3: Identify participants to add and remove
        const participantsToAdd = participant_ids.filter(
          (id) => !existingParticipantIds.includes(id)
        );

        const participantsToRemove = existingParticipantIds.filter(
          (id) => !participant_ids.includes(id)
        );

        // Step 4: Add new participants
        const addPromises = participantsToAdd.map((participant_id) =>
          supabase
            .from("list_accesses")
            .insert([{ owner_id, list_id, participant_id }])
        );

        // Step 5: Remove participants who are no longer part of the list
        const removePromises = participantsToRemove.map((participant_id) =>
          supabase
            .from("list_accesses")
            .delete()
            .eq("owner_id", owner_id)
            .eq("list_id", list_id)
            .eq("participant_id", participant_id)
        );

        // Step 6: Wait for all promises to resolve
        await Promise.all([...addPromises, ...removePromises]);

        return {
          success: true,
          msg: "🟢 List accesses updated successfully. 🟢",
          error: null,
        };
      } catch (error) {
        console.error("🔴 Unexpected error updating list accesses: 🔴", error);
        SET_error("🔴 Unexpected error occurred. 🔴");
        return {
          success: false,
          msg: "🔴 Unexpected error occurred. 🔴",
          error: error?.message,
        };
      } finally {
        SET_accessesUpdating(false);
      }
    },
    []
  ); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { UPDATE_listAccesses, ARE_accessesUpdating, accessesUpdate_ERROR };
}
