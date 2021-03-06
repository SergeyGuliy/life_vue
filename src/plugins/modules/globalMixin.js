import Vue from "vue";

Vue.mixin({
  computed: {
    $user() {
      return this.$store.state.user?.user;
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
    }
  }
});
