//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_dropdownArrow } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";

interface ListnInput_PROPS {
  list_NAME: string;
  TOGGLE_modal: () => void;
}

export default function List_INPUT({
  list_NAME,
  TOGGLE_modal,
}: ListnInput_PROPS) {
  return (
    <Block>
      <Label>Vocab list</Label>
      <Btn
        text={list_NAME || ""}
        iconRight={<ICON_dropdownArrow />}
        onPress={TOGGLE_modal}
        type="simple"
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
