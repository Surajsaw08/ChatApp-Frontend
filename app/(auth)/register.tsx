import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useAuth } from "@/contexts/authContext";

const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwardRef = useRef("");
  const confirmPasswardRef = useRef("");

  const [isLoding, setIsLoding] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async () => {
    if (
      !nameRef.current ||
      !emailRef.current ||
      !passwardRef.current ||
      !confirmPasswardRef.current
    ) {
      Alert.alert("Sign up ", "please fill all the field");
      return;
    }

    if (passwardRef.current !== confirmPasswardRef.current) {
      Alert.alert("Sign up ", "passward do not match");
      return;
    }

    try {
      setIsLoding(true);
      await signUp(emailRef.current, passwardRef.current, nameRef.current, "");
    } catch (error: any) {
      Alert.alert("Regestration error", error.message);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern={true}>
        <View style={styles.conatiner}>
          <View style={styles.header}>
            <BackButton iconSize={28} />
            <Typo size={17} color={colors.white}>
              need some help?
            </Typo>
          </View>

          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight={"600"}>
                  Getting started
                </Typo>
                <Typo color={colors.neutral600}>
                  Create an account to continue
                </Typo>
              </View>
              <Input
                placeholder="Enter your name"
                onChangeText={(value: string) => (nameRef.current = value)}
                icon={
                  <Icons.UserIcon
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />
              <Input
                placeholder="Enter your email"
                onChangeText={(value: string) => (emailRef.current = value)}
                icon={
                  <Icons.AtIcon
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />
              <Input
                placeholder="passward"
                secureTextEntry
                onChangeText={(value: string) => (passwardRef.current = value)}
                icon={
                  <Icons.LockIcon
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />
              <Input
                placeholder=" Confirm passward"
                secureTextEntry
                onChangeText={(value: string) =>
                  (confirmPasswardRef.current = value)
                }
                icon={
                  <Icons.LockIcon
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />
              <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                <Button loading={isLoding} onPress={handleSubmit}>
                  <Typo fontWeight={"bold"} color={colors.black} size={20}>
                    Sign up
                  </Typo>
                </Button>
              </View>
              <View style={styles.footer}>
                <Typo>Already have an account ?</Typo>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Typo fontWeight={"bold"} color={colors.primaryDark}>
                    Login
                  </Typo>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
