//
//
//

import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand_store";
import { useState } from "react";

export async function FETCH_lists() {
  try {
    const { data, error } = await supabase.from("lists").select("*");

    if (error) {
      console.log("🔴 Error fetching user lists 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching user lists 🔴" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error fetching user lists 🔴 : ", error);
    return { success: false, msg: "🔴 Error fetching user lists 🔴" };
  }
}
