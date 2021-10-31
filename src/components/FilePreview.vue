<template>
  <div class="q-pl-md" style="width: 100%;">
    <q-card flat bordered class="my-card" id="content"  style="width: 100%;">
        <q-card-section style="width: 100%; display: flex; justify-content: center; height: 159px;">
            <div class="row" style="width: 100%;">
                <div class="col-12 q-pa-md"  style="display: flex; justify-content: center;">
                    <q-card flat bordered class="my-card" style="width: 100%;">
                        <q-card-section style="width: 100%;">
                            <div class="row" >
                                <div class="col-12">
                                    <div class="row">
                                        <div class="col-6">
                                            <div id="file-js-example" class="file has-name">
                                                <label class="file-label">
                                                    <input class="file-input" type="file" @input="pickFile" ref="fileInput" name="resume" @click="selectImage">
                                                    <span class="file-cta">
                                                    <span class="file-icon">
                                                        <i class="fas fa-upload"></i>
                                                    </span>
                                                    <span class="file-label">
                                                        Choose a file…
                                                    </span>
                                                    </span>
                                                    <span class="file-name" v-if="fileName == ''">
                                                        No file uploaded
                                                    </span>
                                                    <span class="file-name" v-else>
                                                        {{fileName}}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-6" style="display: flex; justify-content: end;">
                                            <q-btn flat color="primary"  label="Download"  @click="download"/>
                                            <q-btn flat color="primary"  label="Limpar"  @click="limpar"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-12 q-pa-md">
                    <q-card flat bordered class="my-card" style="width: 100%;">
                        <q-card-section style="width: 100%; display: flex; align-items: center; justify-content: center;" id="tam1" >
                            <div class="row" >
                                <div class="col-12 justify-center" >
                                     <img :src="previewImage" id="imagem">
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </q-card-section>
    </q-card>
    <q-card flat bordered class="my-card q-mt-lg" style="width: 100%;" v-if="effectsAply.length > 0">
      <q-card-section style="width: 100%;">
        <div class="row">
          <div class="col-lg-2 col-md-2 col-xs-6 q-pa-xs btnStates"  v-for="(o, i) in this.effectsAply" :key="o" >
              <q-card flat bordered class="my-card" >
                <q-card-section class="cardSection">
                  <div class="row" style="width: 100%">
                    <div class="col-10 colEsq">
                      <p style="display: contents;">{{o}}</p>
                    </div>
                    <div class="col-2 colDir" v-if="i === this.effectsAply.length -1">
                      <q-btn flat size="xs" round color="primary" icon="close" @click="remove(o)" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

          </div>
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>

import { emitter } from '../boot/EventBus'

export default {

  data () {
    return {
      previewImage: null,
      fileName: '',
      effectsAply: []
    }
  },
  mounted () {
    document.getElementById('content').style.height = window.innerHeight - 150 + 'px'
    document.getElementById('tam1').style.height = window.innerHeight - 330 + 'px'
    document.getElementById('imagem').style.maxHeight = parseInt(document.getElementById('tam1').style.height) - 60 + 'px'
  },
  methods: {
    remove (data) {
      if (this.effectsAply[this.effectsAply.length - 1] === data) {
        this.effectsAply = this.effectsAply.filter(f => f !== data)
        emitter.emit('removeEffect', this.effectsAply)
      } else {
        console.log('NAO')
      }
    },
    limpar () {
      this.fileName = ''
      this.previewImage = null
      emitter.emit('input', '')
    },
    download () {
      this.$emit('download', { image: this.previewImage, fileName: this.fileName })
    },
    selectImage () {
      this.$refs.fileInput.click()
    },
    pickFile () {
      const input = this.$refs.fileInput
      const file = input.files
      this.fileName = file[0].name

      if (file && file[0]) {
        const reader = new FileReader()

        reader.onprogress = function (data) {
          if (data.lengthComputable) {
            const progress = parseInt(((data.loaded / data.total) * 100), 10)
            console.log(progress)
          }
        }
        reader.onload = e => {
          this.previewImage = e.target.result
          emitter.emit('input', e.target.result)
        }
        reader.readAsDataURL(file[0])
      }
    }
  },
  created () {
    /* this.$parent.$on('update', this.previewImage) */
    /* this.$emit.$on('update', this.setValue) */
    emitter.on('event-name', async data => {
      this.previewImage = 'data:image/jpg;base64,' + data
    })
    emitter.on('effectsAply', async data => {
      this.effectsAply = data
    })
  }
}
</script>

<style scoped lang="scss">
.imagePreviewWrapper {
    width: 450px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
}
.file-name{
    width: 300px;
    display: flex;
    justify-content: center;
}

</style>
