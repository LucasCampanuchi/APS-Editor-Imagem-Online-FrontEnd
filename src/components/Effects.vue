<template>
 <div class="q-pa-md" style="min-width: 380px"  >
     <div class="row">
         <div class="col-3">
            <q-list bordered class="rounded-borders" >
            <q-expansion-item
                expand-separator
                label="Efeitos"
                class="items"
            >
                <q-list bordered padding id="menu">
                    <q-item clickable v-ripple v-for="effect in effects" :key="effect" @click="isVisible(effect)">
                        <q-item-section>{{effect}}</q-item-section>
                    </q-item>
                </q-list>
            </q-expansion-item>
            <q-item v-if="isVisibleBrigth">
                <q-item-section side v-if="intensidade < 33">
                <q-icon  name="brightness_low" />
                </q-item-section>
                <q-item-section side v-else-if="intensidade < 66">
                <q-icon  name="brightness_medium" />
                </q-item-section>
                <q-item-section side v-else>
                <q-icon  name="brightness_high" />
                </q-item-section>
                <q-item-section>
                <q-slider
                    v-model="intensidade"
                    :min="0"
                    :max="100"
                    label
                    @change="slide('intensidade')"
                />
                </q-item-section>
            </q-item>
            <q-item v-if="isVisibleDesfoque">
                <q-item-section side v-if="desfoque == 1">
                <q-icon name="blur_off" />
                </q-item-section>
                <q-item-section side v-else>
                <q-icon name="blur_on" />
                </q-item-section>
                <q-item-section>
                <q-slider
                    v-model="desfoque"
                    :min="1"
                    :max="100"
                    label
                    @change="slide('desfoque')"
                />
                </q-item-section>
            </q-item>
            </q-list>
         </div>
         <div class="col-9">
            <FilePreview @download="download($event)" />
            <p></p>
         </div>
     </div>

  </div>

</template>

<script>
import { api } from 'src/api/connection'
import { ref } from 'vue'
import FilePreview from 'src/components/FilePreview.vue'
import { emitter } from '../boot/EventBus'

export default {
  components: {
    FilePreview
  },
  data () {
    return {
      effects: [],
      model: ref(null),
      intensidade: 50,
      desfoque: 1,
      isVisibleDesfoque: false,
      isVisibleBrigth: false,
      effect: '',
      image: []
    }
  },
  methods: {
    download (data) {
      const a = document.createElement('a') // Create <a>
      a.href = data.image // Image Base64 Goes here
      a.download = data.fileName.replace('.jpg', '') + ' ' + this.effect + '.jpg' // File name Here
      a.click() // Downloaded file
    },
    slide (data) {
      const dataForm = new FormData()
      dataForm.append('content_image', this.image[0])

      const param = data === 'intensidade' ? this.intensidade : this.desfoque

      api.post('efeitos?efeito=' + this.effect + '&intensidade=' + param, dataForm).then(data => {
        emitter.emit('event-name', data.data)
      }).catch(err => {
        console.log(err)
      })
    },

    isVisible (data) {
      let param = 100
      if (data === 'Desfoque') {
        this.isVisibleDesfoque = true
        this.isVisibleBrigth = false
        param = this.desfoque
        document.getElementById('menu').style.height = window.innerHeight - 297 + 'px'
      } else if (data === 'Ajuste brilho') {
        this.isVisibleBrigth = true
        this.isVisibleDesfoque = false
        param = this.intensidade
        document.getElementById('menu').style.height = window.innerHeight - 297 + 'px'
      } else {
        this.isVisibleDesfoque = false
        this.isVisibleBrigth = false
        document.getElementById('menu').style.height = window.innerHeight - 217 + 'px'
      }
      this.effect = data

      const dataForm = new FormData()
      dataForm.append('content_image', this.image[0])
      console.log(dataForm)
      api.post('efeitos?efeito=' + data + '&intensidade=' + param, dataForm).then(data => {
        emitter.emit('event-name', data.data)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    api.get('listarefeitos').then(data => {
      this.effects = data.data
    })
    document.getElementById('menu').style.height = window.innerHeight - 217 + 'px'
    const element = document.getElementsByClassName('q-item__section column q-item__section--main justify-center')
    element[0].style.maxWidth = '80%'
  },
  created () {
    emitter.on('input', async data => {
      this.image = []
      this.image.push(data)
    })
  }

}
</script>

<style>
#menu{
    position: relative;
    overflow: auto;
    min-width: 285px;
}
#menuP{
    position: relative;
    overflow: auto;
    min-width: 285px;
}
/* .items{
  padding-right: 20px;
} */
</style>
