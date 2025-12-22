import { StyleSheet, View } from "react-native";
import React from "react";
import { MessageProps } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Avatar from "./Avatar";
import Typo from "./Typo";
import moment from "moment";
import { Image } from "expo-image";

const MessageItem = ({
  item,
  isDirect,
}: {
  item: MessageProps;
  isDirect: boolean;
}) => {
  const { user: currentUser } = useAuth();
  const isMe = currentUser?.id === item.sender.id;

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm A")
    : moment(item.createdAt).format("MMM D, h:mm A");

  return (
    <View
      style={[
        styles.messagesContainer,
        isMe ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!isMe && !isDirect && (
        <Avatar
          size={40}
          uri={item?.sender?.avatar}
          style={styles.messageAvatar}
        />
      )}

      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        {!isMe && !isDirect && (
          <Typo color={colors.neutral900} fontWeight="500" size={10}>
            {item.sender.name}
          </Typo>
        )}

        {item.attachment && (
          <Image
            source={item.attachment}
            contentFit="cover"
            style={styles.attachment}
            transition={100}
          />
        )}

        {/* Message content + time (same line like WhatsApp) */}
        <View style={styles.messageRow}>
          {item.content && (
            <Typo size={15} style={styles.messageText}>
              {item.content}
            </Typo>
          )}
          <Typo
            size={9}
            color={colors.neutral600}
            fontWeight="500"
            style={styles.messageTime}
          >
            {formattedDate}
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messagesContainer: {
    flexDirection: "row",
    gap: spacingX._7,
    maxWidth: "80%",
  },

  attachment: {
    height: verticalScale(180),
    width: verticalScale(180),
    borderRadius: radius._10,
  },
  myMessage: {
    alignSelf: "flex-end",
  },

  theirMessage: {
    alignSelf: "flex-start",
  },

  messageAvatar: {
    alignSelf: "flex-end",
  },

  messageBubble: {
    padding: spacingX._10,
    borderRadius: radius._15,
    gap: spacingY._5,
  },

  myBubble: {
    backgroundColor: colors.myBubble,
  },

  theirBubble: {
    backgroundColor: colors.otherBubble,
  },

  /* WhatsApp-style content + time row */
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },

  messageText: {
    flexShrink: 1,
  },

  messageTime: {
    marginLeft: spacingX._12,
    alignSelf: "flex-end",
  },
});
