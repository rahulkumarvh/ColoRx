import React, { useState } from "react";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Sheet, Text } from "tamagui";

import Logo from "../../components/Logo/Logo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { COLORS } from "../../constants/colors";
import { addFamily, setIsSetupDone } from "../../redux/reducers/userReducer";
//import { Select, Check, ChevronDown } from '@tamagui/lucide-icons';

//card
const FamilyMemberCard = ({ member }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{member.name}</Text>
    <Text>Relation: {member.relation}</Text>
    <Text>Phone: {member.phone}</Text>
  </View>
);

// const relationItems = [
//   { name: "Parent" },
//   { name: "Child" },
//   { name: "Sibling" },
//   { name: "Other" },
// ];

//display family members
const FamilyScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { family } = useSelector((state) => state.userReducer);
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "",
    phone: "",
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.relation && newMember.phone) {
      dispatch(addFamily({ ...newMember, id: Date.now() }));
      setNewMember({ name: "", relation: "", phone: "" });
      setSheetVisible(false);
      Keyboard.dismiss();
    } else {
      //error handling
    }
  };

  const renderMemberItem = ({ item }) => <FamilyMemberCard member={item} />;

  return (
    <View>
      <View className="mt-2">
        <ProgressBar value={4 / 5} />
      </View>
      <View className="px-4">
        <View className="mb-10 mt-10">
          <Logo />
        </View>
        <View style={styles.container}>
          <FlatList
            data={family}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              <View className="mb-4">
                <Text style={styles.header}>Family Members</Text>
                <Text className="text-center" fontFamily="Inter-Regular">
                  Invite family members to track your medication schedule. Just
                  enter their details, and we'll keep them informed!
                </Text>
              </View>
            }
            ListEmptyComponent={
              <Text style={styles.noMembersText}>No family members added.</Text>
            }
          />
          <Sheet
            modal
            open={isSheetVisible}
            snapPointsMode="fit"
            native
            zIndex={100_000}
            disableDrag
            dismissOnOverlayPress={false}
            dismissOnSnapToBottom={false}
            moveOnKeyboardChange
            animationConfig={{
              type: "timing",
              damping: 40,
              duration: 400,
              mass: 2,
              stiffness: 150,
            }}
          >
            <Sheet.Overlay />

            <Sheet.Frame
              borderRadius="$8"
              padding="$4"
              paddingTop="$6"
              justifyContent="center"
              alignItems="center"
              space="$5"
            >
              <Input
                value={newMember.name}
                onChangeText={(text) =>
                  setNewMember({ ...newMember, name: text })
                }
                placeholder="Name"
                size="$4"
                width="100%"
                style={styles.input}
              />
              <Input
                value={newMember.relation}
                onChangeText={(text) =>
                  setNewMember({ ...newMember, relation: text })
                }
                width="100%"
                placeholder="Relation"
                size="$4"
                style={styles.input}
              />
              <Input
                value={newMember.phone}
                onChangeText={(text) =>
                  setNewMember({ ...newMember, phone: text })
                }
                placeholder="Phone Number"
                size="$4"
                width="100%"
                keyboardType="phone-pad"
                style={styles.input}
                maxLength={10}
              />
              <View style={styles.buttonContainer}>
                <Button
                  size="$4"
                  style={[styles.button, { flex: 1 }]}
                  onPress={handleAddMember}
                  fontFamily="Inter-Regular"
                  color="white"
                >
                  Add Member
                </Button>

                <Button
                  size="$4"
                  style={[styles.button, { flex: 1 }]}
                  onPress={() => setSheetVisible(false)}
                  fontFamily="Inter-Regular"
                  color="white"
                  width="100%"
                >
                  Close
                </Button>
              </View>
            </Sheet.Frame>
          </Sheet>

          <View className="mt-20">
            <Button
              onPress={() => setSheetVisible(true)}
              size="$4"
              // style={styles.button}
              fontFamily="Inter-Regular"
              color={COLORS.primary}
              variant="outlined"
            >
              + Add Family Member
            </Button>

            <Button
              onPress={() => {
                // setSheetVisible(true);
                dispatch(setIsSetupDone(true));
                navigation.navigate("Dashboard");
              }}
              size="$4"
              style={styles.button}
              fontFamily="Inter-Regular"
              color="white"
            >
              Next
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    color: "#009e73",
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#009e73",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    // flex: 1,
  },
  noMembersText: {
    textAlign: "center",
    marginVertical: 20,
    color: "gray",
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default FamilyScreen;
