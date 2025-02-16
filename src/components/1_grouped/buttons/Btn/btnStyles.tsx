//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet } from "react-native";

export type btnTypes =
  | "simple"
  | "simple_primary_text"
  | "action"
  | "active"
  | "active_green"
  | "delete"
  | "delete_angry"
  | "seethrough"
  | "seethrough_primary"
  | "difficulty_3_active"
  | "difficulty_2_active"
  | "difficulty_1_active";

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
    position: "relative",
    // overflow: "hidden",
  },
  btnTiny: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    minHeight: 26,
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

  simple_primary_press: {
    backgroundColor: MyColors.btn_active_press,
  },
  simple_primary_text: {
    color: MyColors.text_primary,
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
    letterSpacing: -0.2,
    fontFamily: "Nunito-Bold",
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

  active_green: {
    backgroundColor: MyColors.btn_green,
    borderColor: MyColors.border_green,
  },
  active_green_press: {
    backgroundColor: MyColors.btn_green_press,
    borderColor: MyColors.border_green,
  },
  active_green_text: {
    color: MyColors.text_green,
  },

  delete: {
    backgroundColor: MyColors.btn_red,
    borderColor: MyColors.border_white_005,
  },
  delete_press: {
    backgroundColor: MyColors.btn_delete_press,
    borderColor: MyColors.border_white_005,
  },
  delete_text: {
    color: MyColors.text_delete,
  },

  delete_angry: {
    backgroundColor: MyColors.btn_red_angry,
    borderColor: MyColors.border_red,
  },
  delete_angry_press: {
    backgroundColor: MyColors.btn_red_angry_press,
    borderColor: MyColors.border_red,
  },
  delete_angry_text: {
    color: MyColors.text_black,
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
  tiny: s.btnTiny,

  simple: {
    btn: {
      normal: {},
      press: s.simple_press,
    },
    text: {},
  },
  simple_primary_text: {
    btn: {
      normal: {},
      press: s.simple_primary_press,
    },
    text: s.simple_primary_text,
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
  active_green: {
    btn: {
      normal: s.active_green,
      press: s.active_green_press,
    },
    text: s.active_green_text,
  },
  delete: {
    btn: {
      normal: s.delete,
      press: s.delete_press,
    },
    text: s.delete_text,
  },
  delete_angry: {
    btn: {
      normal: s.delete_angry,
      press: s.delete_angry_press,
    },
    text: s.delete_angry_text,
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
