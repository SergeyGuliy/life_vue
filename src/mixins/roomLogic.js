import { api } from "../assets/helpers/api";

export default {
  data() {
    return {
      filterData: {
        roomName: "",
        typeOfRoom: ["PUBLIC"]
      },
      rooms: []
    };
  },
  sockets: {
    roomInListCreated(roomData) {
      if (this.filterData.typeOfRoom.includes(roomData.typeOfRoom)) {
        this.rooms.push(roomData);
      }
    },
    roomInListDeleted(roomId) {
      this.rooms.splice(
        this.rooms.findIndex(i => i.roomId === roomId),
        1
      );
    },
    roomInListUpdated({ roomId, roomData }) {
      const roomIndex = this.rooms.findIndex(room => +room.roomId === +roomId);
      this.$set(this.rooms, roomIndex, roomData);
    }
  },
  async created() {
    const typeOfRoom = localStorage.getItem("typeOfRoom");
    if (typeOfRoom) {
      this.$set(this.filterData, "typeOfRoom", typeOfRoom.split(","));
    }
    await this.fetchRooms();
    this.$socket.emit("subscribeRoomsUpdate", {
      userId: this.$user.userId
    });
  },
  beforeDestroy() {
    this.$socket.emit("unSubscribeRoomsUpdate", {
      userId: this.$user?.userId
    });
  },
  methods: {
    async createRoomHandler() {
      await this.$openModal("CreateRoom")
        .then(data => {
          this.$store.commit("user/joinRoom", data.roomId);
          this.$router.push({ name: "RoomId", params: { id: data.roomId } });
        })
        .catch(() => {});
    },
    async fetchRooms() {
      localStorage.setItem("typeOfRoom", this.filterData.typeOfRoom);
      this.rooms = (await api.rooms.getRooms(this.filterData)).data;
    },

    async joinRoom(roomData) {
      let { typeOfRoom, roomName, roomId } = roomData;
      if (typeOfRoom === "PRIVATE") {
        await this.$openModal("EnterPassword", {
          title: "To enter room you need to input its password",
          submit: "enter",
          cancel: "cancel",
          roomId
        }).catch(() => {});
      } else {
        await this.$openModal("Promt", {
          title: `${this.$t("modals.enterRoom")} ${roomName} ?`,
          submit: this.$t("buttons.join"),
          cancel: this.$t("buttons.cancel")
        })
          .then(() =>
            api.rooms.joinRoom(roomId).then(({ data }) => {
              this.$store.commit("user/joinRoom", data.roomJoinedId);
              this.$router.push({
                name: "RoomId",
                params: { id: data.roomJoinedId }
              });
            })
          )
          .catch(() => {});
      }
    }
  }
};