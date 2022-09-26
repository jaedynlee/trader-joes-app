import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../style.js";
import CollapsibleDetails from "../common/collapsibleDetails.js";
import { BodyText } from "../common/typography.js";

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  tableWrapper: {
    paddingTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    flex: 7,
    minHeight: 24,
    alignItems: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});

const Nutrition = ({ nutrition }) => {
  return (
    <View style={styles.container}>
      <CollapsibleDetails label="Nutrition Facts">
        <BodyText>
          <BodyText style={styles.bold}>Serving size:</BodyText>{" "}
          {nutrition.serving_size}
        </BodyText>
        <BodyText>
          <BodyText style={styles.bold}>Calories per serving:</BodyText>{" "}
          {nutrition.calories_per_serving}
        </BodyText>

        <View style={styles.tableWrapper}>
          <View style={styles.tableRow}>
            <BodyText style={{ fontWeight: "bold", flex: 4 }}>
              {nutrition.servings_per_container}
            </BodyText>
            <BodyText style={{ fontWeight: "bold", flex: 2 }}>Amount</BodyText>
            <BodyText
              style={{ fontWeight: "bold", flex: 1, textAlign: "right" }}
            >
              %DV
            </BodyText>
          </View>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          {nutrition.details.map((d, index) => (
            <View
              key={d.nutritional_item}
              style={
                index % 2
                  ? { backgroundColor: colors.GRAY, ...styles.tableRow }
                  : styles.tableRow
              }
            >
              <BodyText style={{ flex: 4 }}>{d.nutritional_item}</BodyText>
              <BodyText style={{ flex: 2 }}>{d.amount}</BodyText>
              <BodyText style={{ flex: 1, textAlign: "right" }}>
                {d.percent_dv &&
                  `${(parseFloat(d.percent_dv) * 100).toFixed(0)}%`}
              </BodyText>
            </View>
          ))}
        </View>
      </CollapsibleDetails>
    </View>
  );
};

export default Nutrition;
