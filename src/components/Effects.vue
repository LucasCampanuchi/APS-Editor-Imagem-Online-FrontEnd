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
      effectsAply: [],
      storeBase64: [],
      firstBase64: '',
      model: ref(null),
      intensidade: 50,
      desfoque: 1,
      isVisibleDesfoque: false,
      isVisibleBrigth: false,
      effect: '',
      image: ''
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
      const param = data === 'intensidade' ? this.intensidade : this.desfoque

      api.post('efeitos?efeito=' + this.effect + '&intensidade=' + param, {
        code: this.image.toString()
      }).then(data => {
        emitter.emit('event-name', data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    isVisible (data) {
      if (!this.effectsAply.includes(data)) {
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

        api.post('efeitos?efeito=' + data + '&intensidade=' + param, {
          code: this.image.toString()
        }).then(data => {
          this.effectsAply.push(this.effect)
          this.storeBase64.push({
            effects: JSON.stringify(this.effectsAply),
            base64: data.data
          })
          this.image = data.data
          emitter.emit('effectsAply', this.effectsAply)
          emitter.emit('event-name', this.image)
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log(this.effectsAply)
      }
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
      this.image = ''
      this.image = data.split('base64,')[1]
      this.firstBase64 = data.split('base64,')[1]
    })
    emitter.on('removeEffect', async data => {
      if (data.length === 0) {
        this.image = this.firstBase64
        emitter.emit('event-name', this.image)
        this.effectsAply = []
        emitter.emit('effectsAply', this.effectsAply)
      } else {
        const tempBase = this.storeBase64.find(f => f.effects === JSON.stringify(data))
        if (tempBase !== undefined) {
          this.image = tempBase.base64
          this.effectsAply = data
          emitter.emit('event-name', this.image)
          emitter.emit('effectsAply', this.effectsAply)
        } else {
          /* console.log(data.length)
          for (let i = 0; i < data.length; i++) {
            let tempImage = ''
            if (i === 0) {
              tempImage = this.firstBase64
            } else {
              tempImage = this.image
            }
            api.post('efeitos?efeito=' + data[i] + '&intensidade=100', {
              code: tempImage
            }).then(a => {
              this.image = a.data
              this.effectsAply = data
              this.storeBase64.push({
                effects: JSON.stringify(data),
                base64: this.image
              })
              emitter.emit('effectsAply', this.effectsAply)
              emitter.emit('event-name', this.image)
            }).catch(err => {
              console.log(err)
            })
          } */
        }
      }
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
