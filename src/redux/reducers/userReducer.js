import { createSlice } from "@reduxjs/toolkit";
import { nextTime, prevTime } from "../../helpers";

const userSlice = createSlice({
  name: "user",
  initialState: {
    phone: null,
    name: "Rahul",
    medicines: [],
    history: [],
    family: [],
    isSetupDone: false,
    colorBlindness: "DEFAULT",
    familyMedicines: {
      // from firebase
    },
  },
  reducers: {
    setColorBlindness(state, action) {
      state.colorBlindness = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    addFamily(state, action) {
      state.family = [...state.family, action.payload];
    },
    deleteFamily(state, action) {
      state.family = state.family.filter(
        (member) => member.id !== action.payload,
      );
    },
    setIsSetupDone(state, action) {
      state.isSetupDone = action.payload;
    },
    addMedicine(state, action) {
      const medicines = state.medicines || [];
      medicines.push(action.payload);
      state.medicines = medicines;
    },
    deleteMedicine(state, action) {
      state.medicines = state.medicines.filter(
        (medicine) => medicine.id !== action.payload,
      );
    },
    addMedicineHistory(state, action) {
      state.history.push(action.payload);
    },
    updateMedicineStatus(state, action) {
      const { medicineName, status } = action.payload;
      const medicineIndex = state.medicines.findIndex(
        (medicine) => medicine.medicineName === medicineName,
      );
      if (medicineIndex !== -1) {
        state.medicines[medicineIndex].status = status;
      }
    },
    updateMedicineStatusBasedOnTime(state, action) {
      const { medicineName, userResponse } = action.payload;
      const medicineIndex = state.medicines.findIndex(
        (medicine) => medicine.medicineName === medicineName,
      );

      if (medicineIndex !== -1) {
        const medicine = state.medicines[medicineIndex];
        const currentTime = new Date();
        const nextMedicineTime = nextTime(medicine.frequency);
        const prevMedicineTime = prevTime(medicine.frequency);

        if (userResponse === "YES") {
          // If YES, mark as TAKEN for the appropriate time slot
          if (currentTime < nextMedicineTime) {
            medicine.status = "TAKEN";
            medicine.lastTaken = currentTime;
          } else if (currentTime >= prevMedicineTime) {
            medicine.status = "TAKEN";
            medicine.lastTaken = prevMedicineTime;
          }
        } else if (userResponse === "NO") {
          // If NO and time has passed the previous slot, mark as MISSED
          medicine.status = "MISSED";
        }
      }
    },
  },
});

export const {
  setPhone,
  setName,
  addMedicine,
  setIsSetupDone,
  updateMedicineStatusBasedOnTime,
  setColorBlindness,
  updateMedicineStatus,
  addFamily,
  deleteFamily,
  deleteMedicine,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
