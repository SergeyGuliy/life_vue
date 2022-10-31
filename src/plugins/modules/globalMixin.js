import Vue from "vue";

Vue.mixin({
  computed: {
    $user() {
      return this.$store.state.user?.user;
    },
    $gameId: {
      get() {
        return this.$store.state.user?.gameId;
      },
      set(val) {
        this.$store.commit("user/setGameId", val);
      }
    },
    $users() {
      return this.$store.state.dictionaries?.users;
    },
    $chats() {
      return this.$store.state.chats?.chats;
    },
    $chatTabs() {
      return Object.keys(this.$chats);
    },
    $friendsRequests() {
      return this.$store.state.friends?.friends;
    },
    $friends() {
      return this.$friendsRequests.map(i => {
        const { friendshipReceiver, friendshipSender } = i;
        return +friendshipReceiver.userId === +this.$user.userId
          ? friendshipSender
          : friendshipReceiver;
      });
    },
    $connects() {
      return this.$store.state.friends?.connects;
    }
  },
  created() {
    const $initSocketListener = this?.$options?.$initSocketListener;
    if ($initSocketListener) {
      const wrappedCallback = () => {
        if (!this.$socket?.connected) return;
        $initSocketListener.call(this);
      };
      wrappedCallback();
      this.$watch("$socket.connected", wrappedCallback);
    }
  },

  methods: {
    $openModal(modalName, data = {}) {
      this.$store.dispatch("modals/setModal", {
        component: modalName,
        data: data
      });

      return new Promise(function(resolve, reject) {
        let callback = data => {
          if (data.detail !== null) {
            resolve(data.detail);
          } else {
            reject();
          }
          window.removeEventListener("modalClose", callback);
        };
        window.addEventListener("modalClose", callback);
      });
    },

    $noti() {
      function error(message) {
        this.$notify({
          group: "foo",
          type: "error",
          title: message
        });
      }

      function warning(message) {
        this.$notify({
          group: "foo",
          type: "warn",
          title: message
        });
      }

      function success(message) {
        this.$notify({
          group: "foo",
          type: "success",
          title: message
        });
      }

      function info(message) {
        this.$notify({
          group: "foo",
          type: "info",
          title: message
        });
      }
      return {
        error,
        warning,
        success,
        info
      };
    },

    $socketInit(socketObject) {
      const socketEntries = Object.entries(socketObject);

      socketEntries.forEach(([socketKey, socketCallback]) => {
        this.$socket.client.on(socketKey, socketCallback);

        this.$on("hook:beforeDestroy", () => {
          this.$socket.client.off(socketKey, socketCallback);
        });
        this.$watch("$socket.connected", val => {
          if (val) return;

          this.$socket.client.off(socketKey, socketCallback);
          this.$socket.client.off(socketKey, socketCallback);
        });
      });
    },

    $busInit(busObject) {
      const busEntries = Object.entries(busObject);

      busEntries.forEach(([busKey, busCallback]) => {
        this.$bus.on(busKey, busCallback);

        this.$on("hook:beforeDestroy", () => {
          this.$bus.off(busKey, busCallback);
        });
      });
    },

    $eventListenersInit(eventListenersObject) {
      const eventListenersEntries = Object.entries(eventListenersObject);

      eventListenersEntries.forEach(
        ([eventListenerKey, [eventListenerCallback, target]]) => {
          target.addEventListener(eventListenerKey, eventListenerCallback);

          this.$on("hook:beforeDestroy", () => {
            target.removeEventListener(eventListenerKey, eventListenerCallback);
          });
        }
      );
    }
  }
});
