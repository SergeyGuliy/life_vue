import { defineStore } from "pinia";

export const useStoreFriends = defineStore("friends", {
  state: () => ({
    friends: [],
    connects: [],
  }),
  actions: {
    setFriends(friends) {
      this.friends = friends;
    },
    setConnections(connects) {
      this.connects = connects;
    },
    addFriend(friend) {
      this.friends.push(friend);
    },
    deleteConnection(indexToDelete) {
      this.connects = this.connects.filter((_, id) => id !== indexToDelete);
    },
    updateConnection({ indexToUpdate, data }) {
      this.connects[indexToUpdate] = data;
    },
    deleteFriend(indexToDelete) {
      this.friends = this.friends.filter((_, id) => id !== indexToDelete);
    },
  },
});
