<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center maintain-case">
        {{ data.title }}
        <span v-if="data.description" class='subtitle maintain-case'>{{ data.description }}</span>
      </h1>
      
      <p class='center'>Entries: {{data.entries}} ({{data.viableEntries}} viable)</p>

      <div v-if="!complete">
        <label v-if="display">
          Password
          <input v-model="password" type="text">
        </label>
        <p v-if="data.entered" class='center'>You have already entered this giveaway</p>
        <p v-if="successMessage" class='center'>{{successMessage}}</p>
        <p v-if="errorMessage" class='center text-danger'>{{errorMessage}}</p>

        <div class='countdown monospace'>
          <span class='timer'>{{ ftime.d }}</span> :
          <span class='timer'>{{ ftime.h }}</span> :
          <span class='timer'>{{ ftime.m }}</span> :
          <span class='timer'>{{ ftime.s }}</span> 
        </div>

        <div v-if="display" class='button-bar'>
          <a class='button' @click.prevent="enter">Enter</a>
        </div>
      </div>
      <div v-else>
        <h2 class='title center'>Winner:</h2>
        <div v-if="expiredNoWinner">
          <span class='center winner'>nobody entered</span>
        </div>
        <div v-else>
          <img class='winner-avatar' :src="winner.avatarURL">
          <span class='center winner'><strong>{{winner.username}}#{{winner.discriminator}}</strong> ({{winner.id}})</span>
        </div>
      </div>

      <div v-if="$store.state.user.id === owner" class='button-bar'>
        <nuxt-link class='button' :to="'/giveaway/' + id + '/edit'">Edit Giveaway</nuxt-link>
        <a v-if="!expired && !winner" class='button' @click.prevent="announceGiveaway">Announce Giveaway</a>
        <a v-if="winner" class='button' @click.prevent="announceGiveaway">Announce Winner</a>
        <a v-if="!winner && data.viableEntries > 0" class='button' @click.prevent="forceDraw">draw now</a>
        <a v-if="winner && data.viableEntries > 0" class='button' @click.prevent="forceDraw">redraw winner</a>
      </div>

      <div class='flex-row'>
        <nuxt-link class="flex-row-item" to="/">
          Home
        </nuxt-link>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  asyncData({ params, $axios, $router, $store }) {
    return $axios.$get("/giveaway/" + params.id).then(data => {
      return Object.assign(
        { id: params.id, winner: null, noWinner: null },
        data
      );
    });
  },
  data() {
    return {
      password: "",
      duration: null,
      time: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      errorMessage: "",
      successMessage: "",
      interval: null,
      complete: null
    };
  },
  computed: {
    ftime() {
      let days = this.time.days.toString().padStart(2, "0");
      let hours = this.time.hours.toString().padStart(2, "0");
      let minutes = this.time.minutes.toString().padStart(2, "0");
      let seconds = this.time.seconds.toString().padStart(2, "0");

      return { d: days, h: hours, m: minutes, s: seconds };
    },
    display() {
      return (
        !this.successMessage &&
        this.$store.state.user.id !== this.owner &&
        !this.data.entered
      );
    },
    expiredNoWinner() {
      return this.expired && !this.winner && this.data.timestamp < Date.now();
    }
  },
  mounted() {
    if (!this.$store.state.user) {
      localStorage.returnTo = this.$route.fullPath;
      this.$router.push("/login");
    }
    this.duration = window.moment.duration(this.data.timestamp - Date.now());
    if (this.winner) this.complete = true;
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  head() {
    return {};
  },
  methods: {
    async updateTime() {
      this.duration = window.moment.duration(this.data.timestamp - Date.now());
      if (this.duration.asMilliseconds() <= 0) {
        clearInterval(this.interval);
        this.time.days = 0;
        this.time.hours = 0;
        this.time.minutes = 0;
        this.time.seconds = 0;
        if (!this.winner && !this.expired) {
          let interval = setInterval(async () => {
            let event = await this.$axios.$get("/giveaway/" + this.id);
            this.winner = event.winner;
            this.winners = event.winners;
            this.expired = event.expired;
            this.data.entries = event.data.entries;
            this.data.viableEntries = event.data.viableEntries;

            if (this.winner || this.expired) {
              clearInterval(interval);
              this.complete = true;
            }
          }, 1000 * 15);
        } else this.complete = true;

        return;
      }
      this.time.days = this.duration.days();
      this.time.hours = this.duration.hours();
      this.time.minutes = this.duration.minutes();
      this.time.seconds = this.duration.seconds();
    },
    async enter() {
      try {
        let response = await this.$axios.$post(
          "/giveaway/" + this.id + "/enter",
          {
            password: this.password
          }
        );
        if (!response) {
          this.errorMessage = "Incorrect password";
        } else {
          this.errorMessage = "";
          this.successMessage = "You have been entered into the giveaway";
        }
      } catch (err) {
        this.errorMessage = err.response.data;
      }
    },
    async forceDraw() {
      try {
        let data = await this.$axios.$post("/giveaway/" + this.id + "/draw");
        this.winner = data.winner;
        this.winners = data.winners;
        this.data.users = data.users;
        this.data.entries = data.users.length;
        this.data.viableEntries = data.users.length - data.winners.length;
        this.complete = true;
      } catch (err) {
        console.error(err);
        console.error(err.response);
      }
    },
    async announceGiveaway() {
      try {
        await this.$axios.$post("/giveaway/" + this.id + "/announce");
        this.successMessage = "announced!";
      } catch (err) {
        console.error(err);
        console.error(err.response);
      }
    },
    editGiveaway() {}
  }
};
</script>

<style scoped>
.countdown {
  display: block;
  width: 100%;
  font-size: 3em;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.winner {
  font-size: 1.4em;
  text-align: center;
  margin: 0 auto;
  display: block;
  letter-spacing: 1.5px;
}
.winner-avatar {
  display: block;
  margin: 10px auto;
  border-radius: 100px;
}
</style>
