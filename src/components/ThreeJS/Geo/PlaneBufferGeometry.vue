<template>
  <div class="geo-Plane"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geometry = new THREE.PlaneBufferGeometry(3, 3, 30, 30)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
