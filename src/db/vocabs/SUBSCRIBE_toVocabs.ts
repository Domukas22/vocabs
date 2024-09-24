//
//
//

import { supabase } from "@/src/lib/supabase";

export default function SUBSCRIBE_toVocabs({ SET_vocabs }) {
  const fetchVocabWithTranslations = async (id: string) => {
    const { data, error } = await supabase
      .from("vocabs")
      .select(
        `
        *,
        translations(*)
      `
      )
      .eq("id", id);

    if (error) {
      console.log("🔴 Error fetching vocab with translations 🔴 : ", error);
      return null;
    }

    return data[0]; // Return the fetched vocab
  };

  return supabase
    .channel("lists-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "vocabs" },
      async (payload) => {
        if (payload.eventType === "INSERT") {
          SET_vocabs((prevLists) => [...prevLists, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          // Fetch updated vocab with translations
          const updatedVocab = await fetchVocabWithTranslations(payload.new.id);
          if (updatedVocab) {
            SET_vocabs((prevLists) =>
              prevLists.map((vocab) =>
                vocab.id === updatedVocab.id ? updatedVocab : vocab
              )
            );
          }
        } else if (payload.eventType === "DELETE") {
          SET_vocabs((prevLists) =>
            prevLists.filter((vocab) => vocab.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();
}

// export default function SUBSCRIBE_toVocabs({ SET_vocabs }) {
//   return supabase
//     .channel("lists-channel")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "vocabs" },
//       (payload) => {
//         // Handle insert, update, delete
//         if (payload.eventType === "INSERT") {
//           SET_vocabs((prevLists) => [...prevLists, payload.new]);
//         } else if (payload.eventType === "UPDATE") {
//           SET_vocabs((prevLists) =>
//             prevLists.map((list) =>
//               list.id === payload.new.id ? payload.new : list
//             )
//           );

//           // console.log(vocab?.translations?.[0]);
//         } else if (payload.eventType === "DELETE") {
//           SET_vocabs((prevLists) =>
//             prevLists.filter((list) => list.id !== payload.old.id)
//           );
//         }
//       }
//     )
//     .subscribe();
// }
