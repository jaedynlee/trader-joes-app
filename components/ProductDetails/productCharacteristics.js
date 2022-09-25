import { StyleSheet, View } from "react-native";
import Tag from "../common/tag";

const styles = StyleSheet.create({
  tagsWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingTop: 20,
  },
});

const ProductCharacteristics = ({ characteristics }) => {
  return (
    <View style={styles.tagsWrapper}>
      {characteristics.map((c) => (
        <Tag label={c} key={c} />
      ))}
    </View>
  );
};

export default ProductCharacteristics;
