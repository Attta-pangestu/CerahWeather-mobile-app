import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { opacity } from "../utils/opacity";
import * as Icons from "react-native-heroicons/outline";
import * as IconsSolid from "react-native-heroicons/solid";

const HomeScreens = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState([1, 2, 3]);

  function handleLocSelection(loc) {
    console.log(loc);
  }

  return (
    <View className="flex-1 ">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full"
        blurRadius={70}
        source={require("../assets/images/bg.png")}
      />
      <SafeAreaView className="flex flex-1 my-4 mx-2">
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch
                ? opacity.bgWhite(0.3)
                : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                placeholder="Cari Kota"
                placeholderTextColor={"lightgray"}
                className="pl-6 pb-1 h-10 flex-1 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              className="rounded-full p-3 m-1"
              activeOpacity={0.7}
              style={{ backgroundColor: opacity.bgWhite(0.3) }}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Icons.MagnifyingGlassIcon color={"white"} size={25} />
            </TouchableOpacity>
          </View>

          <View>
            {location.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-1 rounded-3xl p-1">
                {location.map((loc, index) => {
                  let isLastBorder = index === location.length - 1;
                  return (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center gap-3  border-gray-400 rounded-3xl px-3 py-1 mb-2 "
                      style={{
                        borderBottomWidth: isLastBorder ? 0 : 2,
                      }}
                      onPress={() => handleLocSelection(loc)}
                    >
                      <IconsSolid.MapPinIcon color={"gray"} size={20} />

                      <Text className="text-black text-lg ">
                        London, United Kingdom
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({});
