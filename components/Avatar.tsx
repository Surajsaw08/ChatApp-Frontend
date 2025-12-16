import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AvatarProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { Image } from "expo-image";
import { getAvatarPath } from "@/services/imageService";

const Avatar = ({ uri, size = 47, style, isGroup = false }: AvatarProps) => {
  return (
    <View
      style={[
        style,
        { height: verticalScale(size), width: verticalScale(size) },
        styles.avatar,
      ]}
    >
      <Image
        style={{ flex: 1 }}
        source={getAvatarPath(uri, isGroup)}
        contentFit="cover"
        transition={100}
      ></Image>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral200,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: "hidden",
  },
});
