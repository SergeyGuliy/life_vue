<template>
  <div class="GamesCredits" v-if="gameCredits">
    <v-card-subtitle class="py-0">
      Last updated: {{ getDate }}
    </v-card-subtitle>

    <v-simple-table dense fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Duration</th>
            <th class="text-center">Percent</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(credit, index) in gameCredits.credits" :key="index">
            <td width="28%">{{ credit.duration }} month</td>
            <td width="28%" class="text-center">{{ credit.percent }} %</td>
            <td class="text-right">
              <v-btn
                depressed
                color="green"
                class="mr-1"
                x-small
                @click="takeCredit(credit)"
              >
                Take credit
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { useGame, useModal } from "@composable";

const { openModal } = useModal();

export default {
  name: "GamesCredits",
  setup() {
    const { gameCredits } = useGame();
    return { gameCredits };
  },

  computed: {
    getDate() {
      const { monthCode, year } = this.gameCredits.date;
      return `${monthCode} ${year}`;
    },
  },

  methods: {
    takeCredit({ duration }) {
      openModal("Game/TakeCredit", {
        duration,
      }).catch(() => {});
    },
  },
};
</script>
