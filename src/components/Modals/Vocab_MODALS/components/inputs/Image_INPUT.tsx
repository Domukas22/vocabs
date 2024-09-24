//
//
//

import Block from "@/src/components/Basic/Block/Block";
import Btn from "@/src/components/Basic/Btn/Btn";
import { ICON_image } from "@/src/components/Basic/icons/icons";
import Label from "@/src/components/Basic/Label/Label";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";

interface ImageInput_PROPS {
  modal_IMG: string;
  SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
}

export default function Image_INPUT({
  modal_IMG,
  SET_modalImg,
}: ImageInput_PROPS) {
  const { t } = useTranslation();
  return (
    <Block row={false}>
      <Label>{t("label.uploadImage")}</Label>

      <Btn
        iconLeft={<ICON_image />}
        text={t("btn.uploadImage")}
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
