import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../style";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    // margin: 10,
  },
  input: {
    // width: "90%",
    fontSize: 16,
    padding: 15,
    lineHeight: 20,
  },
  clearButton: {
    padding: 15,
  },
});

const SearchBar = ({
  initialText,
  placeholder,
  onEndEditing,
  keyboardType,
}) => {
  const [text, setText] = React.useState(initialText);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={colors.DARK_GRAY}
        keyboardType={keyboardType}
        onSubmitEditing={() => onEndEditing(text)}
        returnKeyType="search"
      />
      {text && (
        <Pressable
          style={styles.clearButton}
          color={colors.RED}
          onPress={() => setText(undefined)}
        >
          <FontAwesomeIcon icon={faXmark} size={20} color={colors.RED} />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
