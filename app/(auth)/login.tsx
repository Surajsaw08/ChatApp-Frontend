import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
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

const Login = () => {
  const emailRef = useRef("");
  const passwardRef = useRef("");

  const [isLoding, setIsLoding] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwardRef.current) {
      Alert.alert("Login", "please fill all the field");
      return;
    }

    // Login logic here
    try {
      setIsLoding(true);
      await signIn(emailRef.current, passwardRef.current);
    } catch (error: any) {
      Alert.alert("Login error", error.message);
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
              forgot passward?
            </Typo>
          </View>

          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight={"600"}>
                  Welcome back
                </Typo>
                <Typo color={colors.neutral600}>we are happy to see you</Typo>
              </View>

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

              <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                <Button loading={isLoding} onPress={handleSubmit}>
                  <Typo fontWeight={"bold"} color={colors.black} size={20}>
                    Login
                  </Typo>
                </Button>
              </View>
              <View style={styles.footer}>
                <Typo>Don't have an account ?</Typo>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Typo fontWeight={"bold"} color={colors.primaryDark}>
                    Sign up
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

export default Login;

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
