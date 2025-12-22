import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import MessageItem from "@/components/MessageItem";
import Input from "@/components/Input";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import Loading from "@/components/Loading";
import { uploadFileToCloudinary } from "@/services/imageService";
import { getMessages, newMessage } from "@/socket/socketEvent";
import { MessageProps, ResponseProps } from "@/types";

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();
  const participants = JSON.parse(stringifiedParticipants as string);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  let conversationAvatar = avatar;
  let isDirect = type == "direct";
  const otherParticipant = isDirect
    ? participants.find((p: any) => p._id != currentUser?.id)
    : null;

  if (isDirect && otherParticipant) {
    conversationAvatar = otherParticipant.avatar;
  }
  let conversationName = isDirect ? otherParticipant?.name : name;

  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messagesHandler);

    getMessages({ conversationId });

    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messagesHandler, true);
    };
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);
    // console.log(res.data);

    // this is for when conversationId is same that it update the message in real time.
    if (res.success) {
      if (res.data.conversationId == conversationId) {
        setMessages((prev) => [res.data as MessageProps, ...prev]);
      }
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const messagesHandler = (res: ResponseProps) => {
    // console.log(res);
    if (res.success) {
      setMessages(res.data);
    }
  };

  const onPickFile = async () => {
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
      // aspect: [3, 4],
      quality: 0.2,
    });

    // console.log(result);

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!currentUser) return;
    setLoading(true);
    try {
      let attachment = null;
      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachments"
        );
        if (uploadResult.success) {
          attachment = uploadResult.data;
        } else {
          setLoading(false);
          Alert.alert("Error", "failed to send Image");
        }
      }
      // console.log("image :", attachment);

      newMessage({
        conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        content: message.trim(),
        attachment,
      });

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.log("Error sending message ", error);
      Alert.alert("Error", "failed to send mesage");
    } finally {
      setLoading(false);
    }
  };
  // const dummyMesaage = [
  //   {
  //     id: "msg_10",
  //     sender: {
  //       id: "user_2",
  //       name: "suraj saw",
  //       avatar: null,
  //     },
  //     content: "that would be really nice",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_9",
  //     sender: {
  //       id: "me",
  //       name: "me",
  //       avatar: null,
  //     },
  //     content: "sdfghjk rtyuicvbn fghj",
  //     createdAt: "10:42 AM",
  //     isMe: true,
  //   },
  //   {
  //     id: "msg_8",
  //     sender: {
  //       id: "user_1",
  //       name: "om",
  //       avatar: null,
  //     },
  //     content: "that would be really nice",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_7",
  //     sender: {
  //       id: "me",
  //       name: "me",
  //       avatar: null,
  //     },
  //     content: "that would be really would be really nice nice",
  //     createdAt: "08:42 PM",
  //     isMe: true,
  //   },
  //   {
  //     id: "msg_6",
  //     sender: {
  //       id: "user_1",
  //       name: "om",
  //       avatar: null,
  //     },
  //     content: "that would be really nice",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_5",
  //     sender: {
  //       id: "me",
  //       name: "me",
  //       avatar: null,
  //     },
  //     content: "that would be would be really nicertyuicvbn fghj",
  //     createdAt: "08:42 PM",
  //     isMe: true,
  //   },
  //   {
  //     id: "msg_4",
  //     sender: {
  //       id: "user_1",
  //       name: "om",
  //       avatar: null,
  //     },
  //     content: "that would be really nice",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_3",
  //     sender: {
  //       id: "me",
  //       name: "me",
  //       avatar: null,
  //     },
  //     content: "that would be rtyuicvbn fghj",
  //     createdAt: "08:42 PM",
  //     isMe: true,
  //   },
  //   {
  //     id: "msg_2",
  //     sender: {
  //       id: "user_1",
  //       name: "om",
  //       avatar: null,
  //     },
  //     content:
  //       "that would be really nicewould be really nicewould be really nice",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_1",
  //     sender: {
  //       id: "me",
  //       name: "me",
  //       avatar: null,
  //     },
  //     content: "that would be would be really nicertyuicvbn fghj",
  //     createdAt: "08:42 PM",
  //     isMe: true,
  //   },
  // ];
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar
                size={40}
                uri={conversationAvatar as string}
                isGroup={type == "group"}
              />
              <Typo color={colors.white} size={22} fontWeight={"500"}>
                {conversationName || "Chat"}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
              <Icons.DotsThreeOutlineVerticalIcon
                weight="fill"
                color={colors.white}
              />
            </TouchableOpacity>
          }
        ></Header>

        {/* messages */}
        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* footer */}

        <View style={styles.footer}>
          <Input
            value={message}
            onChangeText={setMessage}
            containerStyle={{
              paddingLeft: spacingY._10,
              paddingRight: scale(65),
              borderWidth: 0,
            }}
            placeholder="tpye message"
            icon={
              <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                <Icons.PlusIcon
                  color={colors.black}
                  weight="bold"
                  size={verticalScale(22)}
                />
                {selectedFile && selectedFile.uri && (
                  <Image
                    source={selectedFile.uri}
                    style={styles.selectedFile}
                  />
                )}
              </TouchableOpacity>
            }
          />
          <View style={styles.inputRightIcon}>
            <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
              {loading ? (
                <Loading size={12} color={colors.black} />
              ) : (
                <Icons.PaperPlaneTiltIcon
                  color={colors.black}
                  weight="fill"
                  size={verticalScale(22)}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  messagesContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 0,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  inputIcon: {
    borderRadius: radius.full,
    backgroundColor: colors.primaryDark,
    padding: 8,
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
});
