import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { opacity } from "../utils/opacity";
import * as Icons from "react-native-heroicons/outline";
import * as IconsSolid from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocForecast, fetchSearchLocForecast } from "../api/weather";
import { weatherImages } from "../constant";

const HomeScreens = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  function handleLocSelection(loc) {
    setLocations([]);
    console.log(loc);
    fetchLocForecast({ city: loc.name, days: 7 }).then((data) => {
      console.log(data);
      setWeather(data);
    });
  }

  function handleSearch(text) {
    if (text.length > 2) {
      fetchSearchLocForecast({ city: text }).then((data) => {
        setLocations(data);
      });
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 300), []);

  const { current, location, forecast } = weather;

  const daysOfWeek = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const getForecastDays = () => {
    const today = new Date();
    let forecastDays = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      forecastDays.push(daysOfWeek[date.getDay()]);
    }
    return forecastDays;
  };

  const forecastDays = getForecastDays();

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full"
        blurRadius={70}
        source={require("../assets/images/bg.png")}
      />
      <SafeAreaView className="flex flex-1 my-4 mx-4">
        {/* Search Section */}
        <View style={{ height: "7%" }} className="mx-4 mb-14 relative z-50">
          {/* Search Bar */}
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
                onChangeText={(text) => {
                  handleTextDebounce(text);
                }}
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
          {/* Search Results */}
          <View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-1 rounded-3xl p-1">
                {locations.map((loc, index) => {
                  let isLastBorder = index === locations.length - 1;
                  return (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center gap-3 border-gray-400 rounded-3xl px-3 py-1 mb-2"
                      style={{
                        borderBottomWidth: isLastBorder ? 0 : 2,
                      }}
                      onPress={() => {
                        handleLocSelection(loc);
                      }}
                    >
                      <IconsSolid.MapPinIcon color={"gray"} size={20} />
                      <Text className="text-black text-lg">
                        {loc.name}, {loc.region}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>
        {/* Weather Forecast Section */}
        <View className="flex flex-1 mb-2 gap-6">
          {/* Loc Name */}
          <View>
            <Text className="text-white text-center text-3xl font-extrabold">
              {location ? location.name : "Pilih lokasi dulu"}
              <Text className="text-gray-300 text-center text-lg font-bold">
                {location ? ", " + location.region : ""}
              </Text>
            </Text>
          </View>
          {/* Image ForeCasting */}
          <View className="flex-row justify-center items-center">
            <Image
              className="w-52 h-52"
              source={
                weatherImages[
                  current?.condition?.text.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter) => letter.toUpperCase(),
                  )
                ]
              }
            />
          </View>
          {/* Degree forecast */}
          <View className="flex-1 items-center">
            <Text className="font-extrabold text-white text-6xl">
              {current ? current.temp_c : "0"}&#176;C
            </Text>
            <Text className="font-semibold text-white text-xl tracking-widest">
              {current?.condition?.text.toString()}
            </Text>
          </View>
          {/* Weather Stats */}
          <View className="flex-row mx-4 justify-around">
            <View className="flex-row space-x-2 items-center">
              <Image
                className="h-8 w-8"
                source={require("../assets/icons/wind.png")}
              />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph} Km/jam
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                className="h-8 w-8"
                source={require("../assets/icons/drop.png")}
              />
              <Text className="text-white font-semibold text-base">
                ${current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                className="h-8 w-8"
                source={require("../assets/icons/sun.png")}
              />
              <Text className="text-white font-semibold text-base">
                ${current?.humidity}
              </Text>
            </View>
          </View>
          {/* Daily Forecast */}
          <View className="mb-b space-y-3">
            <View className="flex-row items-center space-x-2 mx-5">
              <IconsSolid.CalendarDaysIcon size={24} color={"white"} />
              <Text className="text-white text-base">
                Ramalan 5 Hari Kedepan
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
              showsHorizontalScrollIndicator={false}
            >
              {forecast?.forecastday?.map((day, index) => {
                const isFirstIndex = index === 0;
                console.log({});
                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-2"
                    style={{
                      backgroundColor: opacity.bgWhite(0.15),
                      marginHorizontal: isFirstIndex ? 0 : 10,
                      marginRight: isFirstIndex ? 5 : 0,
                    }}
                  >
                    <Image
                      className="h-11 w-11"
                      source={
                        weatherImages[
                          day?.day?.condition?.text?.replace(
                            /(^\w{1})|(\s+\w{1})/g,
                            (letter) => letter.toUpperCase(),
                          )
                        ]
                      }
                    />
                    <Text className="text-white">{day.date}</Text>
                    <Text className="text-white">
                      {day?.day?.condition?.text?.replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        (letter) => letter.toUpperCase(),
                      )}
                    </Text>
                    <Text className="text-white text-xl font-semibold">
                      {day?.day?.avgtemp_c}&#176;C
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreens;
