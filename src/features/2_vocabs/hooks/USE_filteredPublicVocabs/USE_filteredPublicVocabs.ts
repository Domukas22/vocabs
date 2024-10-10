import { useState, useEffect } from "react";
import {
  Vocab_PROPS,
  DisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
} from "@/src/db/props";

export default function USE_filteredPublicVocabs({
  vocabs,
  displaySettings,
}: {
  vocabs: Vocab_PROPS[];
  displaySettings: PublicVocabDisplaySettings_PROPS;
}) {
  const [filtered_VOCABS, SET_filteredVocabs] = useState<Vocab_PROPS[]>(vocabs);
  const [ARE_vocabsFiltering, SET_areVocabsFiltering] = useState(false);

  useEffect(() => {
    const filterVocabs = async () => {
      SET_areVocabsFiltering(true); // Set filtering state to true

      const filtered = await new Promise<Vocab_PROPS[]>((resolve) => {
        setTimeout(() => {
          let result = [...vocabs];

          resolve(result);
        }, 0); // Offload to event loop
      });

      SET_filteredVocabs(filtered);
      SET_areVocabsFiltering(false); // Reset filtering state
    };

    filterVocabs(); // Run the async filtering
  }, [vocabs, displaySettings]); // Re-run when vocabs or display settings change

  return { filtered_VOCABS, ARE_vocabsFiltering };
}
