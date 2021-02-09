<template>
  <div ref="wrapper" class="scroll-wrap">
    <div class="content">
      <slot></slot>
      <div v-if="!nullDataAll">
        <div v-if="pullup" class="pullup">
          <div class="clear" v-if="isDone">
            <p class="page-infinite-loading">
              <span>
                <div class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
              </span>
            </p>
          </div>
          <div class="page-infinite-loading" v-else>暂无更多数据</div>
        </div>
      </div>
      <div class="nullDataPage" v-if="nullDataAll">
        <div class="nullData">
          <img src="../static/image/null_logo.png" alt />
          <p>暂时还没有数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    nullDataAll: {
      type: Boolean,
      default: false,
    },

    isDone: {
      type: Boolean,
      default: false,
    },

    probeType: {
      type: Number,
      default: 3,
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false,
    },

    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: true,
    },
    /**
     * 列表数据
     */
    data: {
      type: [Object, Array, String],
      default: null,
    },

    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    deforeScroll: {
      type: Boolean,
      default: false,
    },
    /**
     * 当数据更新后,刷新scroll延时
     */
    refreshDelay: {
      type: Number,
      default: 20,
    },

    // 页数
    page: {
      type: [Number, Boolean],
      default: 1,
    },

    /**
     * 是否显示下拉条
     */
    isShowOver: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // dragTip: {
      //   text: "下拉刷新",
      //   translate: -50,
      //   showLoding: false
      // },
      // isLoading: false,
      isLoading: true,
      nullDataLeft: false,
      text: "上拉加载",
    };
  },
  mounted() {
    this.$nextTick(function () {
      setTimeout(() => {
        this._initScroll();
      }, 20);
    });
  },
  methods: {
    //mounted初始时调用的方法
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        //number 实时监测滚动的位置
        probeType: this.probeType,
        //better-scroll 默认会阻止浏览器的原生 click 事件。
        click: true,
        //开启纵向滚动
        scrollY: true,
        scrollbar: this.isShowOver,
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        let me = this;
        //绑定滚动事件
        this.scroll.on("scroll", (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
          // console.log(this.scrollY );
          if (this.listenScroll) {
            //发射scroll事件
            me.$emit("scroll", -this.scrollY);
          }
        });
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 30) {
            //所有数据加载完毕后
            this.$on("infinitescroll.loadedDone", () => {
              // console.log("所有数据加载完毕后");

              this.isLoading = false;
            });
            //单次请求数据加载完毕后
            this.$on("infinitescroll.finishLoad", () => {
              // console.log("单次请求数据加载完毕后");
              this.isLoading = true;
            });
            //重新初始化
            this.$on("infinitescroll.reInit", () => {
              // console.log("重新初始化");
              this.isLoading = true;
            });
            this.$emit("scrollToEnd");

            this.scroll.refresh();
          }
        });
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },

    //禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
    disable() {
      this.scroll && this.scroll.disable();
    },
    //启用 better-scroll, 默认 开启
    enable() {
      this.scroll && this.scroll.enable();
    },
    //重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    //滚动到指定的位置 scrollTo(x, y, time, easing)
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    //滚动到指定的目标元素 scrollToElement(el, time, offsetX, offsetY, easing)
    // {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
    // {Number} time 滚动动画执行的时长（单位 ms）
    // {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
    // {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
    // {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
  },

  watch: {
    // 监听data数组
    isDone(val) {
      this.isLoading = val;
      setTimeout(() => {
        this.refresh();
        // console.log("this.refresh");
        // console.log(this.refresh);
        //   new BScroll(this.$refs.wrapper, {
        //     probeType: this.probeType,
        //     scrollY: true,
        //     click: true,
        //   })
      }, this.refreshDelay);
    },
  },
};
</script>

<style lang="scss">
.scroll-wrap {
  height: 100%;
  overflow: hidden;
  /* 下拉刷新 */
  .pulldown,
  .pullup {
    width: 100%;
    height: 2rem;
  }
  .page-infinite-loading{
    background: #f0f0ef;
    padding: .8rem 0  .8rem 0;
  }
}
</style>
