import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/Button";
import { testSocket } from "@/socket/socketEvent";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true);
  //   };
  // }, []);

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("got response from test socket event ", data);
  // };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back{" "}
              <Typo size={20} color={colors.white} fontWeight={"800"}>
                {currentUser?.name}
              </Typo>{" "}
              🤞
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => {
              router.push("/(main)/profileModel");
            }}
          >
            <Icons.GearSixIcon
              color={colors.white}
              size={verticalScale(22)}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}></View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingX._15,
    paddingBottom: spacingY._20,
  },

  row: {},
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
});
