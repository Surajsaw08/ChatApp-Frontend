// import {
//   ActivityIndicator,
//   ActivityIndicatorProps,
//   StyleSheet,
//   View,
// } from "react-native";
// import React from "react";
// import { colors } from "@/constants/theme";

// const Loading = ({
//   size = "large",
//   color = colors.primaryDark,
// }: ActivityIndicatorProps) => {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size={size} color={color} />
//     </View>
//   );
// };

// export default Loading;

// const styles = StyleSheet.create({});

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

interface LoadingProps {
  size?: number;
  color?: string;
}

const Dot = ({
  delay,
  size,
  color,
}: {
  delay: number;
  size: number;
  color: string;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
        },
      ]}
    />
  );
};

const Loading = ({ size = 10, color = colors.primaryDark }: LoadingProps) => {
  return (
    <View style={styles.container}>
      <Dot delay={0} size={size} color={color} />
      <Dot delay={200} size={size} color={color} />
      <Dot delay={400} size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {},
});
