<template>
  <div class="full" ref="full">

    <Renderer
      :alpha="true"
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >

      <keep-alive>
        <component
          v-if="renderer"
          :is="'router-view'"
          :size="size"
          :renderer="renderer"
          @scene="(v) => { scene = v }"
          @camera="(v) => { camera = v }"
        ></component>
      </keep-alive>

    </Renderer>

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
// import simpleVS from '@/components/Shaders/Simple/vs.vert'
// import simpleFS from '@/components/Shaders/Simple/fs.frag'

export default {
  components: {
    ...Bundle
  },
  computed: {
    routePath () {
      return this.$route.path
    }
  },
  data () {
    return {
      scene: false,
      camera: false,
      toucher: false,
      resizer: () => {},
      renderer: false,
      size: {
        width: 100,
        height: 100,
        aspect: 1
      }
    }
  },
  created () {
  },
  mounted () {
    var resizer = this.resizer = () => {
      this.$nextTick(() => {
        var rect = this.$refs.full.getBoundingClientRect()
        this.size = {
          width: rect.width,
          height: rect.height,
          aspect: rect.width / rect.height
        }
      })
    }
    window.addEventListener('resize', resizer.bind(this))
    resizer()
  },
  methods: {
  }
}
</script>

<style scoped>
.hidden{
  display: none;
}
.full{
  width: 100%;
  height: 100%;
}
</style>
