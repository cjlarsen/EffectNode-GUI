import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Test from '@/components/pages/Test/Test.vue'
import HeartSpace from '@/components/pages/HeartSpace/HeartSpace.vue'

import Mindfulness from '@/components/pages/MindScene/Mindfulness.vue'
import MindScene from '@/components/pages/MindScene/MindScene.vue'
import UglyLightHouse from '@/components/pages/MindScene/UglyLightHouse.vue'
// import ENScene from '@/components/pages/MindScene/ENScene.vue'
import WelcomeScene from '@/components/pages/MindScene/WelcomeScene.vue'
import CustomAnimation from '@/components/pages/CustomAnimation/CustomAnimation.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/tca',
      name: 'tca',
      component: CustomAnimation
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/heart-space',
      name: 'HeartSpace',
      component: HeartSpace
    },
    {
      path: '/mindfulness',
      name: 'Mindfulness',
      component: Mindfulness,
      children: [
        {
          path: '',
          redirect: 'welcome'
        },
        {
          path: 'scene',
          redirect: 'welcome'
        },
        {
          path: 'heart',
          redirect: 'welcome'
        },
        {
          path: 'welcome',
          component: WelcomeScene
        },
        {
          path: 'scene/:msid',
          name: 'MindScene',
          component: MindScene
        },
        {
          path: 'lighthouse/:lid',
          name: 'UglyLightHouse',
          component: UglyLightHouse
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// form follow conciousness
