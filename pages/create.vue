<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Create a Giveaway
      </h1>

      <ul>
        <li v-for="warning in warnings" :key="warning">
          <span class='text-danger'>{{ warning }}</span>
        </li>
      </ul>

      <label for="title">
        Title <span class='required'>*</span>
        <input v-model="data.title" type="text" name="title">
      </label>

      <label for="description">
        Description
        <textarea v-model="data.description" name="description"></textarea>
      </label>

      <label for="password">
        Password <span class='required'>*</span>
        <input v-model="data.password" type="text" name="password">
      </label>
      
      <label for="endDate">
        End Date <span class='required'>*</span>
        <input v-model="date" type="text" name="endDate">
        <span class='text-danger'>{{ dateWarning }}</span>
        <span>{{ dateText }}</span>
      </label>

      <dropdown title-disabled="Show Webhook Options" title-enabled="Hide Webhook Options">
        <label for="webhook">
          Webhook URL
          <input v-model="data.webhook.url" type="text" name="webhook">
        </label>

        <h2>announce giveaway</h2>
        <label class='checkbox-container'>
          Enabled      
          <input v-model="data.webhook.announceGiveaway.enabled" type="checkbox">
          <span class='checkbox'></span>
        </label>
        <label>
          content
          <textarea v-model="data.webhook.announceGiveaway.content">
          </textarea>
        </label>
        <dropdown title="Embed">
          <embed-builder :embed="data.webhook.announceGiveaway.embed"/>
        </dropdown>
        <h2>announce winner</h2>
        <label class='checkbox-container'>
          Enabled      
          <input v-model="data.webhook.announceWinner.enabled" type="checkbox">
          <span class='checkbox'></span>
        </label>
        <label>
          content
          <textarea v-model="data.webhook.announceWinner.content">
          </textarea>
        </label>
        <dropdown title="Embed">
          <embed-builder :embed="data.webhook.announceWinner.embed"/>
        </dropdown>
      </dropdown>
      
      <div v-if="$store.state.user" class='button-bar'>
        <a class='button' @click.prevent="cancel">
          Cancel
        </a>
        <a class='button' @click.prevent="save">
          Save
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import Dropdown from "~/components/Dropdown.vue";
import EmbedBuilder from "~/components/EmbedBuilder.vue";

export default {
  mounted() {
    this.dateText = "Specified Date: " + this.data.endDate.format("LLLL");
  },
  components: { Dropdown, EmbedBuilder },
  computed: {
    date: {
      get() {
        return this.dateString || this.data.endDate.format(this.format);
      },
      set(value) {
        this.dateString = value.toLowerCase();
        let date = window.moment(this.dateString, this.format);
        if (!date.isValid()) {
          this.dateWarning =
            "Invalid date. Use the format: day/month/year hours:minutes am/pm";
          this.dateText = "";
        } else {
          this.dateWarning = "";
          this.dateText = "Specified Date: " + date.format("LLLL");
        }
        this.data.endDate = date;
      }
    }
  },
  data() {
    return {
      warnings: [],
      dateString: "",
      format: "DD/MM/YYYY hh:mm a",
      dateWarning: "",
      dateText: "",
      data: {
        endDate: window.moment(),
        title: "",
        description: "",
        password: "",
        users: [],
        webhook: {
          url: "",
          announceGiveaway: {
            content: "",
            embed: {
              fields: [],
              image: {},
              thumbnail: {},
              author: {},
              footer: {},
              color: 0
            },
            enabled: false
          },
          announceWinner: {
            content: "",
            embed: {
              fields: [],
              image: {},
              thumbnail: {},
              author: {},
              footer: {},
              color: 0
            },
            enabled: false
          }
        }
      }
    };
  },
  methods: {
    cancel() {
      if (confirm("unsaved progress will be lost.")) {
        this.$router.go(-1);
      }
    },
    async save() {
      this.warnings = [];

      let data = this.data;
      if (!data.title) this.warnings.push("A title is required.");
      if (!data.password) this.warnings.push("A password is required.");
      if (!data.endDate.isValid())
        this.warnings.push("A valid end date is required");
      if (
        !data.webhook.url &&
        (data.webhook.announceGiveaway.enabled ||
          data.webhook.announceWinner.enabled)
      )
        this.warnings.push(
          "A webhook URL is required if 'announce giveaway' or 'announce winner' is enabled."
        );

      for (const embed of [
        data.webhook.announceGiveaway.embed,
        data.webhook.announceWinner.embed
      ]) {
        for (const field of embed.fields) {
          if (!(field.value && field.name)) {
            this.warnings.push("All embed fields must have a name and value.");
            break;
          }
        }
      }

      if (this.warnings.length > 0) {
        window.scrollTo(0, 0);
      } else {
        data.timestamp = data.endDate.valueOf();
        let id = await this.$axios.$post("/create_giveaway", {
          data: this.data
        });
        this.$router.push("/giveaway/" + id);
      }
    }
  }
};
</script>


<style scoped>
.checkbox-container {
  margin: 10px 0;
}
.required {
  content: "*";
  color: red;
  display: inline;
}
</style>
