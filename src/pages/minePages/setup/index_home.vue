<template>
  <div id="index_home">
    <div id="footer" class="backgroundCom">
      <ul>
        <li @click="tab_leftClick">
          <div class="work_img">
            <img
              :src="
                index_leftV
                  ? require('../../../static/image/work_blue.png')
                  : require('../../../static/image/work_gray.png')
              "
              class="footer_work"
              alt
            />
          </div>
          <p :class="index_leftV ? 'index_active' : 'index_normal'">工作台</p>
        </li>
        <div id="footer_line"></div>
        <li @click="tab_rightClick">
          <div class="my_img">
            <img
              :src="
                mine_LeftV
                  ? require('../../../static/image/my_blue.png')
                  : require('../../../static/image/my_gray.png')
              "
              class="footer_my"
              alt
            />
          </div>
          <p :class="mine_LeftV ? 'index_active' : 'index_normal'">我的</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "index_home",
  props: ["index_leftV", "mine_LeftV"],
  methods: {
    /**
     * 切换工作台
     */
    tab_leftClick() {
      const that = this;
      that.$router.push({
        path: "/",
      });
    },

    /**
     * 切换我的
     */
    tab_rightClick() {
      const that = this;
      that.$router.push({
        path: "/mine",
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/index_home";
</style>
