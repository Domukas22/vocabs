//
//
//
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

export interface CreateList_PROPS {
  name: string;
  user_id: string;
}

export default function USE_createList() {
  const [IS_creatingList, SET_creatingList] = useState(false);
  const [createList_ERROR, SET_createListError] = useState<string | null>(null);

  const { z_CREATE_privateList } = USE_zustand();
  const toast = useToast();
  const { t } = useTranslation();

  const CREATE_list = async ({
    name,
    user_id,
  }: CreateList_PROPS): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    try {
      SET_creatingList(true);
      SET_createListError(null); // Reset error state before creating the list

      const { data, error } = await supabase
        .from("lists")
        .insert([{ name, user_id }])
        .select()
        .single();

      console.log(data);

      // Handle potential errors
      if (error) {
        console.error("🔴 Error creating list: 🔴", error);
        SET_createListError("🔴 Error creating list 🔴");
        return { success: false, msg: "🔴 Error creating list 🔴" };
      }

      z_CREATE_privateList(data);
      console.log("🟢 List created 🟢");
      toast.show(t("notifications.listCreated"), {
        type: "green",
        duration: 2000,
      });

      return { success: true, data };
    } catch (error) {
      console.error("🔴 Unexpected error creating list: 🔴", error);
      SET_createListError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_creatingList(false); // Always stop loading after the request
    }
  };

  return { CREATE_list, IS_creatingList, createList_ERROR };
}
