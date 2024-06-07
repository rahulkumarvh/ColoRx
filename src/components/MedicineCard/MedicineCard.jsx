import axios from "axios";
import { format, formatDistance } from "date-fns";
import { ordinalNumber } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, Dialog, ScrollView, Text } from "tamagui";

import { COLORS } from "../../constants/colors";
import { nextTime } from "../../helpers";
import {
  updateMedicineStatus,
  updateMedicineStatusBasedOnTime,
} from "../../redux/reducers/userReducer";
import { MedicineReminderModal } from "../MedicineReminderModal/MedicineReminderModal";

export default function MedicineCard({
  data,
  lastTaken,
  navigation,
  currentRoute,
}) {
  const { medicineName, frequency, color, dosage } = data;
  const [fetched, setFetched] = useState(false);
  const [triggeredReminder, setTriggeredReminder] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [type, setType] = useState("PENDING");
  const dispatch = useDispatch();
  const [FDAResponse, setFDAResponse] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.fda.gov/drug/label.json?search=drug_interactions:${medicineName}`,
      )
      .then(function (response) {
        setFDAResponse(response.data.results[0]);
      })
      .finally(() => {
        setFetched(true);
      });
  }, [medicineName]);

  const onConfirmReminder = (medicineName) => {
    setShowReminderModal(false);

    dispatch(
      updateMedicineStatusBasedOnTime({ medicineName, userResponse: "YES" }),
    );
  };
  const onDenyReminder = (medicineName) => {
    dispatch(
      updateMedicineStatusBasedOnTime({ medicineName, userResponse: "NO" }),
    );
    setShowReminderModal(false);
  };

  function hasCrossedCurrentTime(dateTimeString) {
    // Parse the provided date-time string into a Date object
    const targetDate = new Date(dateTimeString);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the target date with the current date
    return targetDate < currentDate;
  }

  const isWithinTimeWindow = (dateTime) => {
    const targetDate = new Date(dateTime);

    // Get the current date and time
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(targetDate - currentDate);

    // Check if the time difference is less than or equal to 30 minutes (1800000 milliseconds)
    return timeDifference <= 1800000;
  };

  function updateMedicineStatusIfRequired(medicine) {
    // Extract lastTaken and status from the medicine object
    const { lastTaken, status } = medicine;
    const currentDate = new Date();

    // Ensure lastTaken is a Date object
    const lastTakenDate = new Date(lastTaken);

    // Calculate the time difference in hours
    const hoursDifference =
      Math.abs(currentDate - lastTakenDate) / (1000 * 60 * 60);
    // Check if the difference is 48 hours or more and the status is 'TAKEN'
    if (
      hoursDifference <= 48 &&
      status !== "PENDING" &&
      currentDate < lastTakenDate
    ) {
      // Update the status to 'PENDING'
      // medicine.status = 'PENDING';
      dispatch(updateMedicineStatus({ medicineName, status: "PENDING" }));
    }
  }

  useEffect(() => {
    updateMedicineStatusIfRequired(data);
  }, [data]);

  return (
    <View>
      {FDAResponse && (
        <Dialog open={showModal}>
          <Dialog.Trigger />
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content width="90%">
              <Dialog.Title>
                <Text fontFamily="Inter-Regular" className="text-xl">
                  Medicine Information
                </Text>
              </Dialog.Title>
              <ScrollView persistentScrollbar={true} maxHeight={400}>
                <Dialog.Description>
                  <Text fontFamily="Inter-Regular">
                    {FDAResponse["spl_product_data_elements"]}
                  </Text>
                  <Text fontFamily="Inter-Regular">
                    {FDAResponse["indications_and_usage"]}
                  </Text>
                </Dialog.Description>
              </ScrollView>

              <Dialog.Close className="mt-4">
                <Button
                  size="$4"
                  theme="default"
                  backgroundColor={COLORS.primary}
                  color="white"
                  onPress={() => setShowModal(false)}
                >
                  Close
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      )}
      <TouchableOpacity
        disabled={!FDAResponse}
        onPress={() => {
          // setShowReminderModal(true);
          setShowModal(true);
        }}
        className="p-4 rounded-xl shadow-lg"
        style={{ backgroundColor: color }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-center items-center">
            <Text
              fontFamily="Inter-Bold"
              className="capitalize text-lg mr-1"
              color="white"
            >
              {medicineName}
            </Text>
            {lastTaken && (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 32,
                  paddingHorizontal: 10,
                  height: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="text-xs"
                  // fontFamily="Inter-Bold"
                  color={COLORS.primary}
                >
                  Taken
                </Text>
              </View>
            )}
          </View>

          {!lastTaken && (
            <Text color="white" fontFamily="Inter-Regular" className="text-sm">
              {formatDistance(new Date(nextTime(frequency)), new Date(), {
                addSuffix: true,
              })}{" "}
              | {dosage} {dosage === 1 ? "dosage" : "dosages"}
            </Text>
          )}
        </View>

        <Text color="white" fontFamily="Inter-Regular">
          {format(
            new Date(lastTaken ? lastTaken : nextTime(frequency)),
            `MMMM ${
              frequency.repeatMode === "YEAR" ? "d, yyyy" : "d"
            } 'at' h:mma`,
            {
              locale: ordinalNumber,
            },
          )}
        </Text>
        {!fetched ? (
          <Text color="white" fontSize={10} mt={10} fontFamily="Inter-Light">
            Fetching information...
          </Text>
        ) : (
          FDAResponse && (
            <Text color="white" fontSize={10} mt={10} fontFamily="Inter-Light">
              Tap card for more information
            </Text>
          )
        )}
      </TouchableOpacity>
    </View>
  );
}
