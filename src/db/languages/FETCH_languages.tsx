//
//
//

import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export default function USE_fetchLangs() {
  const [ARE_langsLoading, SET_areLangsLoading] = useState(false);

  const FETCH_langs = async (ids: string[] = []) => {
    try {
      SET_areLangsLoading(true);

      const query = supabase.from("languages").select("*");
      if (ids.length > 0) {
        query.in("id", ids); // Fetch by IDs if provided
      }

      const { data, error } = await query;

      if (error) {
        console.log("🔴 Error fetching languages 🔴 : ", error);
        return { success: false, msg: "🔴 Error fetching languages 🔴" };
      }
      return { success: true, data };
    } catch (error) {
      console.log("🔴 Error fetching languages 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching languages 🔴" };
    } finally {
      SET_areLangsLoading(false); // Ensure the loading state is reset
    }
  };

  return { FETCH_langs, ARE_langsLoading };
}
