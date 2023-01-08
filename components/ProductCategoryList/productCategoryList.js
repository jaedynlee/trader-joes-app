import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../style.js";
import { getProductCategories } from "../../client/client";
import { BodyText, Header } from "../common/typography";
import SearchBar from "./searchBar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { getLocation } from "../../storage";
import StoreSelectorModal from "./storeSelectorModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
  item: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  header: {
    backgroundColor: colors.GRAY,
    padding: 10,
    paddingLeft: 20,
  },
});

const SetStoreButton = ({ setModalVisible, label }) => (
  <Pressable
    onPress={() => setModalVisible(true)}
    style={{
      flexDirection: "row",
      color: colors.RED,
      marginBottom: 10,
    }}
  >
    <FontAwesomeIcon icon={faLocationDot} color={colors.RED} />
    <BodyText style={{ color: colors.RED }}> {label}</BodyText>
  </Pressable>
);

const Item = ({ id, title, navigation }) => {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Filtered Products List", {
          name: title,
          categoryId: id,
        });
      }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE,
        },
      ]}
    >
      <View style={styles.item}>
        <BodyText>{title}</BodyText>
      </View>
    </Pressable>
  );
};

export const ProductCategoryList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // On initial screen load, set location from database
    getLocation().then((location) => {
      setLocation(location);
    });
  }, []);

  useEffect(() => {
    // Fetch product list when location is set or changes
    if (!location) {
      return;
    }

    getProductCategories().then((response) => {
      const productCategories = response.data.categoryList[0].children;
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children.length ? category.children : [category],
      }));
      setProducts(sections);
    });
  }, [location]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <StoreSelectorModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
          selectedLocation={location}
          setLocation={setLocation}
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SetStoreButton
            setModalVisible={setModalVisible}
            label="Set your store"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StoreSelectorModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        selectedLocation={location}
        setLocation={setLocation}
      />
      <SectionList
        sections={products}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} navigation={navigation} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Header style={styles.header}>{title}</Header>
        )}
        ListEmptyComponent={() => {
          if (!location) {
            return <BodyText>Please set a store to view products</BodyText>;
          }
          return (
            <ActivityIndicator
              size="large"
              animating={true}
              style={{ flex: 1, alignSelf: "center" }}
            />
          );
        }}
        ListHeaderComponent={() => (
          <View style={{ padding: 10 }}>
            <SetStoreButton
              setModalVisible={setModalVisible}
              label={!!location && location.name}
            />
            <SearchBar
              placeholder="Search all products"
              onEndEditing={(text) =>
                text &&
                navigation.navigate("Filtered Products List", {
                  name: `Results for "${text.trim()}"`,
                  searchTerm: text.trim(),
                  storeCode: location.clientkey,
                })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
