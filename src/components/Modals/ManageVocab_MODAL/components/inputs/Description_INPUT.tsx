//
//
//

import Block from "@/src/components/Block/Block";

import Label from "@/src/components/Label/Label";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";

interface DescriptionInput_PROPS {
  modal_DESC: string;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
}

export default function Description_INPUT({
  modal_DESC,
  SET_modalDesc,
}: DescriptionInput_PROPS) {
  return (
    <Block>
      <Label>Description (optional)</Label>
      <StyledText_INPUT
        multiline={true}
        value={modal_DESC || ""}
        SET_value={(value: string) => SET_modalDesc(value)}
        placeholder="Note down the place / movie / book so that you remember better..."
      />
    </Block>
  );
}
