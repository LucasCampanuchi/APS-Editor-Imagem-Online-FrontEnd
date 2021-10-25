<template>
  <q-page class="q-pa-lg">
    <Effects/>

<!--     <div class="row q-ma-lg" >
      <FilePreview />

    </div> -->

    <!-- <q-img
      :src="'data:image/jpg;base64,'+image"
    /> -->
    <!-- <button @click="upload">Send</button> -->
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/api/connection'
/* import FilePreview from 'src/components/FilePreview.vue' */
import Effects from 'src/components/Effects.vue'

/* imgInp.onchange = evt => {
  const [file] = imgInp.files
  if (file) {
    blah.src = URL.createObjectURL(file)
  }
} */

export default defineComponent({
  name: 'PageIndex',
  components: {
    /* FilePreview, */
    Effects
  },
  data () {
    return {
      image: '',
      previewImage: null
    }
  },
  methods: {

    upload () {
      const dataForm = new FormData()
      /* for (const file of this.$refs.files.files) {
        dataForm.append('content_image', file)
        console.log(dataForm)
      } */
      dataForm.append('content_image', this.$refs.files.files[0])
      api.post('efeitos?efeito=Inverter_Cores&intensidade=100', dataForm).then(data => {
        console.log(data.data)
        this.image = data.data
      }).catch(err => {
        console.log(err)
      })
    }

  }
})
</script>

<style scoped>
.row{
  width: 100%;
}
</style>
