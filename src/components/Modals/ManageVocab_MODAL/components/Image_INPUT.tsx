//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_image } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { MyColors } from "@/src/constants/MyColors";

interface ImageInput_PROPS {
  modal_IMG: string;
  SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
}

export default function Image_INPUT({
  modal_IMG,
  SET_modalImg,
}: ImageInput_PROPS) {
  return (
    <Block row={false}>
      <Label>Image (optional)</Label>

      <Btn
        iconLeft={<ICON_image />}
        text="Tap to upload image"
        onPress={() => {}}
        type="seethrough"
        style={{
          flex: 1,
          height: 140,
          flexDirection: "column",
          gap: 8,
        }}
        text_STYLES={{
          color: MyColors.text_white_06,
          fontFamily: "Nunito-Light",
        }}
      />
    </Block>
  );
}
