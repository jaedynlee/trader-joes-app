import { Linking, Platform } from "react-native";
import {
  faMapLocationDot,
  faStore,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useRef, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { getNearbyStores } from "../../client/client";
import { setLocation as updateLocationInStorage } from "../../storage";
import { colors } from "../../style";
import { BodyText, SecondaryButton, SmallHeader } from "../common/typography";
import SearchBar from "./searchBar";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: "70%",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  link: {
    color: colors.RED,
  },
  list: {
    width: "100%",
    padding: 5,
  },
  item: {
    paddingVertical: 12,
  },
});

const StoreSelectorModal = ({
  visible,
  setModalVisible,
  selectedLocation,
  setLocation,
}) => {
  const text = useRef();
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const getResults = (newText) => {
    text.current = newText.trim();
    if (!newText.trim()) {
      return;
    }
    getNearbyStores(newText.trim()).then((response) => {
      if (response.collection) {
        setErrorMessage(undefined);
        setResults(response.collection);
      } else {
        setErrorMessage(
          "Couldn't locate any stores near there! Please try again with a different ZIP code."
        );
      }
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={() => setModalVisible(false)}
          >
            <FontAwesomeIcon icon={faXmark} size={16} color={colors.RED} />
            <BodyText style={{ color: colors.RED, paddingLeft: 3 }}>
              Close
            </BodyText>
          </Pressable>
          <FlatList
            style={styles.list}
            ListHeaderComponent={() => (
              <SearchBar
                initialText={text.current}
                placeholder="Enter ZIP or City, State"
                onEndEditing={getResults}
                hideClearButton={true}
              />
            )}
            data={results}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            )}
            ListEmptyComponent={() => <BodyText>{errorMessage}</BodyText>}
            renderItem={(i) => {
              const {
                clientkey,
                name,
                address1,
                address2,
                city,
                state,
                postalcode,
                phone,
                _distance,
                _distanceuom,
                comingsoon,
                latitude,
                longitude,
              } = i.item;

              const isSelected = selectedLocation?.clientkey === clientkey;
              const isComingSoon = comingsoon === "Yes";
              return (
                <View style={styles.item}>
                  <SmallHeader>{name}</SmallHeader>
                  <BodyText>
                    {address1}
                    {address2 ? ` ${address2}` : ""}
                  </BodyText>
                  <BodyText>
                    {city}, {state} {postalcode}
                  </BodyText>
                  <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
                    <BodyText style={{ color: colors.RED }}>{phone}</BodyText>
                  </Pressable>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingTop: 8,
                    }}
                  >
                    <BodyText>
                      {_distance}{" "}
                      {_distanceuom === "mile" ? "mi" : _distanceuom}
                    </BodyText>
                    <Pressable
                      onPress={() => {
                        const domain =
                          Platform.OS === "ios" ? "apple" : "android";
                        Linking.openURL(
                          `http://maps.${domain}.com/maps?q=${latitude},${longitude}`
                        );
                      }}
                    >
                      <BodyText style={{ color: colors.RED }}>
                        <FontAwesomeIcon
                          icon={faMapLocationDot}
                          color={colors.RED}
                        />{" "}
                        Map
                      </BodyText>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        Linking.openURL(
                          `https://locations.traderjoes.com/${state}/${city}/${clientkey}`
                        )
                      }
                    >
                      <BodyText style={{ color: colors.RED }}>
                        <FontAwesomeIcon icon={faStore} color={colors.RED} />{" "}
                        More Info
                      </BodyText>
                    </Pressable>
                  </View>
                  <SecondaryButton
                    name={
                      isComingSoon
                        ? "Coming soon!"
                        : isSelected
                        ? "My store"
                        : "Set as my store"
                    }
                    disabled={isSelected || isComingSoon}
                    onPress={() =>
                      updateLocationInStorage(clientkey, name)
                        .then((location) => {
                          setLocation(location);
                          setModalVisible(false);
                        })
                        .catch((e) =>
                          console.log(`Failed to set store with error: ${e}`)
                        )
                    }
                    style={{ marginTop: 10 }}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default StoreSelectorModal;
