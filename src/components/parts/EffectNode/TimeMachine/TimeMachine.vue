<template>
  <div class="time-machine">

    <div class="timebar">
      <div class="label">
        <div class="v-center">

          <a v-if="worldURL" target="_blank" :href="worldURL">
            <img v-if="FireState.user" @mouseover="$emit('tooltip', { name: !worldURL ? 'One Click Deploy, \n please wait for QR Code': 'Click to deploy update.', qr: worldURL })" @mouseout="$emit('tooltip', false)" @click="deployToWWW" src="./img/deploy.svg" alt="code stuff" class="icon-img hover-magnify" />
          </a>
          <img v-if="FireState.user && !worldURL" @mouseover="$emit('tooltip', { name: !worldURL ? 'One Click Deploy, \n please wait for QR Code': 'Click to deploy update.', qr: worldURL })" @mouseout="$emit('tooltip', false)" @click="deployToWWW" src="./img/deploy.svg" alt="code stuff" class="icon-img hover-magnify" />

          <img @mouseover="$emit('tooltip', { name: 'Export Zip' })" @mouseout="$emit('tooltip', false)" @click="exportZip" src="./img/zip.svg" alt="zip stuff" class="icon-img hover-magnify" />
          <img @mouseover="$emit('tooltip', { name: 'Export JavaScript Code' })" @mouseout="$emit('tooltip', false)" @click="exportJS" src="./img/export.svg" alt="code stuff" class="icon-img hover-magnify" />
          <!-- <img @mouseover="$emit('tooltip', { name: 'Backup All Snapshots' })" @mouseout="$emit('tooltip', false)"  @click="backupTimeMachine" src="./img/folder-plus.svg" class="icon-img hover-magnify" /> -->
          <!-- <img @mouseover="$emit('tooltip', { name: 'Replace All Snapshots' })" @mouseout="$emit('tooltip', false)"  @click="restoreTimeMachine" src="./img/nuke.svg" class="icon-img hover-magnify" /> -->
          <input @mouseover="$emit('tooltip', { name: 'Version Timeline' })" @mouseout="$emit('tooltip', false)"  type="range" class="timerange" v-model="timeTravelIndex" @change="() => {}" :min="0" :max="backups.length - 1" v-if="backups.length > 0" />
          <img @mouseover="$emit('tooltip', { name: 'Take Project Snapshot' })" @mouseout="$emit('tooltip', false)" @click="clickTakeSnapShot" src="./img/floppy.svg" class="icon-img hover-magnify" />
          <!-- <img @mouseover="$emit('tooltip', { name: 'Project Version' })" @mouseout="$emit('tooltip', false)" src="./img/time.svg" class="icon-img version" /> -->

          <select @mouseover="$emit('tooltip', { name: 'TimeStamp' })" @mouseout="$emit('tooltip', false)" ref="version-select" class="select-versions" @input="() => {}" v-model="timeTravelIndex">
            <option :key="backup.date + iBackup" :value="iBackup" v-for="(backup, iBackup) in backups">
              {{ fromNow(backup.date) }}
            </option>
          </select>

          <input v-show="false" ref="time-machine-loader" type="file" @change="loadTimeMachine" />
        </div>
      </div>
    </div>

    <!-- <div class="label">
      <div class="v-center">
        <img @mouseover="$emit('tooltip', { name: 'Delete and Reset All?', reverseX: -150 })" @mouseout="$emit('tooltip', false)" @click="format" src="./img/nuke.svg" class="icon-img hover-magnify" />
      </div>
    </div> -->

  </div>
</template>

<script>
import * as Fire from '@/firebase.js'
import moment from 'moment'
var JSZip = require('jszip')

var makeID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export default {
  props: {
    output: {
    },
    rootDoc: {
      default () {
        return {
          now: {},
          backups: []
        }
      }
    }
  },
  data () {
    return {
      worldURL: false,
      FireState: Fire.state,
      clean () {},
      uploadToFirebase: false,
      downloadJS: false,
      timeTravelIndex: 0 // this.rootDoc.backups.length - 1
    }
  },
  watch: {
    timeTravelIndex (newVal, oldVal) {
      console.log(oldVal)
      this.travel({ takeSnapshot: Number(oldVal) === 0 })
    },
    rootDoc () {
      this.timeTravelIndex = 0 // this.rootDoc.backups.length - 1
    },
    output () {
      if (this.uploadToFirebase) {
        this.uploadToFirebase = false

        Fire.deployToWWW({ pid: this.rootDoc.rid, html: this.output.html })
          .then(() => {
            let url = `https://effectnode.com/api/view/${Fire.state.user.uid}/${this.rootDoc.rid}`
            this.worldURL = url

            this.$emit('tooltip', { name: 'Deployed to the world. \n Click the QR Code.', qr: this.worldURL })
          })

        let handler = () => {
          if (this.worldURL) {
            window.removeEventListener('click', handler)
            this.$emit('tooltip', false)
          }
        }
        window.addEventListener('click', handler, true)

        console.log(this.output)
      }
      if (this.downloadJS) {
        this.downloadJS = false
        var value = this.output.js
        var url = URL.createObjectURL(new Blob([value]))
        var anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'exported-javascript-code@' + new Date().getTime() + '.js'
        anchor.click()
      }
    }
  },
  computed: {
    // timeTravelIndex: {
    //   get () {
    //     return this.rootDoc.timeTravelIndex || 0
    //   },
    //   set (v) {
    //     this.rootDoc.timeTravelIndex = v
    //   }
    // },
    backups: {
      get () {
        return this.rootDoc.backups.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
      },
      set (v) {
        this.rootDoc.backups = v
      }
    }
  },
  beforeDestroy () {
    this.clean()
  },
  mounted () {
    var autosaveTimer = 0
    autosaveTimer = setInterval(() => {
      this.takeSnapshot()
    }, 1000 * 60 * 7)

    this.clean = () => {
      clearInterval(autosaveTimer)
    }

    // make the moments from now (how long ago) live.
    setInterval(() => {
      this.$forceUpdate()
    }, 1000 * 60)
  },
  methods: {
    exportZip () {
      let root = this.rootDoc
      let zip = new JSZip()
      root.now.files.forEach((file) => {
        if (file.path !== '@/index.html') {
          zip.file(file.path.replace('@/', 'myapp/src/'), file.src)
        } else {
          let newSrc = file.src
          let insertion = `<script src="${'./main.js'}">${'</'}${'script>'}`
          newSrc = newSrc.replace('</body>', `${insertion}</body>`)
          zip.file(file.path.replace('@/', 'myapp/src/'), newSrc)
        }
      })
      zip.file('myapp/package.json', require('./parcel/package.json.txt'))
      zip.file('myapp/.babelrc', require('./parcel/babelrc.txt'))

      var promise = null
      if (JSZip.support.uint8array) {
        promise = zip.generateAsync({ type: 'uint8array' })
      } else {
        promise = zip.generateAsync({ type: 'string' })
      }
      promise.then((file) => {
        var blob = new Blob([file], { type: 'application/zip' })
        var link = window.URL.createObjectURL(blob)
        window.location = link
      })
    },
    deployToWWW () {
      this.uploadToFirebase = true
      this.$emit('compile', { minify: true })
    },
    exportJS () {
      this.downloadJS = true
      this.$emit('compile', { minify: true })
    },
    fromNow (date) {
      return 'Backup: ' + moment(new Date(date)).fromNow() + ' ' + moment(new Date(date)).format('MMM Do YYYY, h:mm:ss a')
    },
    format () {
      if (window.confirm('delete all time machine records and rest factory settings?') && window.confirm('are you sure?') && window.confirm('Final confirm. this is irreversible.')) {
        // this.$emit('load-root', require('./samples/animation.json'))
        this.$emit('load-root', require('./samples/single-page.json'))
        this.$nextTick(() => {
          this.$emit('just-save')
          this.takeSnapshot()
          this.$emit('compile')
        })
      }
    },
    provideID ({ projectJSON }) {
      let root = JSON.parse(projectJSON)

      if (!root.rid) {
        root.rid = makeID()
      }

      return JSON.stringify(root)
    },
    loadTimeMachine (evt) {
      var file = evt.target.files[0]
      var reader = new FileReader()
      reader.onload = () => {
        try {
          let result = reader.result
          result = this.provideID({ projectJSON: result })

          this.$emit('load-root', JSON.parse(result))
        } catch (e) {
          console.log('file reader error')
        }
      }
      reader.readAsText(file)
    },
    restoreTimeMachine () {
      if (this.$refs['time-machine-loader']) {
        this.$refs['time-machine-loader'].click()
      }
    },
    backupTimeMachine () {
      this.takeSnapshot()
      this.$nextTick(() => {
        this.timeTravelIndex = 0 // this.rootDoc.backups.length - 1

        var json = JSON.stringify(this.rootDoc, null, '\t')
        var url = URL.createObjectURL(new Blob([json]), { type: 'application/json' })
        var anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'time-machine-backup@' + new Date() + '.json'
        anchor.click()
      })
    },
    clickTakeSnapShot () {
      this.takeSnapshot()
      this.$nextTick(() => {
        this.timeTravelIndex = 0 // this.rootDoc.backups.length - 1
        this.$emit('compile')
      })
    },
    takeSnapshot () {
      var date = new Date().toString()
      var clonedNow = JSON.parse(JSON.stringify(this.rootDoc.now))
      clonedNow.date = date

      this.rootDoc.backups.unshift(clonedNow)
      this.$nextTick(() => {
        this.$emit('just-save')
      })
    },
    travel ({ takeSnapshot }) {
      if (takeSnapshot) {
        this.takeSnapshot()
      }
      var backup = this.backups[this.timeTravelIndex]
      if (backup) {
        this.$nextTick(() => {
          this.$emit('travel', backup)
        })
      }
    }
  }
}
</script>

<style scoped>
.timebar{
  transform: translateY(0px);
}
.time-machine{
  margin-right: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.label{
  height: 15px;
  margin-right: 8px;
  display: inline-block;
}
.icon-img {
  margin-right: 8px;
}
.label:hover{
  text-decoration: underline;
}
.v-center{
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.hover-magnify{
  cursor: pointer;
  transition: transform 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.hover-magnify:hover{
  cursor: pointer;
  transform: scale(1.3333);
}

.select-versions{
  font-size: 13px;
  line-height: 15px;
  text-align: center;

  -webkit-appearance: none;
  background: transparent;
  border: none;
}
.select-versions:hover{
  text-decoration: underline;
}

.clock{
  margin-left: 8px;
}


@keyframes track-gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

input[type=range].timerange {
  height: 15px;
  margin-right: 8px;
  -webkit-appearance: none;
  width: 100%;
  background-color: transparent;

  /* background: linear-gradient(90deg, #EE7752, #E73C7E, #23A6D5, #23D5AB); */
  background: linear-gradient(90deg, rgb(76, 76, 76), rgb(192, 192, 192), rgb(76, 76, 76));
	background-size: 400% 400%;
  animation: track-gradient 8.88888s ease infinite;
  border-radius: 0.0000px;

  margin-right: 8px;
}
input[type=range].timerange:focus {
  outline: none;
}
input[type=range].timerange::-webkit-slider-runnable-track {
  width: 100%;
  height: 13px;
  cursor: pointer;



  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  /* background: transparent; */
  border-radius: 0.0000px;
  border: 0px solid #010101;
}
input[type=range].timerange::-webkit-slider-thumb {
  /* box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0); */
  border: 0px solid rgba(0, 0, 0, 0.342);
  height: 13px;
  width: 32px;
  border-radius: 0px;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: 0px;
  border-radius: 0.0000px;

}
input[type=range].timerange:focus::-webkit-slider-runnable-track {
  background: transparent;
}
input[type=range].timerange::-moz-range-track {
  width: 100%;
  height: 13px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: transparent;
  border-radius: 0px;
  border: 0px solid #010101;
}
input[type=range].timerange::-moz-range-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  border: 0px solid rgba(0, 0, 0, 0.57);
  height: 13px;
  width: 32px;
  border-radius: 0px;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
input[type=range].timerange::-ms-track {
  width: 100%;
  height: 13px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range].timerange::-ms-fill-lower {
  background: rgba(181, 181, 181, 0.31);
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type=range].timerange::-ms-fill-upper {
  background: transparent;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type=range].timerange::-ms-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  border: 0px solid rgba(0, 0, 0, 0.57);
  width: 32px;
  border-radius: 0px;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  height: 13px;
}
input[type=range].timerange:focus::-ms-fill-lower {
  background: transparent;
}
input[type=range].timerange:focus::-ms-fill-upper {
  background: transparent;
}



</style>
