import { useState, useEffect } from "react";
import { DisplaySettings_PROPS } from "@/src/db/props";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

export default function USE_filteredVocabs({
  vocabs,
  displaySettings,
}: {
  vocabs: Vocab_MODEL[];
  displaySettings: DisplaySettings_PROPS;
}) {
  const [filtered_VOCABS, SET_filteredVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [ARE_vocabsFiltering, SET_areVocabsFiltering] = useState(false);

  useEffect(() => {
    const filterVocabs = async () => {
      SET_areVocabsFiltering(true); // Set filtering state to true

      const filtered = await new Promise<Vocab_MODEL[]>((resolve) => {
        setTimeout(() => {
          let result = [...vocabs];

          const { sorting, sortDirection, difficultyFilters, langFilters } =
            displaySettings;

          // Apply difficulty filters
          if (difficultyFilters && difficultyFilters.length > 0) {
            result = result.filter((vocab) =>
              difficultyFilters.includes(vocab?.difficulty)
            );
          }

          // Apply langauge filters
          if (langFilters && langFilters.length > 0) {
            result = result.filter((vocab) => {
              // Get the unique language IDs from the vocab's translations
              const vocabLangIds =
                vocab.translations?.map((tr) => tr.lang_id) || [];

              // Check if every langFilter is present in vocabLangIds
              return langFilters.every((langId) =>
                vocabLangIds.includes(langId)
              );
            });
          }

          // Apply sorting
          if (sorting) {
            result = result.sort((a, b) => {
              let comparison = 0;

              switch (sorting) {
                case "difficulty":
                  comparison = a.difficulty - b.difficulty;
                  break;
                case "date":
                  comparison =
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime();
                  break;
                case "shuffle":
                  comparison = Math.random() - 0.5; // Randomize order
                  break;
                default:
                  break;
              }

              // Apply sorting direction
              if (sortDirection === "descending") {
                comparison = -comparison;
              }

              return comparison;
            });
          }

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
