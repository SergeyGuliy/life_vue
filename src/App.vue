<template>
  <v-app class="sssssssss">
    <component :is="layout">
      <router-view />
    </component>
    <ModalWrapper />
    <notifications position="top right" />
  </v-app>
</template>

<script>
import mainLayout from "@layouts/mainLayout.vue";
import authLayout from "@layouts/authLayout.vue";
import ModalWrapper from "@components/layouts/ModalWrapper.vue";

import {
  socketSetup_callUserIdToServer,
  socketSetup_forceDisconnect,
  socketSetup_giveUserIdToServer,
} from "@constants";
import { useAuth, useUsers, useBus, useSocket } from "@composable";
import { ref } from "vue";

const { busEmit } = useBus();
const { onSocketInit, socketEmit } = useSocket();

export default {
  name: "App",

  setup() {
    const { logOut, refreshToken } = useAuth();
    const { myUser } = useUsers();

    return { myUser, logOut, refreshToken };
  },

  components: {
    mainLayout,
    authLayout,
    ModalWrapper,
    // Notifications,
  },
  computed: {
    layout() {
      return this.$route?.meta?.layout;
    },
  },

  async created() {
    onSocketInit({
      [socketSetup_callUserIdToServer]: this.callUserIdToServer,

      [socketSetup_forceDisconnect]: this.forceDisconnect,
    });
  },

  methods: {
    callUserIdToServer(clientId) {
      if (this.myUser?.userId) {
        socketEmit(socketSetup_giveUserIdToServer, {
          userId: this.myUser.userId,
          clientId,
        });
      }
    },
    async forceDisconnect() {
      if (this.$route.meta.layout === "mainLayout") {
        await this.logOut("Closer");
      }
    },

    initClickObservers() {
      const body = document.querySelector("body");
      body.addEventListener("click", this.clickOutside);
      body.addEventListener("contextmenu", this.clickOutsideContext);
    },
    clickOutside() {
      busEmit("clickOutside");
    },
    // eslint-disable-next-line no-unused-vars
    clickOutsideContext(e) {
      // TODO add prevent default on prod
      // e.preventDefault();
      busEmit("clickOutside");
    },
  },
};
</script>

<style lang="scss">
@import "assets/styles/main";
.my-wrapper {
  height: 100%;
}
</style>
