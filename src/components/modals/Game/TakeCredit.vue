<template>
  <v-dialog
    persistent
    class="p-2"
    :value="!!component"
    width="500"
    @click:outside.prevent.stop="close()"
  >
    <v-card class="TakeCredit">
      <v-form ref="takeCredit" v-model="valid">
        <v-tabs v-model="tabIndex" center-active>
          <v-tab v-for="tabName in tabs" :key="tabName">
            {{ tabName }} month
          </v-tab>
        </v-tabs>

        <v-card-title class="pb-4 flex flex-column">
          <div class="text-body-1">Credit rate:</div>
          <div>{{ selectedCredit.percent }} % yearly</div>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model.number="cashCount"
            :label="$t('forms.labels.enterOldPassword')"
            :rules="rules.cashCount"
            outlined
            dense
            type="number"
          />
          <v-simple-table dense>
            <template v-slot:default>
              <thead></thead>
              <tbody>
                <tr>
                  <td>Duration</td>
                  <td>{{ selectedCredit.duration }} month</td>
                </tr>
                <tr>
                  <td>Income per month</td>
                  <td>{{ payPerMonth }} $</td>
                </tr>
                <tr>
                  <td>Total income</td>
                  <td>{{ payTotal }} $</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-card-actions class="px-5 pt-0 pb-5">
          <v-btn
            color="green"
            @click="takeCredit"
            block
            :loading="loading"
            :disabled="!valid || selectedCredit.disabled"
          >
            Take credit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import modal from "@/mixins/modal";
import { $mChain } from "@/utils/mathjs";

export default {
  name: "TakeCredit",
  mixins: [modal],

  created() {
    let duration = this.data.duration;
    this.tabIndex = this.tabs.findIndex(i => i === duration);
  },

  computed: {
    tabs() {
      return this.$gameCredits.credits.map(i => i.duration);
    },
    selectedCredit() {
      return this.$gameCredits.credits[this.tabIndex];
    },
    payPerMonth() {
      let { percent } = this.selectedCredit;
      let monthPercent = $mChain(percent)
        .divide(12)
        .done();
      return $mChain(this.cashCount)
        .percent(monthPercent)
        .subtract(this.cashCount)
        .round(2)
        .done();
    },
    payTotal() {
      let { duration } = this.selectedCredit;
      return $mChain(this.payPerMonth)
        .multiply(duration)
        .round(2)
        .done();
    }
  },

  data() {
    return {
      valid: false,

      tabIndex: 0,

      cashCount: 1000,
      rules: {
        cashCount: [
          v => !!v || "Can't be empty",
          v => typeof v === "number" || "Must be number",
          v => v > 0 || "Must be positive value",
          () => this.$gameUserCash >= this.cashCount || "Not enough cash"
        ]
      }
    };
  },

  methods: {
    takeCredit() {
      if (!this.$refs.takeCredit.validate()) return;
      this.loading = true;

      let data = {
        cashCount: this.cashCount,
        credit: this.selectedCredit
      };

      this.$gameAction("gamesCredits", "take", data)
        .then(res => {
          this.$gameUserData = res;
        })
        .finally(() => {
          this.loading = false;
          // this.close();
        });
    }
  }
};
</script>