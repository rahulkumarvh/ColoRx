import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { COLORS } from "../../constants/colors";
import {
  deleteFamily,
  deleteMedicine,
  setName,
} from "../../redux/reducers/userReducer";

function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const { name, family, colorBlindness, medicines } = useSelector(
    (state) => state.userReducer,
  );
  // const [name, setName] = useState("John Doe");
  const [familyMembers, setFamilyMembers] = useState(["Jane Doe", "Max Doe"]);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleColorBlindness = () => {
    if (isEditing) {
      navigation.navigate("AccessQuestion");
    }
  };
  // Functions for editing and removing family members and medicines
  // (Add your implementation here)

  useEffect(() => {
    return () => {
      setIsEditing(false);
    };
  }, []);

  return (
    <ScrollView>
      <YStack space="$4" padding="$4" backgroundColor={COLORS.background}>
        <YStack space="$2">
          <Text variant="h1">Profile</Text>
          <Input
            placeholder="Name"
            value={name}
            editable={isEditing}
            onChange={(e) => dispatch(setName(e.nativeEvent.text))}
          />
        </YStack>

        <YStack space="$2">
          <Text>Color Blindness Status</Text>
          <Card
            padding="$3"
            onPress={toggleColorBlindness}
            backgroundColor={isEditing ? COLORS.primary : COLORS.gray}
          >
            <Text color={isEditing ? "#FFFFFF" : "#000000"}>
              {colorBlindness === "DEFAULT" ? "No" : colorBlindness}
            </Text>
          </Card>
        </YStack>

        {/* Family Members section */}
        <YStack space="$2">
          <Text>Family Members</Text>
          {family.length > 0 ? (
            family.map((member, index) => (
              <Card
                key={`member-${index}`}
                padding="$4"
                margin="$2"
                className="flex-row justify-between items-center"
              >
                <View>
                  <Text className="mb-1">Name: {member.name}</Text>
                  <Text className="">Relation: {member.relation}</Text>
                </View>
                {isEditing && (
                  <XStack space="$2">
                    <Button
                      onPress={() => {
                        dispatch(deleteFamily(member.id));
                        /* handleRemoveFamilyMember logic here */
                      }}
                      size="$3"
                      title="Remove Family Member"
                      backgroundColor={COLORS.primary}
                      color="#FFFFFF" // Set text color to white for primary buttons when editing
                    >
                      Remove
                    </Button>
                  </XStack>
                )}
              </Card>
            ))
          ) : isEditing ? (
            <></>
          ) : (
            <Text className="opacity-50">No family members added.</Text>
          )}
          {isEditing && (
            <Button
              size="$3"
              onPress={() => {
                navigation.navigate("FamilyScreen");
              }}
              title="Remove Medicine"
              variant="outlined"
              borderColor={COLORS.primary}
              color={COLORS.primary} // Set text color to white for primary buttons when editing
            >
              + Add Family Member
            </Button>
          )}
        </YStack>

        {/* Medicines section */}
        <YStack space="$2">
          <Text>Medicines</Text>
          {medicines.length > 0 ? (
            medicines.map((med, index) => (
              <Card
                key={`med-${index}`}
                padding="$3"
                className="flex-row justify-between items-center"
              >
                <View>
                  <Text className="">Name: {med.medicineName}</Text>
                  <Text className="">Dosage: {med.dosage}</Text>
                </View>
                {isEditing && (
                  <XStack space="$2">
                    <Button
                      onPress={() => {
                        dispatch(deleteMedicine(med.id));
                      }}
                      size="$3"
                      title="Remove Medicine"
                      backgroundColor={COLORS.primary}
                      color="#FFFFFF" // Set text color to white for primary buttons when editing
                    >
                      Remove
                    </Button>
                  </XStack>
                )}
              </Card>
            ))
          ) : (
            <Text className="opacity-50">No medicines added.</Text>
          )}
          {isEditing && (
            <Button
              size="$3"
              onPress={() => {
                navigation.navigate("AddMedicineScreen");
              }}
              variant="outlined"
              borderColor={COLORS.primary}
              title="Remove Medicine"
              // backgroundColor={COLORS.primary}
              color={COLORS.primary} // Set text color to white for primary buttons when editing
            >
              + Add Medicine
            </Button>
          )}
        </YStack>

        <Button onPress={handleEdit} backgroundColor={COLORS.primary} size="$3">
          <Text color="white">{isEditing ? "Close" : "Edit Profile"}</Text>
        </Button>
      </YStack>
    </ScrollView>
  );
}

export default ProfileScreen;
