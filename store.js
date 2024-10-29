import { configureStore, createSlice } from '@reduxjs/toolkit';

// Création du slice pour les chaînes de caractères
const stringSlice = createSlice({
  name: 'string',
  initialState: { value: 'false' },
  reducers: {
    setString: (state, action) => {
      state.value = action.payload; // Met à jour la chaîne avec la nouvelle valeur
    },
  },
});
// Création du slice pour les chaînes de caractères
const notificationMessage = createSlice({
  name: 'notification',
  initialState: { value: '' },
  reducers: {
    setNotification: (state, action) => {
      state.value = action.payload; // Met à jour la chaîne avec la nouvelle valeur
    },
  },
});

// Création du slice pour les booléens
const booleanSlice = createSlice({
  name: 'boolean',
  initialState: { value: false },
  reducers: {
    toggleBoolean: (state, action) => {
      state.value = action.payload; // Bascule la valeur booléenne
    },
  },
});

// Exporte les actions générées
export const { setString } = stringSlice.actions;
export const { toggleBoolean } = booleanSlice.actions;
export const { setNotification } = notificationMessage.actions;

// Configure le store en combinant les deux slices (string et boolean)
const store = configureStore({
  reducer: {
    string: stringSlice.reducer,
    notification: notificationMessage.reducer,

    boolean: booleanSlice.reducer,
  },
});

export default store;
