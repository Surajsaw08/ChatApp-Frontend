import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/Button";
import {
  getConversation,
  newConversation,
  newMessage,
  testSocket,
} from "@/socket/socketEvent";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import { ConversationProps, ResponseProps } from "@/types";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  useEffect(() => {
    getConversation(processConversation);
    newConversation(newConversationHandler);
    newMessage(newMessageHandler);
    getConversation(null);

    return () => {
      getConversation(processConversation, true);
      newConversation(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    };
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    if (res.success) {
      let conversationId = res.data.conversationId;
      setConversations((prev) => {
        let updatedConversations = prev.map((item) => {
          if (item._id == conversationId) item.lastMessage = res.data;
          return item;
        });
        return updatedConversations;
      });
    }
  };

  const processConversation = (res: ResponseProps) => {
    // console.log("res :", res);
    if (res.success) {
      setConversations(res.data);
    }
  };

  const newConversationHandler = (res: ResponseProps) => {
    if (res.success && res.data?.isNew) {
      setConversations((prev) => [...prev, res.data]);
    }
  };

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

  // const conversations = [
  //   {
  //     name: "Amit",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Amit",
  //       content: "Are you free right now?",
  //       createdAt: "2025-07-10T09:15:00Z",
  //     },
  //   },
  //   {
  //     name: "Project ChapApp",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Om",
  //       content: "Backend deployment is completed.",
  //       createdAt: "2025-07-11T14:40:00Z",
  //     },
  //   },
  //   {
  //     name: "Rohit",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Suraj",
  //       content: "I'll update you by evening.",
  //       createdAt: "2025-07-12T18:20:00Z",
  //     },
  //   },
  //   {
  //     name: "Frontend Team",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Neha",
  //       content: "Please review the pull request.",
  //       createdAt: "2025-07-13T10:05:00Z",
  //     },
  //   },
  //   {
  //     name: "Design Review",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Pooja",
  //       content: "New UI screens are ready.",
  //       createdAt: "2025-07-14T16:30:00Z",
  //     },
  //   },
  //   {
  //     name: "Sandeep",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Sandeep",
  //       content: "Did you check the document I sent?",
  //       createdAt: "2025-07-15T12:00:00Z",
  //     },
  //   },
  //   {
  //     name: "College Friends",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Rahul",
  //       content: "Weekend plan confirm karo.",
  //       createdAt: "2025-07-16T19:45:00Z",
  //     },
  //   },
  //   {
  //     name: "DevOps Sync",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Kunal",
  //       content: "Server scaling is done.",
  //       createdAt: "2025-07-17T08:50:00Z",
  //     },
  //   },
  // ];

  let directConversation = conversations
    .filter((item: ConversationProps) => item.type == "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversation = conversations
    .filter((item: ConversationProps) => item.type == "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // let directConversation = [];
  // let groupConversation = [{}];

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
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tabStyle,
                    selectedTab == 0 && styles.activeTabStyle,
                  ]}
                  onPress={() => setSelectedTab(0)}
                >
                  <Typo>Chats</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabStyle,
                    selectedTab == 1 && styles.activeTabStyle,
                  ]}
                  onPress={() => setSelectedTab(1)}
                >
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.conversationList}>
              {selectedTab == 0 &&
                directConversation.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversation.length != index + 1}
                    />
                  );
                })}
              {selectedTab == 1 &&
                groupConversation.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversation.length != index + 1}
                    />
                  );
                })}

              {!loading &&
                selectedTab == 0 &&
                directConversation.length == 0 && (
                  <Typo style={{ textAlign: "center" }}>
                    You don't have any message 😒
                  </Typo>
                )}

              {!loading &&
                selectedTab == 1 &&
                groupConversation.length == 0 && (
                  <Typo style={{ textAlign: "center" }}>
                    You don't have any group 😒
                  </Typo>
                )}

              {loading && <Loading />}
            </View>
          </ScrollView>
        </View>
      </View>
      <Button
        style={styles.floatingButton}
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModel",
            params: { isGroup: selectedTab },
          })
        }
      >
        <Icons.PlusIcon color="black" weight="bold" size={verticalScale(24)} />
      </Button>
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
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
