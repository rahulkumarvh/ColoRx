import { LinearGradient } from "@tamagui/linear-gradient";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import sortBy from "lodash/sortBy";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StatusBar, StyleSheet, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  Adapt,
  Button,
  Card,
  Select,
  Sheet,
  Text,
  YStack,
  getFontSize,
} from "tamagui";

import * as medicineData from "../../../assets/medicine-data.json";
import { COLORS, COLOR_PALLETTE } from "../../constants/colors";
import { addMedicine } from "../../redux/reducers/userReducer";

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const AddMedicineScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      medicine: "",
    },
  });

  const [medicineUserData, setMedicineUserData] = useState({});
  const dispatch = useDispatch();
  const { medicines, colorBlindness } = useSelector(
    (state) => state.userReducer,
  );

  const usedColors = [];
  const [medicineId, setMedicineId] = useState(null);

  const [dirty, setDirty] = useState(false);
  medicines.forEach((ele) => {
    usedColors.push(ele.color);
  });
  const remainingPalette = COLOR_PALLETTE[colorBlindness || "DEFAULT"].filter(
    (x) => !usedColors.includes(x),
  );
  const randomColor =
    remainingPalette[Math.floor(Math.random() * remainingPalette.length)];

  const selectMedicine = (name) => {
    setMedicineUserData((prevState) => ({
      ...prevState,
      medicineName: name,
      id: Date.now(),
    }));
  };

  const openDosageScreen = () => {
    navigation.navigate("AddDosageNum", {
      medicineUserData,
      setMedicineUserData,
    });
  };

  const openFrequencyInput = () => {
    navigation.navigate("AddFrequencyScreen", {
      medicineUserData,
      setMedicineUserData,
    });
  };

  const onSubmit = (data) => {
    handleAddMedicine();
  };

  // const generateColor = (medicines) => {
  //   const usedColors = [];
  //   medicines.forEach((ele) => {
  //     usedColors.push(ele.color);
  //   });
  //   const remainingPalette = COLOR_PALLETTE.filter(
  //     (x) => !usedColors.includes(x),
  //   );
  //   const randomColor =
  //     remainingPalette[Math.floor(Math.random() * remainingPalette.length)];

  //   return randomColor;
  // };

  const handleAddMedicine = () => {
    dispatch(
      addMedicine({
        ...medicineUserData,
        color: randomColor,
        lastTaken: null,
        status: "PENDING",
      }),
    );
    navigation.replace("Dashboard");
  };

  const FREQUENCY = [
    { label: "Day(s)", value: "DAY" },
    { label: "Week(s)", value: "WEEK" },
    { label: "Month(s)", value: "MONTH" },
    { label: "Year(s)", value: "YEAR" },
  ];

  const isValid =
    medicineUserData.medicineName &&
    medicineUserData.dosage &&
    medicineUserData.frequency;

  const dataSet = sortBy(
    items
      .filter(
        (item) =>
          !medicines.find(
            (i) =>
              i.medicineName.toLowerCase() ===
              item["PROPRIETARYNAME"].toLowerCase(),
          ),
      )
      .map((item) => ({
        title: item["PROPRIETARYNAME"].toProperCase(),
        id: item["PRODUCTID"],
      })),
    "title",
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={[styles.header, { color: COLORS.primary }]}>
        Add Medicine
      </Text>
      <Card
        style={[
          styles.card,
          { backgroundColor: isValid ? randomColor : "#f0f0f0" },
        ]}
        elevation={4}
      >
        <YStack space="$4" padding="$4">
          <AutocompleteDropdown
            clearOnFocus={false}
            // direction="down"
            // closeOnBlur
            closeOnSubmit={false}
            inputContainerStyle={{
              backgroundColor: "white",
            }}
            emptyResultText="No results found"
            textInputProps={{
              placeholder: "Search medicine..",
              autoCorrect: false,
              autoCapitalize: "none",
            }}
            onClear={() => {
              setMedicineId(null);
              selectMedicine(null);
            }}
            onChangeText={(text) => {
              if (text?.length > 3) {
                setDirty(true);
              }
            }}
            onSelectItem={(item) => {
              if (item) {
                selectMedicine(item.title);
                setMedicineId(item.id);
              }
            }}
            dataSet={dataSet}
          />
          {!medicineUserData.medicineName && dirty && (
            <Text className="text-sm text-red-500 -mt-4 -mb-2">
              Enter a valid medicine.
            </Text>
          )}
          {/* <SelectDemoItem
            val={medicineUserData.name}
            setVal={selectMedicine}
            items={items
              .filter(
                (item) =>
                  !medicines.find(
                    (i) =>
                      i.medicineName.toLowerCase() ===
                      item["PROPRIETARYNAME"].toLowerCase(),
                  ),
              )
              .map((item) => ({
                title: item["PROPRIETARYNAME"],
                id: item["PRODUCTID"],
              }))}
          /> */}
          <Button
            onPress={openDosageScreen}
            size="$4"
            theme="default"
            style={styles.button}
          >
            <Text fontFamily="Inter-Regular" color={COLORS.white}>
              {medicineUserData.dosage ? medicineUserData.dosage : ""}
              {medicineUserData.dosage ? " (Edit Dosage)" : " Add Dosage"}
            </Text>
          </Button>
          {medicineUserData.frequency && (
            <View className="bg-black rounded-xl w-full h-max p-1 -mb-2 px-2">
              <Text className=" text-white" fontFamily="Inter-Regular">
                Repeats every {medicineUserData.frequency.freq}{" "}
                {FREQUENCY.find(
                  (ele) => ele.value === medicineUserData.frequency.repeatMode,
                ).label.toLowerCase()}{" "}
                at{" "}
                {medicineUserData.frequency
                  ? format(
                      new Date(medicineUserData.frequency.time),
                      "h:mmaaaaa'm'",
                    )
                  : ""}
              </Text>
            </View>
          )}
          <Button
            onPress={openFrequencyInput}
            size="$4"
            theme="default"
            style={styles.button}
          >
            <Text fontFamily="Inter-Regular" color={COLORS.white}>
              {medicineUserData.frequency ? "Edit Frequency" : " Add Frequency"}
            </Text>
          </Button>
        </YStack>
      </Card>
      <Button
        size="$4"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        theme="default"
        style={[
          styles.button,
          styles.addButton,
          {
            color: isValid ? COLORS.white : COLORS.black,
            backgroundColor: isValid ? COLORS.primary : "#e7e7e7",
          },
        ]}
      >
        Add Medicine
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    color: "#212121",
    fontFamily: "Inter-Bold",
  },
  card: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowColor: "#000000",
    backgroundColor: "#f0f0f0",
    width: "80%",
    alignItems: "center",
  },
  button: {
    fontFamily: "Inter-Regular",
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: 6,
    minWidth: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
  },
  addButton: {
    // backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: "60%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowColor: "#000000",
    elevation: 3,
  },
  input: {
    textAlign: "center",
    backgroundColor: "#fff", // Set background color if needed
    minWidth: "100%",
    marginBottom: 10,
    fontSize: 16, // Adjust fontSize
    borderBottomWidth: 0,
    borderBottomColor: "#000", // Set borderBottomColor if needed
    paddingVertical: 10, // Adjust paddingVertical to match the style
  },
  list: {
    maxHeight: 100,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    width: "100%",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
});

export default AddMedicineScreen;

function SelectDemoItem({ val, setVal, items, ...props }) {
  return (
    <Select
      id="medicine"
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger iconAfter={ChevronDown} width={500}>
        <Select.Value placeholder="Add Medicine" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          // snapPointsMode="fit"
          zIndex={100_000}
          disableDrag
          // dismissOnOverlayPress={false}
          moveOnKeyboardChange
          animationConfig={{
            type: "timing",
            damping: 20,
            duration: 200,
            mass: 2,
            stiffness: 150,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          animation="quick"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            {/* <Select.Label>Choose Medicine</Select.Label> */}
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                sortBy(items, "PROPRIETARYNAME").map((item, i) => {
                  return (
                    <Select.Item
                      debug="verbose"
                      index={i}
                      key={item["PRODUCTID"]}
                      value={item["PROPRIETARYNAME"].toLowerCase()}
                    >
                      <Select.ItemText>
                        <Text
                          fontFamily="Inter-Regular"
                          style={{ textTransform: "capitalize" }}
                        >
                          {item["PROPRIETARYNAME"]}
                        </Text>
                      </Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [items],
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width="$4"
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize(props.size ?? "$true")} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}

const key = "PROPRIETARYNAME";
const arrayUniqueByKey = [
  ...new Map(
    medicineData.list.map((item) => [item[key].toLowerCase(), item]),
  ).values(),
];
const items = arrayUniqueByKey;
