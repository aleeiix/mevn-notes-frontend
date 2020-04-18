<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input
        type="email"
        placeholder="Email"
        class="form-control my-2"
        v-model="user.email"
      />
      <input
        type="password"
        placeholder="Password"
        class="form-control my-2"
        v-model="user.password"
      />
      <b-button class="btn-block" type="submit" variant="success"
        >To access</b-button
      >
    </form>
    <div v-if="message" class="mt-2">
      <small class="text-danger">{{ message }}</small>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      message: null,
    };
  },
  methods: {
    ...mapActions(["saveUser"]),
    login() {
      this.axios
        .post("/login", this.user)
        .then((result) => {
          const token = result.data.token;
          this.message = null;
          this.saveUser(token);
        })
        .catch((err) => {
          this.message = err.response.data.message;
        });
    },
  },
};
</script>

<style scoped></style>
