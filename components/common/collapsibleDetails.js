import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View,
} from "react-native";
import { Header } from "../common/typography.js";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CollapsibleDetails = ({ label, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
      >
        <Header>
          {label} {expanded ? "v" : ">"}
        </Header>
      </Pressable>
      {expanded && children}
    </View>
  );
};

export default CollapsibleDetails;
