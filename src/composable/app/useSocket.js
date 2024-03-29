import { onUnmounted, ref, watch } from "vue";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
  autoConnect: false,
});

const socketConnected = ref(socket.connected);
socket.on("connect", () => (socketConnected.value = true));
socket.on("disconnect", () => (socketConnected.value = false));

export function useSocket() {
  const socketConnect = socket.connect.bind(socket);
  const socketDisconnect = socket.close.bind(socket);
  const socketEmit = (method, payload) => socket.emit(method, payload);
  const socketOn = socket.on.bind(socket);
  const socketOff = socket.off.bind(socket);

  function onSocketInitInner(socketObject) {
    const socketEntries = Object.entries(socketObject);

    socketEntries.forEach(([socketKey, socketCallback]) => {
      socketOn(socketKey, socketCallback);

      onUnmounted(() => {
        socketOff(socketKey, socketCallback);
      });

      watch(socketConnected, (val) => {
        if (val) return;
        socketOff(socketKey, socketCallback);
      });
    });
  }

  function onSocketInit(socketObject) {
    const wrappedCallback = () => {
      if (!socketConnected.value) return;
      onSocketInitInner(socketObject);
    };

    wrappedCallback();
    watch(socketConnected, wrappedCallback);
  }

  return {
    socket,

    socketConnected,

    socketConnect,
    socketDisconnect,
    socketEmit,
    socketOn,
    socketOff,

    onSocketInit,
  };
}
