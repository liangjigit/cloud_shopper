<template>
  <div id="app">
    <keep-alive>
      <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件 -->
      </router-view>
    </keep-alive>
    <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件 -->
    </router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      isShow: true,
    };
  },
};
</script>

<style lang="scss">
//@import "" 引用less时使用的方法
@import "./style/common";
</style>
