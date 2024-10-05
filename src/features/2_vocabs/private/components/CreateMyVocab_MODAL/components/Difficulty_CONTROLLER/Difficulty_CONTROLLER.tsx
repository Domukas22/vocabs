//
//
//

import DifficultyInput_BLOCK from "@/src/features/2_vocabs/components/Vocab_MODAL/components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../CreateMyVocab_MODAL";

interface DifficultyController_PROPS {
  control: Control<CreateMyVocabData_PROPS, any>;
}

export default function Difficulty_CONTROLLER({
  control,
}: DifficultyController_PROPS) {
  return (
    <Controller
      control={control}
      name="difficulty"
      rules={{
        required: {
          value: true,
          message: "Please select a difficulty",
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DifficultyInput_BLOCK {...{ value, onChange, error }} />
      )}
    />
  );
}
