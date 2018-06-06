<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center maintain-case">
        {{ data.title }}
      </h1>
      <p v-if="data.description" class='center maintain-case'>{{ data.description }}</p>
      
      <label v-if="!successMessage">
        Password
        <input v-model="password" type="text">
      </label>

      <div class='countdown monospace'>
        <span class='timer'>{{ ftime.d }}</span> :
        <span class='timer'>{{ ftime.h }}</span> :
        <span class='timer'>{{ ftime.m }}</span> :
        <span class='timer'>{{ ftime.s }}</span> 
      </div>

      <a class='button' @click.prevent="enter">Enter</a>

    </section>
  </div>
</template>
<script>
export default {
  asyncData({ params, $axios }) {
    console.log(params.id);
    return $axios.$get('/giveaway/' + params.id).then(data => {
      return Object.assign({id: params.id}, data);
    });
  },
  data() {
    return { 
      password: '',
      duration: null,
      time: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      errorMessage: '',
      successMessage: ''
    };
  },
  computed: {
    ftime() {
      let days = this.time.days.toString().padStart(2, '0');
      let hours = this.time.hours.toString().padStart(2, '0');
      let minutes = this.time.minutes.toString().padStart(2, '0');
      let seconds = this.time.seconds.toString().padStart(2, '0');

      return {d:days,h:hours,m:minutes,s:seconds};
    }
  },
  mounted() {
    this.duration = window.moment.duration(this.data.timestamp - Date.now());
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    console.log(this.duration);
  },
  head() {
    return {
    };
  },
  methods: {
    updateTime() {
      this.duration = window.moment.duration(this.data.timestamp - Date.now());    
      this.time.days = this.duration.days();
      this.time.hours = this.duration.hours();
      this.time.minutes = this.duration.minutes();
      this.time.seconds = this.duration.seconds();
    },
    async enter() {
      let response = await this.$axios.$post('/giveaway/' + this.id + '/enter');
      if (!response) {
        this.errorMessage = 'Incorrect password';
      } else {
        this.errorMessage = '';
        this.successMessage = 'You have been entered into the giveaway';
      }
    }
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

</style>
