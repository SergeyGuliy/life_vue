import { api } from "@api";
import { setLocalStorageKeys } from "../../utils/localStorageKeys";

import { $currentUserActions } from "@composable/$currentUserActions";
const { changeTheme, changeLocale, socketConnect } = $currentUserActions();

export default {
  namespaced: true,
  state: {
    user: null,
    gameId: null
  },
  mutations: {
    setUser(state, { userData, accessToken, refreshToken }) {
      setLocalStorageKeys({ accessToken, refreshToken, userData });
      state.user = { ...userData };
    },
    setGameId(state, gameId) {
      state.gameId = gameId;
    },
    cleanUser(state) {
      state.user = null;
    },
    adminRoom(state, roomId) {
      state.user.roomCreatedId = roomId;
    },
    joinRoom(state, roomId) {
      state.user.roomJoinedId = roomId;
    },
    leaveRoom(state) {
      state.user.roomJoinedId = null;
    },
    setProfileSettings(state, settings) {
      state.user = {
        ...state.user,
        ...settings
      };
    },
    setUserSettings(state, settings) {
      state.user.userSettings = {
        ...state.user.userSettings,
        ...settings
      };
    },
    setRoomId(state, roomId) {
      state.user.roomCreatedId = roomId;
    }
  },
  actions: {
    async setUserData({ commit }, data) {
      try {
        const { locale, isDarkTheme } = data.userData.userSettings;
        changeTheme(isDarkTheme);
        changeLocale(locale);
        socketConnect();
        commit("setUser", data);
      } catch (e) {
        console.log(e);
      }
    },
    async updateUserSettings({ commit }, { profileSettings, userSettings }) {
      if (profileSettings) {
        commit("setProfileSettings", profileSettings);
      }
      if (userSettings) {
        commit("setUserSettings", userSettings);
      }
    },
    async leaveRoom({ commit }) {
      let { roomJoinedId } = await api.rooms.leaveRoom();
      if (!roomJoinedId) {
        commit("leaveRoom");
      }
    }
  }
};
