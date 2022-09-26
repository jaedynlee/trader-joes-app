import React from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../style";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
  },
  input: {
    width: "90%",
    fontSize: 16,
    padding: 15,
    lineHeight: 20,
  },
});

const SearchBar = ({ navigation }) => {
  const [text, setText] = React.useState(undefined);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Search all products"
        onEndEditing={() =>
          text &&
          navigation.navigate("Filtered Products List", {
            name: `Results for "${text.trim()}"`,
            searchTerm: text.trim(),
          })
        }
      />
      {text && (
        <Button
          style={styles.clearButton}
          color={colors.RED}
          title="X"
          onPress={() => setText(undefined)}
        />
      )}
    </View>
  );
};

export default SearchBar;
