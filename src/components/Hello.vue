<template>
  <div>
    <Header />
    <div class="hello">
      <h1>Welcome to our effect code remxing and creation platform.</h1>
      <img class="lmb-product" src="../assets/product-logo.svg" alt="Effect Node Logo">
      <h1>
        Effect Node is getting a revamp.
      </h1>

      <router-link to="/menu">effect node OS</router-link>

      <!--

      <h3>While you wait for our product, you can experiment our prototype.</h3>

      Our concept prototypes: <br />
      <a href="./heart-space">Heart Space Prototype</a>
      <br />
      <a href="./mindfulness/scene/demo1">Mindfulness Prototype</a>
      <br />
      <a href="./mindfulness/lighthouse/demo1">Ugly Light House Prototype</a>
      <br />
      <a href="./tca">Three.JS Custom Animation</a>
      <br />
      <router-link to="./studio">Golden Egg Studio - Front End CMS</router-link>

      <p>EffectNode.com is made with love in Hong Kong.</p>

      -->

      <p>
        <a href="https://www.facebook.com/effectnode"><img src="../assets/icons/fb.svg" alt="Facebook"></a>
        <a href="https://twitter.com/effectnode"><img src="../assets/icons/twitter.svg" alt="Twitter"></a>
        <a href="https://www.instagram.com/effectnode/"><img src="../assets/icons/instagram.svg" alt="Instagram"></a>
      </p>

    </div>
  </div>
</template>

<script>
import Header from './parts/Header/Header.vue'
export default {
  components: {
    Header
  },
  name: 'hello',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello{
  text-align: center;
}
h1, h2 {
  font-weight: normal;
}
.lmb{
  max-width: 150px;
  max-height: 150px;
}
.lmb-product{
  width: 50vmin;
}


</style>
