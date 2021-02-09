<template>
  <div id="assignStaff">
    <div v-for="item in list" :key="item.id">
      <!-- 个人资料 -->
      <div class="personInfo">
        <div class="assign">
          <img :src="item.avatar ? item.avatar : imgCom" alt />
        </div>
        <div class="assign_info">
          <div class="name">
            {{ item.name }}
            <span>{{ item.position }}</span>
          </div>
          <div class="store">{{ item.shopName }}</div>
          <div class="phone">{{ item.phone }}</div>
        </div>
      </div>
      <!-- 分配员工 -->
      <div class="severalStaff">该员工名下现有{{ item.memberNum }}名会员</div>
      <div class="companyCollection">
        <ul>
          <li @click="companyCollection">
            <p>
              公司收回
              <span>取消上级分销员</span>
            </p>
          </li>
          <li @click="storeAllocation">
            <p>
              店内分配
              <span>{{ item.shopName }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "assignStaff",
  data() {
    return {
      imgCom: require("../../../static/image/nodata_people.png"),
      list: [],
      state: "",
    };
  },
  created() {
    this.getParams();
    this.state = this.$route.query.state;
  },

  watch: {
    // 如果路由有变化，会再次执行该方法
    $route(to, from) {
      if (this.$route.path == "assignStaff") {
        this.getParams();
      }
    },
  },

  methods: {
    getParams() {
      const that = this;
      // 取到路由带过来的参数
      const routerParams = JSON.parse(this.$route.query.list);
      that.list.length = 0;
      that.list = [];
      that.list.push(routerParams);
    },

    // 公司回收
    companyCollection() {
      const that = this;
      that.$messagebox
        .confirm("", {
          message: "确认后，该账号员工将被冻结",
          title: "公司收回",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            that.$api.get(
              "my/dimission",
              {
                guideId: that.list[0].id,
                memberType: 0,
                requestName: that.list[0].id,
              },
              (res) => {
                // console.log(res);
                if (res.errcode == 0) {
                  that.$toast({
                    message: "操作成功",
                    iconClass: "icon icon-success",
                    duration: 1500,
                  });
                  setTimeout(function () {
                    that.$router.go(-1); //返回上一层
                  }, 1500);
                }
              }
            );
          }
        })
        .catch((err) => {
          //取消的回调
          if (err == "cancel") {
            console.log("取消");
          }
        });
    },

    // 店内分配
    storeAllocation() {
      const that = this;
      that.$router.push({
        path: "storeAllocation",
        query: {
          id: that.list[0].id,
          memberNum: that.list[0].memberNum,
          state: that.state,
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/assignStaff";
</style>
