<template>
  <div class="winwin">
    <img class="win-title" src="../img/win-title.svg" alt="" />
    <div class="win-iframe">
      <PreviewBox class="iframer" ref="preview" :project="project" :enabled="enabled"></PreviewBox>
      <div class="win-blocker"></div>
    </div>
  </div>
</template>

<script>
import PreviewBox from './PreviewBox'
export default {
  components: {
    PreviewBox
  },
  props: {
    project: {},
    enabled: {}
  }
}
</script>

<style scoped>
.winwin{
  width: 350px;
  overflow: hidden;
  border-radius: 6.5px;
  border: #cacaca solid 1px;
  box-sizing: border-box;
}
.win-title{
  width: 100%;
}
.win-iframe{
  height: 200px;
  width: 350px;
  margin-top: -6px;
  background-color: rgb(187, 187, 187);
  position: relative;
}
.win-blocker{
  position: absolute;
  top: 0px;
  left: 0px;
  height: 200px;
  width: 350px;
}
.iframer{
  width: 100%;
  height: 100%;
  min-height: calc(192px);
}
</style>
