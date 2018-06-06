<template>
  <div class='embed-builder'>
    <h3>Embed Builder</h3>

    <div class='grid-container'>
      <label class='grid-span-4'>
        Title
        <input v-model="embed.title" type="text">
      </label>
      <label class='grid-span-4'>
        Title URL
        <input v-model="embed.url" type="text">
      </label>
      <label class='grid-span-4'>
        Description
        <textarea v-model="embed.description"></textarea>
      </label>
      <label class='grid-span-2'>
        Color
        <input v-model="color" type="text" :style="'border-bottom-color: ' + color">
      </label>
      <label class='grid-span-2 checkbox-container'>
        Timestamp        
        <input v-model="embed.timestamp" type="checkbox">
        <span class='checkbox'></span>
      </label>
      <label class='grid-span-2'>
        Image
        <input v-model="embed.image.url" type='text'/>
      </label>
      <label class='grid-span-2'>
        Thumbnail
        <input v-model="embed.thumbnail.url" type='text'/>
      </label>

      <dropdown title='Author' class='grid-span-4'>
        <div class='grid-container'>
          <label class='grid-span-4'>
            Name
            <input v-model="embed.author.name" type="text">
          </label>
          <label class='grid-span-2'>
            Icon URL
            <input v-model="embed.author.icon_url" type="text">
          </label>
          <label class='grid-span-2'>
            URL
            <input v-model="embed.author.url" type="text">
          </label>
        </div>
      </dropdown>

      <dropdown title='Footer' class='grid-span-4'>
        <div class='grid-container'>
          <label class='grid-span-2'>
            Text
            <input v-model="embed.footer.text" type="text">
          </label>
          <label class='grid-span-2'>
            Icon URL
            <input v-model="embed.footer.icon_url" type="text">
          </label>
        </div>
      </dropdown>

      <div v-for="field in embed.fields" :key="field.id" class='grid-container grid-span-4'>
        <label class='grid-span-2' style='grid-row: 1 / span 1'>
          Name
          <input v-model="field.name" type="text">
        </label>
        <label class='grid-span-2' style='grid-row: 1 / span 3'>
          Value
          <textarea v-model="field.value"></textarea>
        </label>
        <label class='grid-span-1 checkbox-container' style='grid-row: 2 / span 1'>
          Inline        
          <input v-model="field.inline" type="checkbox">
          <span class='checkbox'></span>
        </label>
        <a class='button small grid-span-1 text-danger danger hover' 
          style='grid-row: 2 / span 1; max-width: 150px; margin: 5px auto'
          @click.prevent="removeField(field.id)">
          Delete
        </a>
     
      </div>
      <a class='grid-span-4 button small' @click.prevent="addField">Add Field</a>
    </div>
  </div>
</template>

<script>
import Dropdown from '~/components/Dropdown.vue';

export default {
  components: {Dropdown},
  props: {
    embed: {
      type: Object,
      default: ()=>({
        fields: [],
        image: {},
        thumbnail: {},
        author: {},
        footer: {},
        color: 0
      })
    }
  },
  computed: {
    color: {
      get() {
        let color = this.rcolor.replace(/[^0-9a-f]/gi, '').substring(0, 6);
        return '#' + color;
      },
      set(value) {
        let color = value.replace(/[^0-9a-f]/gi, '').substring(0, 6);
        this.embed.color = parseInt(color, 16);
        if (isNaN(this.embed.color)) this.embed.color = 0;
        this.rcolor = value;
      }
    }
  },
  mounted() {
    if (!this.embed.fields) this.embed.fields = [];
    if (!this.embed.image) this.embed.image = {};
    if (!this.embed.thumbnail) this.embed.thumbnail = {};
    if (!this.embed.author) this.embed.author = {};
    if (!this.embed.footer) this.embed.footer = {};
    if (!this.embed.color) this.embed.color = 0;
    this.rcolor = this.embed.color.toString(16).padStart(6, '0');
  },
  data() {
    return {
      rcolor: '000000',
      counter: 0
    };
  },
  methods: {
    addField() {
      this.embed.fields.push({name: '', value: '', inline: true, id: this.counter++});
    },
    removeField(id) {
      this.embed.fields = this.embed.fields.filter(f => f.id !== id);
    }
  }
};  
</script>

<style scoped>
.embed-builder {
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
}
</style>
