<template>
  <div id="storeAllocation">
    <div class="store_title">
      <span>{{ memberNum }}名会员 店内分配</span>
      <span class="rapidDistribution" @click="rapidDistribution">快速分配</span>
    </div>
    <div class="store_list">
      <div class="store_listTitle">
        <div>员工</div>
        <div>分配数（人）</div>
      </div>
    </div>
    <div class="storeAllocation_list">
      <scroll ref="pullrefresh">
        <ul>
          <li v-for="(item, index) in DataList" :key="item.id" :id="item.id">
            <div class="store_list_li">
              <img :src="item.avatar ? item.avatar : imgCom" alt />
              <div>{{ item.name }}</div>
              <div class="subtract_info">
                <span
                  class="subtract_before"
                  @click="subtract_before(index)"
                ></span>
                <input
                  type="number"
                  min="0"
                  :max="memberNum"
                  :value="item.value"
                  @input="input($event, index)"
                />
                <span
                  class="subtract_after"
                  @click="subtract_after(index)"
                ></span>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="footer">
      <div class="undistributed">
        还未分配：
        <span>{{ allocation }}人</span>
      </div>
      <div class="allocationBtn" @click="allocationBtn">
        {{ state == "0" ? "分配并调店" : "分配并离职" }}
      </div>
    </div>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "storeAllocation",
  components: { scroll },
  data() {
    return {
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      imgCom: require("../../../static/image/nodata_people.png"),
      pageSize: 1,
      // 员工数组
      DataList: [],
      // 待分配会员个数
      memberNum: 0,
      // 未分配人数
      allocation: 0,
      // 输入框总人数
      total: 0,
      //判断state
      state: "",
      //  员工id
      ids: "",
      //  分配个数
      memmberList: "",
    };
  },

  created() {
    const that = this;
    that.state = that.$route.query.state;
    let user = localStorage.getItem("user");
    that.MEMBERID = user.replace(/\"/g, "");
    that.getDataList();
  },

  methods: {
    // 列表数据
    getDataList() {
      const that = this;
      let ids = "";
      that.$api.post(
        "my/getEmployeeList",
        {
          guideId: that.MEMBERID,
          stopguideId: that.$route.query.id,
          page: that.pageSize,
          size: 10,
          type: 0,
          // requestName: that.page
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            that.DataList = res.data;
            const list = res.data;
            list.forEach((item) => {
              //将当前分配初始化为0
              item.value = 0;
              ids += item.id + ",";
            });
            that.ids = ids.substr(0, ids.length - 1);
            // console.log(that.ids);
            // console.log(that.$route);
            //当前活跃路由待分配的人数
            that.memberNum = that.$route.query.memberNum;
            //当前活跃路由还未分配的人数
            that.allocation = that.$route.query.memberNum;
          }
        }
      );
    },

    //分配人数减
    subtract_before(index) {
      const that = this;
      //待分配人数
      let memberNum = ~~that.memberNum;
      let iptVal = ~~that.DataList[index].value;
      that.DataList[index].value = iptVal;
      // total 值小于总数可++
      if (that.sumVal() > 0) {
        iptVal > 0 ? iptVal-- : (iptVal = 0);
        that.DataList[index].value = iptVal;
        that.allocation = memberNum - that.sumVal();
      }
    },

    //分配人数加
    subtract_after(index) {
      const that = this;
      //待分配人数
      let memberNum = ~~that.memberNum;
      let iptVal = ~~that.DataList[index].value;
      that.DataList[index].value = iptVal;
      // total 值小于总数可++
      if (that.sumVal() < memberNum) {
        iptVal++;
        that.DataList[index].value = iptVal;
        that.allocation = memberNum - that.sumVal();
      }
    },

    // 输入值之和
    sumVal() {
      const that = this;
      let total = 0;
      that.DataList.forEach((item) => {
        //获取输入框内人数之和
        total += ~~item.value;
      });
      return total;
    },

    //输入框值
    input($event, index) {
      const that = this;
      //待分配人数
      let memberNum = ~~that.memberNum;
      //输入值
      let value = ~~$event.target.value;
      //修改值之前总和
      let oldVal = that.sumVal();
      that.DataList[index].value = value;
      //不能超出待分配人数
      let num = that.sumVal() - memberNum > 0 ? memberNum - oldVal : value;
      that.DataList[index].value = num;
      $event.target.value = num;
      // that.$set(that.DataList[index], "value", num);
      //还未分配的人数
      that.allocation = memberNum - that.sumVal();
    },

    // 快速分配
    rapidDistribution() {
      const that = this;
      //待分配人员
      let rest = that.memberNum;
      let memberList = "";
      let nums = that.DataList.length;
      let result = Array.apply(null, {
        //生成datalist长度的空数组
        length: nums,
      })
        .map((n, i) => nums - i)
        .map((n) => {
          const v = 1 + Math.floor(Math.random() * ((rest / n) * 2 - 1));
          rest -= v;
          return v;
        });
      result[nums - 1] += rest;
      for (let i = 0; i < that.DataList.length; i++) {
        let list = that.DataList[i];
        list.value = result[i];
        memberList += result[i] + ",";
      }
      that.memberList = memberList.substr(0, memberList.length - 1);
      // console.log(that.memberList);
      that.allocation = 0;
    },

    // 分配并离职  分配并调店
    allocationBtn() {
      if (this.state == 1) {
        const that = this;
        if (that.allocation !== 0) {
          that.$messagebox.alert("你有会员还未分配！");
        } else {
          that.$messagebox
            .confirm("", {
              message: "确认后，该账号员工将被冻结？",
              title: "分配会员",
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
            .then((action) => {
              //确认的回调
              if (action == "confirm") {
                that.$indicator.open();
                that.memmberList = that.DataList.map(function (item) {
                  return item.value;
                }).join(",");
                console.log(that.memmberList);
                that.$api.get(
                  "my/dimission",
                  {
                    guideId: that.$route.query.id,
                    memberType: 1,
                    ids: that.ids,
                    memberNum: that.memmberList,
                  },
                  (res) => {
                    console.log(res);
                    if (res.errcode == 0) {
                      that.$indicator.close();
                      that.$toast({
                        message: "分配成功",
                        iconClass: "icon icon-success",
                        duration: 1500,
                      });
                      setTimeout(function () {
                        that.$router.go(-2); //返回上一层
                      }, 1500);
                    }
                  }
                );
              }
            })
            .catch((err) => {
              //取消的回调
              that.$indicator.close();
              if (err == "cancel") {
                console.log("取消");
              }
            });
        }
      } else {
        const _this = this;
        if (_this.allocation !== 0) {
          _this.$messagebox.alert("你有会员还未分配！");
        } else {
          _this.$indicator.open();
          const obj = {};
          // console.log(_this.DataList);
          _this.DataList.forEach(function (item, index, arr) {
            obj[item.id] = item.value;
            if (_this.DataList.length - 1 == index) {
              // console.log(JSON.stringify(obj));
              _this.$api.post(
                "my/changeStoresDistribution",
                {
                  userId: _this.$route.query.userId,
                  guideId: _this.$route.query.id,
                  changeShopId: _this.$route.query.changeShopId,
                  distributionInfo: JSON.stringify(obj),
                },
                (res) => {
                  _this.$indicator.close();
                  _this.$messagebox.alert("操作成功").then((action) => {
                    // console.log(res);
                    if (res.errcode == 0) {
                      _this.$router.go(-2);
                    }
                  });
                },
                (err) => {
                  // console.log(err);
                  _this.$indicator.close();
                  let errCode = err.errcode;
                  let errMsg = err.errmsg;
                  switch (errCode) {
                    case "103":
                      _this.$messagebox("提示", errMsg);
                      break;
                    case "513":
                      _this.$messagebox("提示", errMsg);
                      break;
                    case "514":
                      _this.$messagebox("提示", errMsg);
                      break;
                  }
                }
              );
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/storeAllocation";
</style>
