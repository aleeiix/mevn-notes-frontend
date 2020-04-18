<template>
  <div class="container">
    <h1>Notes</h1>

    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="message.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
      >{{ message.text }}</b-alert
    >

    <form @submit.prevent="addNote()" v-if="!editMode">
      <h3>Add a new note</h3>
      <input
        type="text"
        class="form-control my-2"
        placeholder="Name"
        v-model="newNote.name"
      />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Description"
        v-model="newNote.description"
      />
      <b-button class="btn-success btn-block mt-2 mb-4" type="submit"
        >Add</b-button
      >
    </form>

    <form @submit.prevent="updateNote()" v-if="editMode">
      <h3>Edit a note</h3>
      <input
        type="text"
        class="form-control my-2"
        placeholder="Name"
        v-model="editNote.name"
      />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Description"
        v-model="editNote.description"
      />
      <b-button class="btn-warning btn-block mt-2 mb-2" type="submit"
        >Edit</b-button
      >
      <b-button
        class="btn-default btn-block mt-2 mb-4"
        @click="cancelEditMode()"
        >Cancel</b-button
      >
    </form>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(note, index) in notes" :key="index">
          <th scope="row">{{ note._id }}</th>
          <td>{{ note.name }}</td>
          <td>{{ note.description }}</td>
          <td>
            <b-button
              class="btn-sm btn-warning mr-2"
              @click="activeEditMode(note._id)"
              >Edit</b-button
            >
            <b-button class="btn-sm btn-danger" @click="deleteNote(note._id)"
              >Delete</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Notes",
  data() {
    return {
      notes: [],
      newNote: {
        name: "",
        description: "",
      },
      editNote: {
        _id: "",
        name: "",
        description: "",
      },
      message: {
        text: "",
        color: "",
      },
      editMode: false,
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  computed: {
    ...mapGetters(["token"]),
  },
  created() {
    this.getNotes();
  },
  methods: {
    getConfigAxios() {
      const config = {
        headers: {
          Authorization: this.token,
        },
      };
      return config;
    },
    getNotes() {
      this.axios
        .get("/note", this.getConfigAxios())
        .then((res) => {
          this.notes = res.data;
        })
        .catch((err) => {
          console.error(err.response);
          this.createAlertAndShow("Error", "danger");
        });
    },
    addNote() {
      this.axios
        .post("/note", this.newNote, this.getConfigAxios())
        .then((res) => {
          this.notes.push(res.data);
          this.newNote = {
            name: "",
            description: "",
          };
          this.createAlertAndShow("Added note", "success");
        })
        .catch((err) => {
          console.error(err.response);
          if (err.response.data.error.errors.name.message) {
            this.createAlertAndShow(
              err.response.data.error.errors.name.message,
              "danger"
            );
          } else {
            this.createAlertAndShow("Internal error", "danger");
          }
        });
    },
    deleteNote(id) {
      this.axios
        .delete(`/note/${id}`, this.getConfigAxios())
        .then((res) => {
          this.notes = this.notes.filter((note) => note._id !== res.data._id);

          this.createAlertAndShow("Note removed", "success");
        })
        .catch((err) => {
          console.error(err.response);
          if (err.response.data.message) {
            this.createAlertAndShow(err.response.data.message, "danger");
          } else {
            this.createAlertAndShow("Internal error", "danger");
          }
        });
    },
    activeEditMode(id) {
      this.editMode = true;
      this.axios
        .get(`/note/${id}`)
        .then((res) => {
          this.editNote = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    cancelEditMode() {
      this.editMode = false;
      this.editNote = {
        _id: "",
        name: "",
        description: "",
      };
    },
    updateNote() {
      this.axios
        .put(`/note/${this.editNote._id}`, this.editNote, this.getConfigAxios())
        .then((res) => {
          this.notes = this.notes.map((note) => {
            if (note._id === res.data._id) {
              return res.data;
            }
            return note;
          });
          this.cancelEditMode();
          this.createAlertAndShow("Note edited", "success");
        })
        .catch((err) => {
          console.error(err);
          if (err.response.data.message) {
            this.createAlertAndShow(err.response.data.message, "danger");
          } else {
            this.createAlertAndShow("Internal error", "danger");
          }
        });
    },
    createAlertAndShow(text, color) {
      this.message.text = text;
      this.message.color = color;
      this.showAlert();
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
  },
};
</script>

<style></style>
