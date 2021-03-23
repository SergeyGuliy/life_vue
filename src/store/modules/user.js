import { api } from "../../assets/helpers/api";

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    isLoggedIn: state => !!state.user
  },
  mutations: {
    setUser(state, { userData, accessToken, refreshToken }) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userData.userId);
      state.user = { ...userData };
    },

    cleanUser(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      state.user = null;
    },
    joinRoom(state, roomId) {
      state.user.roomJoinedId = roomId;
    },
    leaveRoom(state) {
      state.user.roomJoinedId = null;
    }
  },
  actions: {
    async setUserData({ commit }, data) {
      try {
        commit("setUser", data);
        // await dispatch("webSocket/socketConnect", "", { root: true });
      } catch (e) {
        console.log(`Error in store action 'setUserData': ${e}`);
        throw e;
      }
    },
    async leaveRoom({ commit }) {
      let { status } = await api.rooms.leaveRoom();
      if (status === 200) {
        commit("leaveRoom");
      }
    },

    setUser({ commit }, data) {
      commit("setUser", data);
    }
  }
};
