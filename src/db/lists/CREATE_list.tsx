//
//
//
import { supabase } from "@/src/lib/supabase";

export default async function CREATE_list({
  name,
  user_id,
}: {
  name: string;
  user_id: string;
}) {
  try {
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name, user_id }])
      .select();

    if (error) {
      console.log("🔴 Error creating list 🔴 : ", error);
      return { success: false, msg: "🔴 Error creating list 🔴" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error creating list 🔴 : ", error);
    return { success: false, msg: "🔴 Error creating list 🔴" };
  }
}
