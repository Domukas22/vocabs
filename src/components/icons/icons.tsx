//
//
//

import { GET_langFlagUrl } from "@/src/constants/globalVars";
import languages from "@/src/constants/languages";
import { MyColors } from "@/src/constants/MyColors";
import { Image, StyleSheet, View, ViewProps } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const sizing = {
  small: 20,
  big: 24,
};

export function ICON_flag({
  big = false,
  lang = "en",
}: {
  big?: boolean;
  lang?: string;
}) {
  const _size = big
    ? { width: sizing.big, height: 14 }
    : { width: sizing.small, height: 11 };

  return (
    <Image
      style={[_size, { borderRadius: 3 }]}
      source={{ uri: GET_langFlagUrl(lang) }}
    />
  );
}
export function ICON_difficultyDot({
  big = false,
  difficulty = 2,
}: {
  big?: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  primary?: boolean;
}) {
  const _size = big ? { width: 14, height: 14 } : { width: 11, height: 11 };

  const _color =
    difficulty === 0
      ? { backgroundColor: MyColors.icon_primary }
      : difficulty === 1
      ? { backgroundColor: MyColors.icon_difficulty_1 }
      : difficulty === 2
      ? { backgroundColor: MyColors.icon_difficulty_2 }
      : { backgroundColor: MyColors.icon_difficulty_3 };

  return (
    <View
      style={{
        width: sizing.small,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={[_size, _color, { borderRadius: 100 }]} />
    </View>
  );
}
export function ICON_X({
  color = "grey",
  big = false,
  rotate = false,
}: {
  color?:
    | "grey"
    | "primary"
    | "difficulty_1"
    | "difficulty_2"
    | "difficulty_3"
    | "admin"
    | "white";
  big?: boolean;
  rotate?: boolean;
}) {
  const backgroundColor =
    color === "primary"
      ? MyColors.icon_primary
      : color === "difficulty_1"
      ? MyColors.icon_difficulty_1
      : color === "difficulty_2"
      ? MyColors.icon_difficulty_2
      : color === "difficulty_3"
      ? MyColors.icon_difficulty_3
      : color === "admin"
      ? MyColors.icon_green
      : color === "white"
      ? "white"
      : MyColors.icon_gray_light;

  return (
    <View
      style={[s.icon, { transform: [{ rotate: rotate ? "45deg" : "0deg" }] }]}
    >
      <View style={[s.x_line, big && s.x_line_big, { backgroundColor }]}></View>
      <View
        style={[
          s.x_line,
          s.x_line_rotate,
          big && s.x_line_big,
          { backgroundColor },
        ]}
      ></View>
    </View>
  );
}

export function ICON_arrow({
  direction = "left",
  color = "gray_light",
  ...props
}: {
  direction?: "left" | "right" | "up" | "down";
  color?: "gray_light" | "green";
} & ViewProps) {
  const rotate =
    direction === "left"
      ? "0deg"
      : direction === "right"
      ? "180deg"
      : direction === "up"
      ? "90deg"
      : "-90deg";

  const fillColor =
    color === "green" ? MyColors.icon_green : MyColors.icon_gray_light;

  return (
    <View {...props}>
      <Svg
        viewBox="0 0 22 12"
        width={sizing.big}
        height={sizing.big}
        fill="none"
        style={{ transform: [{ rotate }] }}
      >
        <Path
          d="M20.5 6.8C20.9418 6.8 21.3 6.44183 21.3 6C21.3 5.55817 20.9418 5.2 20.5 5.2V6.8ZM0.934315 5.43431C0.621895 5.74673 0.621895 6.25327 0.934315 6.56569L6.02548 11.6569C6.3379 11.9693 6.84443 11.9693 7.15685 11.6569C7.46927 11.3444 7.46927 10.8379 7.15685 10.5255L2.63137 6L7.15685 1.47452C7.46927 1.1621 7.46927 0.655565 7.15685 0.343146C6.84443 0.0307264 6.3379 0.0307264 6.02548 0.343146L0.934315 5.43431ZM20.5 5.2L1.5 5.2V6.8L20.5 6.8V5.2Z"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}
export function ICON_download({ ...props }: {} & ViewProps) {
  return (
    <View {...props}>
      <Svg
        width={sizing.big}
        height={sizing.big}
        viewBox="0 0 20 20"
        fill="none"
      >
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 0C10.5523 0 11 0.447715 11 1V10.5858L14.2929 7.29289C14.6834 6.90237 15.3166 6.90237 15.7071 7.29289C16.0976 7.68342 16.0976 8.31658 15.7071 8.70711L10.7071 13.7071C10.3166 14.0976 9.68342 14.0976 9.29289 13.7071L4.29289 8.70711C3.90237 8.31658 3.90237 7.68342 4.29289 7.29289C4.68342 6.90237 5.31658 6.90237 5.70711 7.29289L9 10.5858V1C9 0.447715 9.44771 0 10 0ZM1 12C1.55228 12 2 12.4477 2 13V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V17C20 17.7957 19.6839 18.5587 19.1213 19.1213C18.5587 19.6839 17.7957 20 17 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7957 0 17V13C0 12.4477 0.447715 12 1 12Z"
          fill={MyColors.icon_primary}
        />
      </Svg>
    </View>
  );
}
export function ICON_3dots() {
  return (
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 24 24" fill="none">
      <Circle cx="4" cy="12" r="2.5" fill={MyColors.icon_gray_light} />
      <Circle cx="12" cy="12" r="2.5" fill={MyColors.icon_gray_light} />
      <Circle cx="20" cy="12" r="2.5" fill={MyColors.icon_gray_light} />
    </Svg>
  );
}
export function ICON_profile({
  color = "grey",
}: {
  color?: "grey" | "primary";
}) {
  return (
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 22 22" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2.6C9.5308 2.59973 8.08722 2.98481 6.81336 3.71681C5.53949 4.44881 4.47989 5.50211 3.74032 6.7716C3.00076 8.04109 2.60709 9.48235 2.59861 10.9515C2.59013 12.4207 2.96714 13.8664 3.69201 15.1443C4.18195 14.5076 4.81176 13.9921 5.53275 13.6376C6.25373 13.2831 7.04658 13.0992 7.85 13.1H14.15C14.9534 13.0992 15.7463 13.2831 16.4673 13.6376C17.1882 13.9921 17.8181 14.5076 18.308 15.1443C19.0329 13.8664 19.4099 12.4207 19.4014 10.9515C19.3929 9.48235 18.9992 8.04109 18.2597 6.7716C17.5201 5.50211 16.4605 4.44881 15.1866 3.71681C13.9128 2.98481 12.4692 2.59973 11 2.6ZM19.3401 17.3798C19.4717 17.2083 19.5977 17.0326 19.7181 16.8527C20.8822 15.123 21.5027 13.0849 21.5 11C21.5 5.20085 16.7991 0.5 11 0.5C5.20086 0.5 0.500011 5.20085 0.500011 11C0.496702 13.3066 1.25605 15.5496 2.65986 17.3798L2.65461 17.3987L3.02736 17.8323C4.01214 18.9837 5.23486 19.9078 6.61125 20.541C7.98764 21.1741 9.48496 21.5013 11 21.5C11.2268 21.5 11.4522 21.493 11.6762 21.479C13.5708 21.3595 15.3971 20.7261 16.9587 19.6467C17.7056 19.1315 18.3826 18.5216 18.9726 17.8323L19.3454 17.3987L19.3401 17.3798ZM11 4.7C10.1646 4.7 9.36336 5.03187 8.77262 5.62261C8.18188 6.21335 7.85 7.01457 7.85 7.85C7.85 8.68543 8.18188 9.48665 8.77262 10.0774C9.36336 10.6681 10.1646 11 11 11C11.8354 11 12.6366 10.6681 13.2274 10.0774C13.8181 9.48665 14.15 8.68543 14.15 7.85C14.15 7.01457 13.8181 6.21335 13.2274 5.62261C12.6366 5.03187 11.8354 4.7 11 4.7Z"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_general({
  color = "grey",
}: {
  color?: "grey" | "primary";
}) {
  return (
    <Svg
      viewBox="0 0 177 177"
      fill="none"
      width={sizing.big}
      height={sizing.big}
    >
      <Path
        d="M88.5 0C137.379 0 177 39.6215 177 88.5C177 137.379 137.379 177 88.5 177C39.6215 177 0 137.379 0 88.5C0 39.6215 39.6215 0 88.5 0ZM88.5 17.7C69.7227 17.7 51.7144 25.1593 38.4368 38.4368C25.1593 51.7144 17.7 69.7227 17.7 88.5C17.7 107.277 25.1593 125.286 38.4368 138.563C51.7144 151.841 69.7227 159.3 88.5 159.3C107.277 159.3 125.286 151.841 138.563 138.563C151.841 125.286 159.3 107.277 159.3 88.5C159.3 69.7227 151.841 51.7144 138.563 38.4368C125.286 25.1593 107.277 17.7 88.5 17.7ZM48.675 75.225C52.1958 75.225 55.5723 76.6236 58.0618 79.1132C60.5514 81.6027 61.95 84.9793 61.95 88.5C61.95 92.0208 60.5514 95.3973 58.0618 97.8868C55.5723 100.376 52.1958 101.775 48.675 101.775C45.1543 101.775 41.7777 100.376 39.2882 97.8868C36.7986 95.3973 35.4 92.0208 35.4 88.5C35.4 84.9793 36.7986 81.6027 39.2882 79.1132C41.7777 76.6236 45.1543 75.225 48.675 75.225ZM88.5 75.225C92.0208 75.225 95.3973 76.6236 97.8868 79.1132C100.376 81.6027 101.775 84.9793 101.775 88.5C101.775 92.0208 100.376 95.3973 97.8868 97.8868C95.3973 100.376 92.0208 101.775 88.5 101.775C84.9793 101.775 81.6027 100.376 79.1132 97.8868C76.6236 95.3973 75.225 92.0208 75.225 88.5C75.225 84.9793 76.6236 81.6027 79.1132 79.1132C81.6027 76.6236 84.9793 75.225 88.5 75.225ZM128.325 75.225C131.846 75.225 135.222 76.6236 137.712 79.1132C140.201 81.6027 141.6 84.9793 141.6 88.5C141.6 92.0208 140.201 95.3973 137.712 97.8868C135.222 100.376 131.846 101.775 128.325 101.775C124.804 101.775 121.428 100.376 118.938 97.8868C116.449 95.3973 115.05 92.0208 115.05 88.5C115.05 84.9793 116.449 81.6027 118.938 79.1132C121.428 76.6236 124.804 75.225 128.325 75.225Z"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_settings() {
  return (
    <Svg
      viewBox="0 0 107 113"
      fill="none"
      width={sizing.big}
      height={sizing.big}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M63.5201 0.8588C61.4365 -2.52575e-07 58.7896 0 53.5016 0C48.2136 0 45.5724 -2.52575e-07 43.4831 0.8588C42.1083 1.42236 40.8583 2.25312 39.8048 3.30325C38.7513 4.35339 37.9152 5.60218 37.3447 6.97775C36.8153 8.2377 36.6126 9.71235 36.5281 11.8537C36.4879 13.4046 36.0554 14.9199 35.2713 16.2571C34.4871 17.5943 33.3771 18.7095 32.0454 19.4982C30.6867 20.2558 29.1594 20.6572 27.605 20.6651C26.0506 20.673 24.5194 20.2872 23.1531 19.5434C21.2497 18.5377 19.8699 17.984 18.5071 17.8032C15.5256 17.4129 12.511 18.2167 10.1161 20.0405C8.32522 21.4078 7.00181 23.6905 4.3606 28.25C1.71377 32.8096 0.395986 35.0865 0.0975134 37.3182C-0.296696 40.2901 0.514249 43.2959 2.35014 45.6746C3.18361 46.7594 4.36061 47.6691 6.1796 48.8104C8.86585 50.4884 10.5891 53.3473 10.5891 56.5C10.5891 59.6527 8.86585 62.5116 6.18523 64.184C4.3606 65.3309 3.18361 66.2406 2.34451 67.3254C1.44101 68.5018 0.777521 69.8453 0.391963 71.2792C0.00640596 72.713 -0.0936517 74.2091 0.0975134 75.6818C0.395986 77.9079 1.71377 80.1905 4.3606 84.75C7.00744 89.3096 8.32522 91.5865 10.1161 92.9594C12.5038 94.7844 15.5224 95.5867 18.5071 95.1969C19.8699 95.0161 21.2497 94.4624 23.1531 93.4567C24.52 92.7118 26.0523 92.3254 27.6078 92.3333C29.1633 92.3412 30.6917 92.7432 32.051 93.5019C34.7879 95.0839 36.4098 97.9936 36.5281 101.146C36.6126 103.293 36.8153 104.762 37.3447 106.022C38.4935 108.791 40.7011 110.994 43.4831 112.141C45.5667 113 48.2136 113 53.5016 113C58.7896 113 61.4365 113 63.5201 112.141C64.8949 111.578 66.145 110.747 67.1984 109.697C68.2519 108.647 69.088 107.398 69.6585 106.022C70.1879 104.762 70.3906 103.293 70.4751 101.146C70.5878 97.9936 72.2153 95.0782 74.9578 93.5019C76.3165 92.7442 77.8438 92.3428 79.3982 92.3349C80.9526 92.327 82.4839 92.7128 83.8501 93.4567C85.7535 94.4624 87.1333 95.0161 88.4961 95.1969C91.4808 95.5924 94.4994 94.7844 96.8871 92.9594C98.678 91.5921 100.001 89.3096 102.643 84.75C105.289 80.1905 106.607 77.9135 106.906 75.6818C107.096 74.2087 106.995 72.7124 106.609 71.2786C106.222 69.8447 105.558 68.5014 104.653 67.3254C103.82 66.2406 102.643 65.331 100.824 64.1897C98.1373 62.5116 96.4141 59.6527 96.4141 56.5C96.4141 53.3473 98.1373 50.4884 100.818 48.816C102.643 47.6691 103.82 46.7594 104.659 45.6746C105.562 44.4982 106.226 43.1547 106.611 41.7208C106.997 40.287 107.097 38.7909 106.906 37.3182C106.607 35.0921 105.289 32.8096 102.643 28.25C99.9958 23.6905 98.678 21.4135 96.8871 20.0405C94.4922 18.2167 91.4776 17.4129 88.4961 17.8032C87.1333 17.984 85.7535 18.5377 83.8501 19.5434C82.4832 20.2882 80.9509 20.6746 79.3954 20.6667C77.8399 20.6588 76.3115 20.2568 74.9522 19.4982C73.6215 18.7089 72.5126 17.5933 71.7295 16.2561C70.9464 14.919 70.5147 13.4041 70.4751 11.8537C70.3906 9.7067 70.1879 8.2377 69.6585 6.97775C69.088 5.60218 68.2519 4.35339 67.1984 3.30325C66.145 2.25312 64.8949 1.42236 63.5201 0.8588ZM53.5016 73.45C62.9063 73.45 70.5258 65.8621 70.5258 56.5C70.5258 47.138 62.9007 39.55 53.5016 39.55C44.1025 39.55 36.4774 47.138 36.4774 56.5C36.4774 65.8621 44.1025 73.45 53.5016 73.45Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_about() {
  return (
    <Svg
      width={sizing.big}
      height={sizing.big}
      viewBox="0 0 145 113"
      fill="none"
    >
      <Path
        d="M0 0V10.5938C0 39.9031 15.6317 65.54 38.9024 79.8063V113H145V98.875C145 80.0887 107.3 70.625 88.4146 70.625H86.6463C53.0488 70.625 24.7561 42.375 24.7561 10.5938V0M88.4146 0C80.9109 0 73.7146 2.97633 68.4087 8.27423C63.1028 13.5721 60.122 20.7576 60.122 28.25C60.122 35.7424 63.1028 42.9279 68.4087 48.2258C73.7146 53.5237 80.9109 56.5 88.4146 56.5C95.9183 56.5 103.115 53.5237 108.421 48.2258C113.726 42.9279 116.707 35.7424 116.707 28.25C116.707 20.7576 113.726 13.5721 108.421 8.27423C103.115 2.97633 95.9183 0 88.4146 0Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_premium() {
  return (
    <Svg
      width={sizing.big}
      height={sizing.big}
      viewBox="0 0 120 115"
      fill="none"
    >
      <Path
        d="M116.975 52.6308L92.8541 73.3075L100.203 104.229C100.608 105.908 100.504 107.668 99.903 109.288C99.3019 110.908 98.231 112.314 96.8257 113.329C95.4204 114.345 93.7437 114.924 92.0074 114.993C90.2711 115.062 88.5531 114.619 87.0704 113.718L60.0011 97.1685L32.9157 113.718C31.4332 114.614 29.7172 115.053 27.9839 114.981C26.2506 114.909 24.5774 114.33 23.175 113.315C21.7727 112.301 20.7038 110.896 20.1031 109.28C19.5023 107.663 19.3966 105.906 19.7991 104.229L27.1748 73.3075L3.05367 52.6308C1.74201 51.5047 0.793386 50.0196 0.32628 48.361C-0.140826 46.7025 -0.105715 44.944 0.427227 43.3051C0.96017 41.6663 1.96733 40.2197 3.32291 39.1461C4.6785 38.0725 6.32244 37.4194 8.04944 37.2684L39.675 34.7338L51.8749 5.40406C52.5353 3.80561 53.6592 2.43834 55.1038 1.47607C56.5484 0.513796 58.2484 0 59.9877 0C61.727 0 63.427 0.513796 64.8716 1.47607C66.3162 2.43834 67.4401 3.80561 68.1004 5.40406L80.295 34.7338L111.921 37.2684C113.651 37.4138 115.3 38.0633 116.66 39.1354C118.021 40.2075 119.033 41.6546 119.569 43.2955C120.105 44.9363 120.142 46.6979 119.675 48.3594C119.208 50.021 118.258 51.5087 116.943 52.6362L116.975 52.6308Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_premiumCheckmark() {
  return (
    <Svg
      width={sizing.big}
      height={sizing.big}
      viewBox="0 0 113 113"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3816 28.567C11.4812 33.6092 8.73746 40.4251 5.16991 43.9859C1.8595 47.2993 0 51.7914 0 56.4751C0 61.1588 1.8595 65.6508 5.16991 68.9643C8.69096 72.4719 11.2819 78.5571 11.3816 83.5262C11.4746 87.924 13.1952 92.2952 16.5502 95.6434C19.6455 98.7449 23.7862 100.581 28.163 100.792C33.418 101.058 40.3007 104.113 44.021 107.834C47.3343 111.142 51.8252 113 56.5074 113C61.1897 113 65.6805 111.142 68.9939 107.834C72.7142 104.113 79.5969 101.058 84.8519 100.792C89.2287 100.581 93.3694 98.7449 96.4647 95.6434C99.6916 92.421 101.542 88.0723 101.627 83.5129C101.726 78.5571 104.284 72.5118 107.798 69.0042C111.121 65.6918 112.993 61.1951 113 56.5033C113.007 51.8114 111.151 47.3088 107.838 43.9859C104.277 40.4318 101.527 33.6092 101.633 28.5737C101.683 26.1962 101.251 23.8332 100.363 21.6273C99.4745 19.4214 98.1484 17.4184 96.4647 15.739C94.7196 13.9895 92.6258 12.6268 90.3194 11.7398C88.0131 10.8528 85.5458 10.4612 83.078 10.5905C78.3346 10.8297 72.3488 8.53114 68.9939 5.16969C65.6803 1.85942 61.188 0 56.5041 0C51.8202 0 47.328 1.85942 44.0144 5.16969C40.666 8.5245 34.6736 10.8297 29.9302 10.5905C27.4636 10.4621 24.9975 10.8542 22.6924 11.7412C20.3872 12.6282 18.2945 13.9903 16.5502 15.739C14.8673 17.4176 13.5417 19.4195 12.6534 21.6242C11.7651 23.8289 11.3324 26.1906 11.3816 28.567ZM76.6737 34.0543C77.4368 34.4777 78.109 35.0473 78.6519 35.7305C79.1948 36.4138 79.5977 37.1973 79.8377 38.0363C80.0777 38.8753 80.1501 39.7534 80.0506 40.6203C79.9511 41.4873 79.6818 42.3262 79.258 43.089L60.8689 76.1854C60.3926 77.0868 59.7152 77.8665 58.8891 78.4641C57.6888 79.3325 56.2325 79.7748 54.7519 79.7206C53.2713 79.6665 51.8513 79.119 50.7176 78.1651L32.3883 63.5036C31.7069 62.9583 31.1396 62.2842 30.7188 61.5197C30.2979 60.7553 30.0318 59.9154 29.9355 59.0481C29.8393 58.1807 29.9148 57.3029 30.1579 56.4648C30.4009 55.6267 30.8066 54.8446 31.3519 54.1633C31.8972 53.4819 32.5713 52.9146 33.3358 52.4938C34.1003 52.073 34.9402 51.8069 35.8076 51.7106C36.675 51.6144 37.5528 51.6899 38.391 51.933C39.2291 52.176 40.0112 52.5817 40.6926 53.1269L53.003 62.9788L67.6386 36.6319C68.0626 35.8694 68.6326 35.1978 69.3161 34.6556C69.9996 34.1134 70.7833 33.7112 71.6223 33.4718C72.4613 33.2325 73.3392 33.1607 74.2059 33.2607C75.0727 33.3606 75.9112 33.6303 76.6737 34.0543Z"
        fill={MyColors.icon_primary}
      />
    </Svg>
  );
}
export function ICON_privacyPolicy() {
  return (
    <Svg
      width={sizing.big}
      height={sizing.big}
      viewBox="0 0 94 113"
      fill="none"
    >
      <Path
        d="M6.21444 17.005C2.45444 18.6628 0 22.3928 0 26.4854V50.8338C0 79.5857 20.0533 106.473 47 113C73.9467 106.473 94 79.5857 94 50.8338V26.4854C94 22.3928 91.5456 18.6628 87.7856 17.005L51.23 0.893639C48.5144 -0.29788 45.4333 -0.29788 42.77 0.893639L6.21444 17.005ZM47 30.1117C49.8722 30.1117 52.2222 32.443 52.2222 35.2923C52.2222 38.1415 49.8722 40.4728 47 40.4728C44.1278 40.4728 41.7778 38.1415 41.7778 35.2923C41.7778 32.443 44.1278 30.1117 47 30.1117ZM47 50.8338C49.8722 50.8338 52.2222 53.165 52.2222 56.0143V76.7364C52.2222 79.5857 49.8722 81.9169 47 81.9169C44.1278 81.9169 41.7778 79.5857 41.7778 76.7364V56.0143C41.7778 53.165 44.1278 50.8338 47 50.8338Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_contact() {
  return (
    <Svg
      width={sizing.big}
      height={sizing.big}
      viewBox="0 0 118 113"
      fill="none"
    >
      <Path
        d="M94.4 0C100.659 0 106.662 2.50644 111.088 6.96794C115.514 11.4294 118 17.4805 118 23.79V71.3701C118 77.6796 115.514 83.7307 111.088 88.1922C106.662 92.6537 100.659 95.1601 94.4 95.1601H66.5284L38.4326 112.152C37.5865 112.664 36.6265 112.954 35.6406 112.995C34.6546 113.036 33.6742 112.827 32.789 112.388C31.9038 111.948 31.1422 111.292 30.5738 110.478C30.0053 109.665 29.6483 108.721 29.5354 107.733L29.5 107.055V95.1601H23.6C17.5452 95.1601 11.722 92.8142 7.33481 88.6076C2.94767 84.401 0.332242 78.6556 0.0295007 72.5596L0 71.3701V23.79C0 17.4805 2.48642 11.4294 6.91228 6.96794C11.3381 2.50644 17.3409 0 23.6 0H94.4ZM70.8 53.5276H35.4C33.8352 53.5276 32.3345 54.1542 31.2281 55.2696C30.1216 56.3849 29.5 57.8977 29.5 59.4751C29.5 61.0525 30.1216 62.5652 31.2281 63.6806C32.3345 64.796 33.8352 65.4226 35.4 65.4226H70.8C72.3648 65.4226 73.8655 64.796 74.9719 63.6806C76.0784 62.5652 76.7 61.0525 76.7 59.4751C76.7 57.8977 76.0784 56.3849 74.9719 55.2696C73.8655 54.1542 72.3648 53.5276 70.8 53.5276ZM82.6 29.7375H35.4C33.8352 29.7375 32.3345 30.3642 31.2281 31.4795C30.1216 32.5949 29.5 34.1077 29.5 35.6851C29.5 37.2624 30.1216 38.7752 31.2281 39.8906C32.3345 41.0059 33.8352 41.6326 35.4 41.6326H82.6C84.1648 41.6326 85.6655 41.0059 86.7719 39.8906C87.8784 38.7752 88.5 37.2624 88.5 35.6851C88.5 34.1077 87.8784 32.5949 86.7719 31.4795C85.6655 30.3642 84.1648 29.7375 82.6 29.7375Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_vocabs({
  color = "grey",
}: {
  color?: "grey" | "primary";
}) {
  return (
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="2.5"
        width="9"
        height="8.5"
        rx="3"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
      <Rect
        x="13"
        y="2.5"
        width="9"
        height="8.5"
        rx="3"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
      <Rect
        x="2"
        y="13"
        width="9"
        height="8.5"
        rx="3"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
      <Rect
        x="13"
        y="13"
        width="9"
        height="8.5"
        rx="3"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_other({ color = "grey" }: { color?: "grey" | "primary" }) {
  const _color =
    color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary;
  return (
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 24 24" fill="none">
      <Circle cx="3" cy="4" r="2.5" fill={_color} />
      <Circle cx="12" cy="4" r="2.5" fill={_color} />
      <Circle cx="21" cy="4" r="2.5" fill={_color} />
      <Circle cx="3" cy="12" r="2.5" fill={_color} />
      <Circle cx="12" cy="12" r="2.5" fill={_color} />
      <Circle cx="21" cy="12" r="2.5" fill={_color} />
      <Circle cx="3" cy="20" r="2.5" fill={_color} />
      <Circle cx="12" cy="20" r="2.5" fill={_color} />
      <Circle cx="21" cy="20" r="2.5" fill={_color} />
    </Svg>
  );
}
export function ICON_search({
  color = "grey_light",
  big = true,
}: {
  color?: "grey" | "grey_light" | "primary";
  big?: boolean;
}) {
  return (
    <Svg
      width={big ? sizing.big : sizing.small}
      height={big ? sizing.big : sizing.small}
      viewBox="0 0 22 22"
      fill="none"
    >
      <Path
        d="M21.1781 19.3921L16.4175 14.6315C17.5637 13.1057 18.1824 11.2485 18.1803 9.34016C18.1803 4.46573 14.2146 0.5 9.34016 0.5C4.46573 0.5 0.5 4.46573 0.5 9.34016C0.5 14.2146 4.46573 18.1803 9.34016 18.1803C11.2485 18.1824 13.1057 17.5637 14.6315 16.4175L19.3921 21.1781C19.6331 21.3936 19.9474 21.5085 20.2705 21.4995C20.5936 21.4905 20.901 21.3581 21.1295 21.1295C21.3581 20.901 21.4905 20.5936 21.4995 20.2705C21.5085 19.9474 21.3936 19.6331 21.1781 19.3921ZM3.02576 9.34016C3.02576 8.09129 3.39609 6.87047 4.08993 5.83207C4.78376 4.79367 5.76994 3.98434 6.92374 3.50642C8.07755 3.02849 9.34716 2.90345 10.572 3.14709C11.7969 3.39073 12.922 3.99212 13.8051 4.8752C14.6882 5.75829 15.2896 6.88341 15.5332 8.10828C15.7769 9.33315 15.6518 10.6028 15.1739 11.7566C14.696 12.9104 13.8867 13.8966 12.8483 14.5904C11.8099 15.2842 10.589 15.6546 9.34016 15.6546C7.66609 15.6526 6.06117 14.9866 4.87742 13.8029C3.69368 12.6192 3.02777 11.0142 3.02576 9.34016Z"
        fill={
          color === "grey"
            ? MyColors.icon_gray
            : color === "grey_light"
            ? MyColors.icon_gray_light
            : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_calendar({
  color = "grey",
}: {
  color?: "grey" | "primary";
}) {
  return (
    <Svg
      width={sizing.small}
      height={sizing.small}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        d="M0.900024 16.3125C0.900024 17.2441 1.67748 18 2.63574 18H15.3643C16.3226 18 17.1 17.2441 17.1 16.3125V6.75H0.900024V16.3125ZM3.21431 9.5625C3.21431 9.25313 3.47467 9 3.79288 9H7.26431C7.58252 9 7.84288 9.25313 7.84288 9.5625V12.9375C7.84288 13.2469 7.58252 13.5 7.26431 13.5H3.79288C3.47467 13.5 3.21431 13.2469 3.21431 12.9375V9.5625ZM15.3643 2.25H13.6286V0.5625C13.6286 0.253125 13.3682 0 13.05 0H11.8929C11.5747 0 11.3143 0.253125 11.3143 0.5625V2.25H6.68574V0.5625C6.68574 0.253125 6.42538 0 6.10717 0H4.95002C4.63181 0 4.37145 0.253125 4.37145 0.5625V2.25H2.63574C1.67748 2.25 0.900024 3.00586 0.900024 3.9375V5.625H17.1V3.9375C17.1 3.00586 16.3226 2.25 15.3643 2.25Z"
        fill={
          color === "grey" ? MyColors.icon_gray_light : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_shuffle({
  color = "grey_light",
}: {
  color?: "grey" | "grey_light" | "primary";
}) {
  return (
    <Svg
      width={sizing.small}
      height={sizing.small}
      viewBox="0 0 20 18"
      fill="none"
    >
      <Path
        d="M15.4498 0.593156C15.8924 0.403481 16.3977 0.509699 16.7371 0.854908L19.0977 3.28276C19.319 3.51037 19.4444 3.81764 19.4444 4.14009C19.4444 4.46254 19.319 4.76981 19.0977 4.99742L16.7371 7.42527C16.3977 7.77428 15.8924 7.8767 15.4498 7.68702C15.0071 7.49735 14.7194 7.0573 14.7194 6.56415V5.35022H13.5391C13.1666 5.35022 12.8162 5.52852 12.5949 5.83579L11.0309 7.98671L9.55552 5.96477L10.7063 4.38667C11.374 3.46864 12.4252 2.92996 13.5391 2.92996H14.7194V1.71604C14.7194 1.22667 15.0071 0.782832 15.4498 0.593156ZM6.60471 10.0124L8.08011 12.0344L6.9293 13.6125C6.26168 14.5305 5.21045 15.0692 4.09652 15.0692H1.73587C1.083 15.0692 0.555542 14.5267 0.555542 13.8553C0.555542 13.1838 1.083 12.6414 1.73587 12.6414H4.09652C4.46906 12.6414 4.81947 12.4631 5.04078 12.1558L6.60471 10.0124ZM16.7334 17.1443C16.394 17.4933 15.8887 17.5957 15.4461 17.406C15.0035 17.2163 14.7158 16.7763 14.7158 16.2831V15.0692H13.5354C12.4215 15.0692 11.3703 14.5305 10.7027 13.6125L5.04078 5.84338C4.81947 5.5361 4.46906 5.35781 4.09652 5.35781H1.73587C1.083 5.35781 0.555542 4.81534 0.555542 4.14388C0.555542 3.47243 1.083 2.92996 1.73587 2.92996H4.09652C5.21045 2.92996 6.26168 3.46864 6.9293 4.38667L12.5949 12.1558C12.8162 12.4631 13.1666 12.6414 13.5391 12.6414H14.7194V11.4274C14.7194 10.9381 15.0071 10.4942 15.4498 10.3045C15.8924 10.1149 16.3977 10.2211 16.7371 10.5663L19.0977 12.9941C19.319 13.2218 19.4444 13.529 19.4444 13.8515C19.4444 14.1739 19.319 14.4812 19.0977 14.7088L16.7371 17.1367L16.7334 17.1443Z"
        fill={
          color === "grey"
            ? MyColors.icon_gray
            : color === "grey_light"
            ? MyColors.icon_gray_light
            : MyColors.icon_primary
        }
      />
    </Svg>
  );
}
export function ICON_questionMark() {
  return (
    // <Svg
    //   // width="11"
    //   // height="18"
    //   width={sizing.big}
    //   height={sizing.big}
    //   viewBox="0 0 11 18"
    //   fill="none"
    // >
    //   <Path
    //     d="M5.52 11.641C5.12133 11.641 4.807 11.5107 4.577 11.25C4.347 10.9893 4.232 10.6443 4.232 10.215C4.232 9.801 4.278 9.41767 4.37 9.065C4.47733 8.697 4.63833 8.33667 4.853 7.984C5.083 7.616 5.382 7.248 5.75 6.88C5.99533 6.61933 6.187 6.38933 6.325 6.19C6.47833 5.99067 6.58567 5.80667 6.647 5.638C6.70833 5.454 6.739 5.27 6.739 5.086C6.739 4.73333 6.60867 4.465 6.348 4.281C6.08733 4.097 5.71167 4.005 5.221 4.005C4.73033 4.005 4.27033 4.05867 3.841 4.166C3.41167 4.27333 2.99767 4.43433 2.599 4.649C2.139 4.89433 1.73267 4.97867 1.38 4.902C1.02733 4.81 0.751333 4.626 0.552 4.35C0.352667 4.074 0.237667 3.752 0.207 3.384C0.191667 3.016 0.291333 2.65567 0.506 2.303C0.736 1.95033 1.08867 1.659 1.564 1.429C2.19267 1.12233 2.85967 0.899999 3.565 0.761999C4.27033 0.608666 4.92967 0.532 5.543 0.532C6.601 0.532 7.52867 0.700666 8.326 1.038C9.13867 1.37533 9.76733 1.85067 10.212 2.464C10.6567 3.062 10.879 3.76733 10.879 4.58C10.879 5.04 10.81 5.477 10.672 5.891C10.534 6.305 10.3117 6.71133 10.005 7.11C9.69833 7.49333 9.269 7.88433 8.717 8.283C8.24167 8.63567 7.87367 8.95 7.613 9.226C7.35233 9.48667 7.16067 9.73967 7.038 9.985C6.93067 10.2303 6.84633 10.4987 6.785 10.79C6.72367 11.0353 6.59333 11.2423 6.394 11.411C6.19467 11.5643 5.90333 11.641 5.52 11.641ZM5.451 17.138C4.74567 17.138 4.186 16.931 3.772 16.517C3.37333 16.103 3.174 15.5587 3.174 14.884C3.174 14.2247 3.37333 13.6957 3.772 13.297C4.186 12.883 4.74567 12.676 5.451 12.676C6.15633 12.676 6.70833 12.883 7.107 13.297C7.50567 13.6957 7.705 14.2247 7.705 14.884C7.705 15.5587 7.50567 16.103 7.107 16.517C6.70833 16.931 6.15633 17.138 5.451 17.138Z"
    //     fill={MyColors.icon_gray_light}
    //   />
    // </Svg>
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 11 18" fill="none">
      <Path
        d="M5.313 11.986C4.97567 11.986 4.70733 11.8787 4.508 11.664C4.324 11.434 4.232 11.1273 4.232 10.744C4.232 10.2993 4.28567 9.88533 4.393 9.502C4.50033 9.10333 4.669 8.70467 4.899 8.306C5.14433 7.90733 5.46633 7.501 5.865 7.087C6.141 6.765 6.36333 6.489 6.532 6.259C6.716 6.01367 6.83867 5.78367 6.9 5.569C6.97667 5.339 7.015 5.109 7.015 4.879C7.015 4.44967 6.854 4.11233 6.532 3.867C6.22533 3.62167 5.78067 3.499 5.198 3.499C4.646 3.499 4.13233 3.568 3.657 3.706C3.197 3.844 2.74467 4.04333 2.3 4.304C1.90133 4.51867 1.541 4.603 1.219 4.557C0.912333 4.49567 0.667 4.35767 0.483 4.143C0.299 3.913 0.191667 3.64467 0.161 3.338C0.130333 3.03133 0.199333 2.73233 0.368 2.441C0.536667 2.13433 0.820333 1.866 1.219 1.636C1.84767 1.268 2.54533 0.991999 3.312 0.807999C4.07867 0.623999 4.79167 0.532 5.451 0.532C6.463 0.532 7.35233 0.700666 8.119 1.038C8.88567 1.37533 9.476 1.83533 9.89 2.418C10.3193 3.00067 10.534 3.683 10.534 4.465C10.534 4.94033 10.465 5.385 10.327 5.799C10.189 6.213 9.96667 6.627 9.66 7.041C9.35333 7.43967 8.93167 7.86133 8.395 8.306C7.91967 8.70467 7.544 9.065 7.268 9.387C6.992 9.69367 6.79267 9.99267 6.67 10.284C6.54733 10.56 6.463 10.859 6.417 11.181C6.371 11.411 6.256 11.6027 6.072 11.756C5.90333 11.9093 5.65033 11.986 5.313 11.986ZM5.267 17.115C4.65367 17.115 4.163 16.931 3.795 16.563C3.44233 16.195 3.266 15.7197 3.266 15.137C3.266 14.5697 3.44233 14.1097 3.795 13.757C4.163 13.389 4.65367 13.205 5.267 13.205C5.88033 13.205 6.35567 13.389 6.693 13.757C7.04567 14.1097 7.222 14.5697 7.222 15.137C7.222 15.7197 7.04567 16.195 6.693 16.563C6.35567 16.931 5.88033 17.115 5.267 17.115Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_dropdownArrow() {
  return (
    <Svg width={10} height={10} viewBox="0 0 8 7" fill="none">
      <Path
        d="M4.86603 6.5C4.48113 7.16667 3.51888 7.16667 3.13397 6.5L0.5359 2C0.150999 1.33333 0.632124 0.5 1.40192 0.5L6.59807 0.499999C7.36787 0.499999 7.849 1.33333 7.4641 2L4.86603 6.5Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_displaySettings() {
  return (
    <Svg width={sizing.big} height={sizing.big} viewBox="0 0 16 18" fill="none">
      <Path
        d="M5 2.00001C4.73478 2.00001 4.48043 2.10537 4.29289 2.2929C4.10536 2.48044 4 2.73479 4 3.00001C4 3.26523 4.10536 3.51958 4.29289 3.70712C4.48043 3.89465 4.73478 4.00001 5 4.00001C5.26522 4.00001 5.51957 3.89465 5.70711 3.70712C5.89464 3.51958 6 3.26523 6 3.00001C6 2.73479 5.89464 2.48044 5.70711 2.2929C5.51957 2.10537 5.26522 2.00001 5 2.00001ZM2.17 2.00001C2.3766 1.41448 2.75974 0.907443 3.2666 0.548799C3.77346 0.190154 4.37909 -0.00244141 5 -0.00244141C5.62091 -0.00244141 6.22654 0.190154 6.7334 0.548799C7.24026 0.907443 7.6234 1.41448 7.83 2.00001H15C15.2652 2.00001 15.5196 2.10537 15.7071 2.2929C15.8946 2.48044 16 2.73479 16 3.00001C16 3.26523 15.8946 3.51958 15.7071 3.70712C15.5196 3.89465 15.2652 4.00001 15 4.00001H7.83C7.6234 4.58554 7.24026 5.09258 6.7334 5.45122C6.22654 5.80986 5.62091 6.00246 5 6.00246C4.37909 6.00246 3.77346 5.80986 3.2666 5.45122C2.75974 5.09258 2.3766 4.58554 2.17 4.00001H1C0.734784 4.00001 0.48043 3.89465 0.292893 3.70712C0.105357 3.51958 0 3.26523 0 3.00001C0 2.73479 0.105357 2.48044 0.292893 2.2929C0.48043 2.10537 0.734784 2.00001 1 2.00001H2.17ZM11 8.00001C10.7348 8.00001 10.4804 8.10537 10.2929 8.2929C10.1054 8.48044 10 8.73479 10 9.00001C10 9.26523 10.1054 9.51958 10.2929 9.70712C10.4804 9.89465 10.7348 10 11 10C11.2652 10 11.5196 9.89465 11.7071 9.70712C11.8946 9.51958 12 9.26523 12 9.00001C12 8.73479 11.8946 8.48044 11.7071 8.2929C11.5196 8.10537 11.2652 8.00001 11 8.00001ZM8.17 8.00001C8.3766 7.41448 8.75974 6.90744 9.2666 6.5488C9.77346 6.19015 10.3791 5.99756 11 5.99756C11.6209 5.99756 12.2265 6.19015 12.7334 6.5488C13.2403 6.90744 13.6234 7.41448 13.83 8.00001H15C15.2652 8.00001 15.5196 8.10537 15.7071 8.2929C15.8946 8.48044 16 8.73479 16 9.00001C16 9.26523 15.8946 9.51958 15.7071 9.70712C15.5196 9.89465 15.2652 10 15 10H13.83C13.6234 10.5855 13.2403 11.0926 12.7334 11.4512C12.2265 11.8099 11.6209 12.0025 11 12.0025C10.3791 12.0025 9.77346 11.8099 9.2666 11.4512C8.75974 11.0926 8.3766 10.5855 8.17 10H1C0.734784 10 0.48043 9.89465 0.292893 9.70712C0.105357 9.51958 0 9.26523 0 9.00001C0 8.73479 0.105357 8.48044 0.292893 8.2929C0.48043 8.10537 0.734784 8.00001 1 8.00001H8.17ZM5 14C4.73478 14 4.48043 14.1054 4.29289 14.2929C4.10536 14.4804 4 14.7348 4 15C4 15.2652 4.10536 15.5196 4.29289 15.7071C4.48043 15.8947 4.73478 16 5 16C5.26522 16 5.51957 15.8947 5.70711 15.7071C5.89464 15.5196 6 15.2652 6 15C6 14.7348 5.89464 14.4804 5.70711 14.2929C5.51957 14.1054 5.26522 14 5 14ZM2.17 14C2.3766 13.4145 2.75974 12.9074 3.2666 12.5488C3.77346 12.1902 4.37909 11.9976 5 11.9976C5.62091 11.9976 6.22654 12.1902 6.7334 12.5488C7.24026 12.9074 7.6234 13.4145 7.83 14H15C15.2652 14 15.5196 14.1054 15.7071 14.2929C15.8946 14.4804 16 14.7348 16 15C16 15.2652 15.8946 15.5196 15.7071 15.7071C15.5196 15.8947 15.2652 16 15 16H7.83C7.6234 16.5855 7.24026 17.0926 6.7334 17.4512C6.22654 17.8099 5.62091 18.0025 5 18.0025C4.37909 18.0025 3.77346 17.8099 3.2666 17.4512C2.75974 17.0926 2.3766 16.5855 2.17 16H1C0.734784 16 0.48043 15.8947 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15C0 14.7348 0.105357 14.4804 0.292893 14.2929C0.48043 14.1054 0.734784 14 1 14H2.17Z"
        fill={MyColors.icon_gray_light}
      />
    </Svg>
  );
}
export function ICON_image() {
  return (
    <Svg width={40} height={40} viewBox="0 0 37 38" fill="none">
      <Path
        d="M4.11111 37.5C2.98056 37.5 2.01307 37.0978 1.20867 36.2934C0.404259 35.489 0.00137037 34.5208 0 33.3889V4.61111C0 3.48056 0.402889 2.51307 1.20867 1.70867C2.01444 0.904259 2.98193 0.50137 4.11111 0.5H32.8889C34.0194 0.5 34.9876 0.902889 35.7934 1.70867C36.5992 2.51444 37.0014 3.48193 37 4.61111V33.3889C37 34.5194 36.5978 35.4876 35.7934 36.2934C34.989 37.0992 34.0208 37.5014 32.8889 37.5H4.11111ZM6.16667 29.2778H30.8333L23.125 19L16.9583 27.2222L12.3333 21.0556L6.16667 29.2778Z"
        fill={MyColors.icon_gray}
      />
    </Svg>
  );
}
export function ICON_toastNotification({
  type = "success",
}: {
  type: "success" | "error" | "warning";
}) {
  return (
    <View
      style={{
        borderRadius: 50,
        width: sizing.big,
        height: sizing.big,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor:
          type === "error"
            ? MyColors.border_red
            : type === "warning"
            ? MyColors.border_yellow
            : MyColors.border_green,
      }}
    >
      {type === "success" && (
        <Svg width={10} height={10} viewBox="0 0 9 10" fill="none">
          <Path
            d="M1 5.21053L3.8 9L8 1"
            stroke={MyColors.border_green}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
      {type === "error" && (
        <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
          <Path
            d="M2 2L6 6M10 10L6 6M6 6L2 10M6 6L10 2"
            stroke={MyColors.border_red}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
      {type === "warning" && (
        <Svg width="4" height="12" viewBox="0 0 4 12" fill="none">
          <Rect
            x="0.875"
            y="8.875"
            width="2.25"
            height="2.25"
            rx="1.125"
            fill={MyColors.border_yellow}
            stroke={MyColors.border_yellow}
            stroke-width="0.25"
          />
          <Rect
            x="0.875"
            y="0.875"
            width="2.25"
            height="6.25"
            rx="1.125"
            fill={MyColors.border_yellow}
            stroke={MyColors.border_yellow}
            strokeWidth="0.25"
          />
        </Svg>
      )}
    </View>
  );
}
export function ICON_checkMark({
  color = "grey_light",
}: {
  color?: "grey_light" | "primary";
}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 9 10" fill="none">
      <Path
        d="M1 5.21053L3.8 9L8 1"
        stroke={
          color === "primary" ? MyColors.icon_primary : MyColors.icon_gray_light
        }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const s = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },
  x_line: {
    height: 16,
    width: 2,
    position: "absolute",
    borderRadius: 100,
    backgroundColor: MyColors.icon_gray_light,
  },
  x_line_big: {
    height: 20,
    width: 3,
  },
  x_line_primary: {
    backgroundColor: MyColors.icon_primary,
  },
  x_line_rotate: {
    transform: [{ rotate: "90deg" }],
  },

  toast: {},
});
