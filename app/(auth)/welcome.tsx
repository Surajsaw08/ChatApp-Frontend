import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Typo color={colors.white} size={43} fontWeight={"900"}>
            Texto
          </Typo>
        </View>

        <Animated.Image
          entering={FadeIn.duration(700).springify()}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode={"contain"}
        />

        <View>
          <Typo color={colors.white} fontWeight={"800"} size={33}>
            Stay Connected
          </Typo>
          <Typo color={colors.white} fontWeight={"800"} size={33}>
            with your friends
          </Typo>
          <Typo color={colors.white} fontWeight={"800"} size={33}>
            and family
          </Typo>
        </View>

        <Button
          style={{ backgroundColor: colors.white }}
          onPress={() => router.push("/(auth)/register")}
        >
          <Typo size={23} fontWeight={"bold"}>
            Get started
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._10,
  },
  Background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },

  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: "center",
  },
});
