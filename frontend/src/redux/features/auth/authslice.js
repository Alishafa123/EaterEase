import { createSlice } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  },
  restaurant: {
    name: "",
    
    _id: "",
  },
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
    },
    SET_RESTAURANT(state, action) {
    
      const {name,_id} = action.payload;
      state.restaurant = {name,_id} ;

    },

    SET_ADMIN_NAME(state, action) {
      state.restaurant.adminName = action.payload;
    },
    
  },
});

export const {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
  SET_RESTAURANT,
  SET_RESTAURANT_ID,
  SET_ADMIN_NAME,
} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;
export const selectRestaurant = (state) => state.auth.restaurant;
export const updateRestaurant = (state) => state.auth.restaurant;
export const selectRestaurantId = (state) => state.auth.restaurantId;
export const selectAdminName = (state) => state.auth.restaurant.adminName;

export default authSlice.reducer;
