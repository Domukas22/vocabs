//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    backgroundColor: MyColors.btn_2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  btn_text: {
    fontSize: 18,
    fontFamily: "Nunito-Regular",
    color: MyColors.text_white,
    flex: 1,
    textAlign: "center",
  },

  simple_press: {
    backgroundColor: MyColors.btn_3,
  },

  action: {
    backgroundColor: MyColors.btn_action,
    borderColor: "transparent",
  },
  action_press: {
    backgroundColor: MyColors.btn_action_press,
  },
  action_text: {
    color: "#121212",
    // color: MyColors.text_black,
    letterSpacing: -0.5,
    fontFamily: "Nunito-ExtraBold",
  },

  active: {
    backgroundColor: MyColors.btn_active,
    borderColor: MyColors.border_contrast,
  },
  active_press: {
    backgroundColor: MyColors.btn_active_press,
    borderColor: MyColors.border_contrast,
  },
  active_text: {
    color: MyColors.text_primary,
  },

  delete: {
    backgroundColor: MyColors.btn_2,
    borderColor: MyColors.border_white_005,
  },
  delete_press: {
    backgroundColor: MyColors.btn_delete_press,
    borderColor: MyColors.border_white_005,
  },
  delete_text: {
    color: MyColors.text_delete,
  },

  seethrough: {
    backgroundColor: MyColors.btn_1,
    borderColor: MyColors.border_white_005,
  },
  seethrough_press: {
    backgroundColor: MyColors.btn_2,
    borderColor: MyColors.border_white_005,
  },
  seethrough_text: {
    color: MyColors.text_white_06,
  },

  seethrough_primary: {
    backgroundColor: MyColors.btn_1,
    borderColor: MyColors.border_white_005,
  },
  seethrough_primary_press: {
    backgroundColor: MyColors.btn_active,
    borderColor: MyColors.border_white_005,
  },
  seethrough_primary_text: {
    color: MyColors.text_primary,
  },

  difficulty_3_active: {
    backgroundColor: MyColors.btn_difficulty_3,
    borderColor: MyColors.border_difficulty_3,
  },
  difficulty_3_active_press: {
    backgroundColor: MyColors.btn_difficulty_3_press,
    borderColor: MyColors.border_difficulty_3,
  },
  difficulty_3_active_text: {
    color: MyColors.text_difficulty_3,
  },

  difficulty_2_active: {
    backgroundColor: MyColors.btn_difficulty_2,
    borderColor: MyColors.border_difficulty_2,
  },
  difficulty_2_active_press: {
    backgroundColor: MyColors.btn_difficulty_2_press,
    borderColor: MyColors.border_difficulty_2,
  },
  difficulty_2_active_text: {
    color: MyColors.text_difficulty_2,
  },

  difficulty_1_active: {
    backgroundColor: MyColors.btn_difficulty_1,
    borderColor: MyColors.border_difficulty_1,
  },
  difficulty_1_active_press: {
    backgroundColor: MyColors.btn_difficulty_1_press,
    borderColor: MyColors.border_difficulty_1,
  },
  difficulty_1_active_text: {
    color: MyColors.text_difficulty_1,
  },
});

const btnStyles = {
  default: s.btn,

  simple: {
    btn: {
      normal: {},
      press: s.simple_press,
    },
    text: {},
  },
  action: {
    btn: {
      normal: s.action,
      press: s.action_press,
    },
    text: s.action_text,
  },
  active: {
    btn: {
      normal: s.active,
      press: s.active_press,
    },
    text: s.active_text,
  },
  delete: {
    btn: {
      normal: s.delete,
      press: s.delete_press,
    },
    text: s.delete_text,
  },
  seethrough: {
    btn: {
      normal: s.seethrough,
      press: s.seethrough_press,
    },
    text: s.seethrough_text,
  },
  seethrough_primary: {
    btn: {
      normal: s.seethrough_primary,
      press: s.seethrough_primary_press,
    },
    text: s.seethrough_primary_text,
  },
  difficulty_3_active: {
    btn: {
      normal: s.difficulty_3_active,
      press: s.difficulty_3_active_press,
    },
    text: s.difficulty_3_active_text,
  },
  difficulty_2_active: {
    btn: {
      normal: s.difficulty_2_active,
      press: s.difficulty_2_active_press,
    },
    text: s.difficulty_2_active_text,
  },
  difficulty_1_active: {
    btn: {
      normal: s.difficulty_1_active,
      press: s.difficulty_1_active_press,
    },
    text: s.difficulty_1_active_text,
  },
};

export default btnStyles;
