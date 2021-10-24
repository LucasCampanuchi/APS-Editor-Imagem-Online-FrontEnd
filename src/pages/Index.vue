<template>
  <q-page class="flex flex-center">
    <input type="file" name="file" multiple ref="files" />
    <button @click="upload">Send</button>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/api/connection'

export default defineComponent({
  name: 'PageIndex',
  methods: {
    upload () {
      const dataForm = new FormData()
      for (const file of this.$refs.files.files) {
        dataForm.append('file', file)
      }
      api.post('efeitos?efeito=Inverter_Cores&intensidade=100', {
        dataForm
      }).then(data => {
        console.log(data)
      })
    }
    /* async sendFile () {
      const dataForm = new FormData()
      for (const file of this.$refs.files.files) {
        dataForm.append('file', file)
      }
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: dataForm
      })
      const data = await res.json()
      console.log(data)
    } */

  }
})
</script>
