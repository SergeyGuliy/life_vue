<template>
  <v-tab-item value="tab-login">
    <v-card flat class="px-2 py-8">
      <v-form ref="form" v-model="isFormValid" lazy-validation>
        <v-text-field
          v-if="isEmailMode"
          v-model="authData.email"
          :rules="rules.email"
          label="Введите email"
          placeholder="Placeholder"
          outlined
          @click:append="isEmailMode = false"
          append-icon="mdi-cellphone-android"
        />
        <v-text-field
          v-else
          v-mask="'+#(###) ###-####'"
          v-model="authData.phone"
          :rules="rules.phone"
          label="Введите телефон"
          placeholder="Placeholder"
          outlined
          @click:append="isEmailMode = true"
          append-icon="mdi-email"
        />
        <v-text-field
          v-model="authData.password"
          :rules="rules.password"
          label="Введите пароль"
          placeholder="Placeholder"
          outlined
          :type="showPassword ? 'password' : 'text'"
          @click:append="showPassword = !showPassword"
          :append-icon="showPassword ? 'mdi-lock' : 'mdi-lock-open'"
        />
        <v-btn color="primary" block @click="login">
          Войти
        </v-btn>
      </v-form>
    </v-card>
  </v-tab-item>
</template>

<script>
export default {
  name: "TabLogin",
  components: {},
  data() {
    return {
      showPassword: true,
      isFormValid: true,
      isEmailMode: true,
      authData: {
        email: "test.user@gmail.com",
        phone: "test.user@gmail.com",
        password: "23yg43kvgq"
      },
      rules: {
        email: [
          v => !!v || "E-mail is required",
          v => /.+@.+\..+/.test(v) || "E-mail must be valid"
        ],
        password: [v => !!v || "E-mail is required"],
        phone: [
          v =>
            /^[+][0-9]{1}[(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{4}$/.test(v) ||
            "E-mail is required"
        ]
      }
    };
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("auth/logIn", {
            email: this.authData.email,
            password: this.authData.password
          })
          .then(() => {
            this.$vuetify.theme.dark = this.$store.state.user.user.isDarkTheme;
            this.$router.push({ name: "Home" });
          })
          .catch(e => {
            this.$emit("onError", e);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.TabLogin {
}
</style>
