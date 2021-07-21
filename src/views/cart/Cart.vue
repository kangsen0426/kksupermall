
<template>
  <div class="cart">
    <nav-bar class="cart-bar">
      <div slot="left" @click="titleBack" class="back-img">
        <img src="~assets/img/common/back.svg" alt="" />
      </div>
      <div slot="center">购物车({{ $store.state.carList.length }})</div>
    </nav-bar>

   <cart-list></cart-list>
   
  </div>
</template>
    
<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/Carlist.vue";
// import Scroll from "components/common/scroll/Scorll.vue";
// import { Toast } from 'vant'
// //getters映射到计算属性中
// import { mapGetters } from "vuex";
export default {
  name: "Cart",
  data() {
    return {};
  },
  methods: {
   
  },
  components: {
    NavBar,
    CartList
    
  },
  computed: {

  }

};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.cart-bar {
  background-color: var(--color-tint);
  color: #fff;
  position: relative;
  z-index: 9;
}
.back-img img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.content {
  height: calc(100% - 184px);
  overflow: hidden;
}
.van-submit-bar {
  bottom: 49px;
}
.hint {
  text-align: center;
  position: relative;
  /*top: 100px;*/
  font-size: 18px;
  color: gray;
  /*background-color: red;*/
}
.hint img {
  width: 20px;
  vertical-align: top;
}
.toHome {
  color: blue;
  border-bottom: 1px solid;
}
</style>