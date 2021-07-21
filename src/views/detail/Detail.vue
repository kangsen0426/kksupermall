<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" ref="nav" @titleclick="titleclick" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info
        ref="comment"
        :commentInfo="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommends" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar
      @addCart="addToCart"
      @toCart="toCart"
    ></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DeatilComment.vue";
import DetailBottomBar from "./childComps/DeatilBottomBar.vue";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

import Scroll from "components/common/scroll/Scroll";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";

import { debounce } from "common/utils";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    Scroll,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      homeitemlistener: null,
      themeTopys: [],
      currentIndex: 0,
      isShowBackTop: false,
      // getCart: {},
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片轮播数据

      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    }),
      //请求推荐数据
      getRecommend().then((res) => {
        this.recommends = res.data.list;
      });
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    imageLoad() {
      this.$refs.scroll.refresh();

      this.themeTopys = [];

      this.themeTopys.push(0);
      this.themeTopys.push(this.$refs.params.$el.offsetTop);
      this.themeTopys.push(this.$refs.comment.$el.offsetTop);
      this.themeTopys.push(this.$refs.recommends.$el.offsetTop);

      // console.log(this.themeTopys)
    },
    titleclick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopys[index], 100);
    },
    contentScroll(position) {
      //获取y值
      const positionY = -position.y;
      let length = this.themeTopys.length;

      for (let i = 0; i < length; i++) {
        if (
          (i < length - 1 &&
            positionY > this.themeTopys[i] &&
            positionY < this.themeTopys[i + 1]) ||
          (i == length - 1 && positionY > this.themeTopys[i])
        ) {
          if (this.currentIndex != i) {
            this.currentIndex = i;

            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
      }

      //是否显示回到顶部
      this.isShowBackTop = -position.y > 1000;
    },
    toCart() {
      // this.getCart();
      // this.$router.push("/cart");
    },
    addToCart() {
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.detailInfo.desc
      product.price = this.goods.realPrice
      product.iid = this.iid


      this.$store.commit('addCart',product)

    },
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50);

    //2.对监听的事件进行一个保存
    this.homeitemlistener = () => {
      refresh();
    };

    this.$bus.$on("imageLoad", this.homeitemlistener);
  },
  destroyed() {
    this.$bus.$off("imageLoad", this.homeitemlistener);
  },
  updated() {},
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 95px);
}
</style>
