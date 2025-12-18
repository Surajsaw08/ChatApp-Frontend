import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { StatusBar } from "expo-status-bar";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { verticalScale } from "@/utils/styling";
import { getContacts, newConversation } from "@/socket/socketEvent";
import { uploadFileToCloudinary } from "@/services/imageService";

const NewConversationModel = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup == "1";
  const router = useRouter();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipant, setSelectedparticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conatcts, setContacts] = useState([]);

  const { user: currUser } = useAuth();

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation);
    getContacts(null); // emit the getContacts event

    return () => {
      getContacts(processGetContacts, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    console.log("got contacts :", res);
    if (res.success) {
      setContacts(res.data);
    }
  };
  const processNewConversation = (res: any) => {
    //console.log("new conversation result :", res);
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: "/(main)/conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      console.log("Error  fetching /creating conversation :", res.msg);
      Alert.alert("Error", res.msg);
    }
  };

  // const conatcts = [
  //   {
  //     id: 1,
  //     name: "Suraj",
  //     avatar: "https://i.pravatar.cc/150?img=1",
  //   },
  //   {
  //     id: 2,
  //     name: "Amit",
  //     avatar: "https://i.pravatar.cc/150?img=2",
  //   },
  //   {
  //     id: 3,
  //     name: "Rohit",
  //     avatar: "https://i.pravatar.cc/150?img=3",
  //   },
  //   {
  //     id: 4,
  //     name: "Neha",
  //     avatar: "https://i.pravatar.cc/150?img=4",
  //   },
  //   {
  //     id: 5,
  //     name: "Pooja",
  //     avatar: "https://i.pravatar.cc/150?img=5",
  //   },
  //   {
  //     id: 6,
  //     name: "Kunal",
  //     avatar: "https://i.pravatar.cc/150?img=6",
  //   },
  //   {
  //     id: 7,
  //     name: "Rahul",
  //     avatar: "https://i.pravatar.cc/150?img=7",
  //   },
  //   {
  //     id: 8,
  //     name: "Sandeep",
  //     avatar: "https://i.pravatar.cc/150?img=8",
  //   },
  // ];

  const createGroup = async () => {
    if (!currUser || !groupName.trim() || selectedParticipant.length < 2)
      return;

    // create group
    setIsLoading(true);
    try {
      let avatar = null;

      if (groupAvatar) {
        const uploadResult = await uploadFileToCloudinary(
          groupAvatar,
          "group-avatars"
        );
        if (uploadResult.success) avatar = uploadResult.data;
      }
      newConversation({
        type: "group",
        participants: [currUser.id, ...selectedParticipant],
        name: groupName,
        avatar,
      });
    } catch (error: any) {
      console.log("Error creating gropu", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleParticipant = (user: any) => {
    setSelectedparticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id != user.id);
      }
      return [...prev, user.id];
    });
  };
  const onSelectUSer = (user: any) => {
    if (!currUser) {
      Alert.alert("Authentecation", "you must have to login to chat");
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    } else {
      //start new conversation

      newConversation({
        type: "direct",
        participants: [currUser.id, user.id],
      });
    }
  };

  const onPicImg = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]);
    }
  };
  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "New Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        ></Header>
        {isGroupMode && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarConatiner}>
              <TouchableOpacity onPress={onPicImg}>
                <Avatar
                  uri={groupAvatar?.uri || null}
                  isGroup={true}
                  size={100}
                ></Avatar>
              </TouchableOpacity>
            </View>
            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              ></Input>
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conatctList}
        >
          {conatcts.map((user: any, index) => {
            const isSelected = selectedParticipant.includes(user.id);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.conatinerRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUSer(user)}
              >
                <Avatar size={45} uri={user.avatar}></Avatar>
                <Typo fontWeight={"500"}>{user.name}</Typo>
                {isGroupMode && (
                  <View style={styles.selectionIndicator}>
                    <View
                      style={[styles.checkbox, isSelected && styles.checked]}
                    ></View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {isGroupMode && selectedParticipant.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
            >
              <Typo fontWeight={"bold"} size={17}>
                Create Group
              </Typo>
            </Button>
          </View>
        )}
      </View>
      <StatusBar style="dark" />
    </ScreenWrapper>
  );
};

export default NewConversationModel;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingX._10,
  },
  avatarConatiner: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
  },
  conatctList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  conatinerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderTopColor: colors.neutral200,
  },
});
