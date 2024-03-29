import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

import { API_getRooms, API_joinRoom } from "@api";
import { useStoreUser } from "@stores";
import {
  useModal,
  useUsers,
  useSocket,
  useLocale,
  useMyRouter,
} from "@composable";

import {
  rooms_subscribeRoomsUpdate,
  rooms_unSubscribeRoomsUpdate,
  rooms_roomInListCreated,
  rooms_roomInListDeleted,
  rooms_roomInListUpdated,
} from "@constants";
import { LS_typeOfRoom } from "@helpers";

export function useRoomLogic() {
  const { myUser } = useUsers();
  const { onSocketInit, socketEmit } = useSocket();
  const { openModal } = useModal();
  const { t } = useLocale();
  const { routerPush } = useMyRouter();
  const { setAdminRoom, setJoinedRoom } = useStoreUser();

  const filterData = reactive({
    roomName: "",
    typeOfRoom: ["PUBLIC"],
  });
  const rooms = ref([]);

  onMounted(async () => {
    const typeOfRoom = LS_typeOfRoom.value;
    if (typeOfRoom) filterData.typeOfRoom = typeOfRoom.split(",");

    await fetchRooms();

    socketEmit(rooms_subscribeRoomsUpdate, { userId: myUser.userId });

    onSocketInit({
      [rooms_roomInListCreated]: roomInListCreated,
      [rooms_roomInListDeleted]: roomInListDeleted,
      [rooms_roomInListUpdated]: roomInListUpdated,
    });
  });

  onBeforeUnmount(() => {
    socketEmit(rooms_unSubscribeRoomsUpdate, { userId: myUser?.userId });
  });

  function roomInListCreated(roomData) {
    if (filterData.typeOfRoom.includes(roomData.typeOfRoom)) {
      rooms.value.push(roomData);
    }
  }

  function roomInListDeleted(roomId) {
    rooms.value.splice(
      rooms.value.findIndex((i) => i.roomId === roomId),
      1
    );
  }

  function roomInListUpdated({ roomId, roomData }) {
    const roomIndex = rooms.value.findIndex((room) => +room.roomId === +roomId);
    rooms.value[roomIndex] = roomData;
  }

  async function createRoomHandler() {
    await openModal("CreateRoom")
      .then((data) => {
        setAdminRoom(data.roomId);
        setJoinedRoom(data.roomId);
        routerPush({ name: "RoomId", params: { id: data.roomId } });
      })
      .catch(() => {});
  }

  async function fetchRooms() {
    LS_typeOfRoom.value = filterData.typeOfRoom;
    API_getRooms(filterData).then((data) => (rooms.value = data));
  }

  async function joinRoom(roomData) {
    let { typeOfRoom, roomName, roomId } = roomData;

    if (typeOfRoom === "PRIVATE") {
      return await openModal("EnterPassword", {
        title: "To enter room you need to input its password",
        submit: "enter",
        cancel: "cancel",
        roomId,
      }).catch(() => {});
    }
    await openModal("Promt", {
      title: `${t("modals.enterRoom")} ${roomName} ?`,
      submit: t("buttons.join"),
      cancel: t("buttons.cancel"),
    })
      .then(() => API_joinRoom(roomId))
      .then((data) => {
        setAdminRoom(data.roomJoinedId);
        routerPush({ name: "RoomId", params: { id: data.roomJoinedId } });
      })
      .catch(() => {});
  }

  return {
    rooms,
    filterData,

    createRoomHandler,
    joinRoom,
    fetchRooms,
  };
}
