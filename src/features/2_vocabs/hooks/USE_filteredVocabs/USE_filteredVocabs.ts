import { useState, useEffect } from "react";
import { Vocab_MODEL, VocabDisplaySettings_PROPS } from "@/src/db/models";

export default function USE_filteredVocabs({
  vocabs,
  displaySettings,
}: {
  vocabs: Vocab_MODEL[];
  displaySettings: VocabDisplaySettings_PROPS;
}) {
  const [filtered_VOCABS, SET_filteredVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [ARE_vocabsFiltering, SET_areVocabsFiltering] = useState(false);

  useEffect(() => {
    const filterVocabs = async () => {
      SET_areVocabsFiltering(true); // Set filtering state to true

      const filtered = await new Promise<Vocab_MODEL[]>((resolve) => {
        setTimeout(() => {
          let result = [...vocabs];

          const { sorting, sortDirection, difficultyFilters } = displaySettings;

          // Apply difficulty filters
          if (difficultyFilters && difficultyFilters.length > 0) {
            result = result.filter((vocab) =>
              difficultyFilters.includes(vocab?.difficulty)
            );
          }

          // Apply sorting
          if (sorting) {
            result = result.sort((a, b) => {
              let comparison = 0;

              switch (sorting) {
                case "difficulty":
                  console.log("by diff");

                  comparison = a.difficulty - b.difficulty;
                  break;
                case "date":
                  console.log("by date");
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
