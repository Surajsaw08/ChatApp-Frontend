import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import { StatusBar } from "expo-status-bar";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/authContext";
import { UserDataProps } from "@/types";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { updateProfile } from "@/socket/socketEvent";

const ProfileModel = () => {
  const { user, signOut, updateToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    updateProfile(processUpdateProfile);

    return () => updateProfile(processUpdateProfile, true);
  }, []);

  const processUpdateProfile = (res: any) => {
    console.log("got res :", res);
    setLoading(false);

    if (res.success) {
      updateToken(res.data.token);
      router.back();
    } else {
      Alert.alert("user", res.msg);
    }
  };

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || null,
    });
  }, [user]);

  const onSubmit = () => {
    setLoading(true);
    // Simulate async operation

    const { name, avatar } = userData;

    if (!name.trim()) {
      Alert.alert("User", "plaease enter your name");
      setLoading(false);
      return;
    }

    // good to go
    const data = {
      name,
      avatar,
    };
    setLoading(true);
    updateProfile(data);
  };

  const showAlertMessage = () => {
    Alert.alert("confirm", "Are you want to LogOut", [
      {
        text: "cancel",
        onPress: () => {
          console.log("cancel Logout");
        },
        style: "cancel",
      },
      {
        text: "LogOut",
        onPress: () => handleLogOut(),
        style: "destructive",
      },
    ]);
  };

  const handleLogOut = async () => {
    router.back();
    await signOut();
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={Platform.OS == "android" && <BackButton color="black" />}
          style={{ marginVertical: spacingY._20 }}
        />

        {/* form */}

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarConatiner}>
            <Avatar uri={null} size={180} />
            <TouchableOpacity style={styles.editIcon}>
              <Icons.PencilIcon
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>
          <View style={{ gap: spacingY._20 }}>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>
              <Input
                value={userData.email}
                containerStyle={{
                  backgroundColor: colors.neutral300,
                  paddingLeft: spacingY._20,
                  borderColor: colors.neutral350,
                }}
                editable={false}
              ></Input>
            </View>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>
              <Input
                value={userData.name}
                containerStyle={{
                  // backgroundColor: colors.neutral300,
                  paddingLeft: spacingY._20,
                  borderColor: colors.neutral350,
                }}
                onChangeText={(value) => {
                  setUserData({ ...userData, name: value });
                }}
                // editable={false}
              ></Input>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {!loading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              height: verticalScale(56),
              width: verticalScale(56),
            }}
            onPress={showAlertMessage}
          >
            <Icons.SignOutIcon
              size={verticalScale(30)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}

        <Button style={{ flex: 1 }} onPress={onSubmit} loading={loading}>
          <Typo color={colors.black} fontWeight={"bold"}>
            Update
          </Typo>
        </Button>
      </View>
      <StatusBar style="dark" />
    </ScreenWrapper>
  );
};

export default ProfileModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarConatiner: {
    position: "relative",
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {},
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    paddingBottom: spacingY._15,
    borderColor: colors.neutral200,
    // marginBottom: spacingY._10,
    borderWidth: 1,
  },
});
