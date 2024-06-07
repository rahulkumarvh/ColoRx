import { format } from "date-fns";
import { AlertDialog, Button, Text, View, XStack, YStack } from "tamagui"; // or '@tamagui/alert-dialog'
import { COLORS } from "../../constants/colors";
import { nextTime } from "../../helpers";

export const MedicineReminderModal = ({
  visible,
  medicine,
  onConfirm,
  onCancel,
  type,
}) => {
  const { color } = medicine;

  return (
    <AlertDialog open={visible}>
      {/* <AlertDialog.Trigger asChild>
        <Button>Show Alert</Button>
      </AlertDialog.Trigger> */}

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          className="relative overflow-hidden"
          width={300}
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <AlertDialog.Title>
              <View className="">
                <Text className="text-3xl">Reminder</Text>
              </View>
            </AlertDialog.Title>
            <AlertDialog.Description>
              Medicine{" "}
              <Text className="" fontFamily="Inter-Bold">
                {medicine.medicineName}
              </Text>{" "}
              {type === "PENDING" ? "is" : "was"} due at{" "}
              <Text className="" fontFamily="Inter-Bold">
                {format(new Date(nextTime(medicine.frequency)), `h:mma`)}.
              </Text>{" "}
              We recommend you to take it now. Have you taken it?
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end" mb={20}>
              <AlertDialog.Cancel asChild>
                <Button
                  className="flex-1 w-1/2"
                  variant="outlined"
                  backgroundColor={COLORS.primary}
                  color="white"
                  onPress={onCancel}
                >
                  No
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  className="flex-1 w-1/2"
                  theme="active"
                  size="$4"
                  backgroundColor={COLORS.primary}
                  color="white"
                  onPress={() => onConfirm(medicine.medicineName)}
                >
                  Yes
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
          <View
            style={{
              backgroundColor: color,
              height: 16,
              width: 300,
              position: "absolute",
              bottom: 0,
            }}
          ></View>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
    // <Modal
    //   animationType="slide"
    //   transparent={true}
    //   visible={visible}
    //   onRequestClose={onCancel}
    // >
    //   <View style={styles.centeredView}>
    //     <View style={styles.modalView}>
    //       <Text style={styles.modalText}>Time to take your medicine:</Text>
    //       <Text style={styles.medicineName}>{medicine.medicineName}</Text>
    //       {/* <Text>Next Time: {medicine.nextTime}</Text> */}
    //       <Text>
    //         Duration: {medicine.frequency.freq} {medicine.frequency.repeatMode}
    //       </Text>

    //       <View style={styles.buttonContainer}>
    //         <Button
    //           title="YES"
    //           onPress={() => onConfirm(medicine.medicineName)}
    //         />
    //         <Button title="NO" onPress={onCancel} />
    //       </View>
    //     </View>
    //   </View>
    // </Modal>
  );
};
