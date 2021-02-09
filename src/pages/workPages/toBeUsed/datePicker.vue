<!--
    "vue-calendar-component": "^2.7.1",-->
<template>
  <div id="datePicker">
    <div class="contain">
      <ul class="choose_date">
        <li class="thisday" :key="index" @click="choose(index);toggle(index)" v-for="(item,index) in optionList" :class="index == checkindex ? 'active' : ''">{{ item.txt }}</li>
      </ul>
    </div>
    <p class="time" :class=' custom==true?"active":"" '>{{ timeVal }}</p>
    <ul class="user_edit">
      <li @click="beginTime">{{begin?begin:'开始时间'}}</li>
      <li @click="endTime">{{end?end:'结束时间'}}</li>
    </ul>

    <mt-datetime-picker type="date" ref='picker' year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm" confirmText='开始时间' v-model="startDate">
    </mt-datetime-picker>
    <mt-datetime-picker type="date" ref='picker2' year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm2" confirmText='结束时间' v-model="startDate">
    </mt-datetime-picker>
  </div>
</template>

<script>
import {
  MessageBox
} from 'mint-ui';
export default {
  name: "memberList",
  data() {
    return {
      //层级
      confirm: true,
      touchBol: true,
      startDate: new Date(),
      //默认第一个
      checkindex: 0,
      optionShow: false,
      optionSecondShow: false,
      timeVal: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) :
        new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date()
          .getDate()),
      custom: false,
      //初始化日期
      defaultDate: new Date(),
      //时间戳对比
      time1: '',
      time2: '',

      //筛选条件
      dateType: 'one',
      //开始时间
      begin: '',
      //结束时间
      end: '',

      optionList: [{
        txt: '今日',
      },
      {
        txt: '本周',
      },
      {
        txt: '本月',
      },
      {
        txt: '自定义',
      }
      ]
    }
  },
  methods: {
    //active样式
    toggle(index) {
      this.checkindex = index
    },
    //选择类型
    choose(index) {
      switch (index) {
        case 0:
          this.thisday();
          break;
        case 1:
          this.thisweek();
          break;
        case 2:
          this.thismonth();
          break;
        case 3:
          this.userEdit();
          break;
        default:
          break;
      }
    },
    //选择本日
    thisday() {
      var that = this;
      that.custom = false;
      that.defaultDate = new Date();
      that.dateType = 'one';
      var day = that.defaultDate.getFullYear() + '-' + ((that.defaultDate.getMonth() + 1) < 10 ? '0' + (that.defaultDate.getMonth() +
        1) : that.defaultDate.getMonth() + 1) + '-' + (that.defaultDate.getDate() - 1 < 10 ? '0' + (that.defaultDate.getDate() -
          1) : that.defaultDate.getDate() - 1);
      that.timeVal = day;
      that.touchBol = true;
      this.$emit("sendday", [that.dateType, that.touchBol]);
      that.confirm = true;
      $('.user_edit').slideUp(400);
    },

    //选择本周
    getTime(n) {
      var that = this;
      that.defaultDate = new Date();
      var year = that.defaultDate.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      var month = that.defaultDate.getMonth() + 1;
      var date = that.defaultDate.getDate();
      var day = that.defaultDate.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if (day !== 0) {
        n = n + (day - 1);
      } else {
        n = n + day;
      }
      if (day) {
        if (month > 1) {
          month = month;
        }
        //这个判断是为了解决跨年的问题,月份是从0开始的
        else {
          year = year - 1;
          month = 12;
        }
      }
      that.defaultDate.setDate(that.defaultDate.getDate() - n);
      year = that.defaultDate.getFullYear();
      month = that.defaultDate.getMonth() + 1;
      date = that.defaultDate.getDate();
      var s = year + "-" + (month < 10 ? '0' + month : month) + "-" + (date < 10 ? '0' + date : date);
      return s;
    },
    thisweek() {
      var that = this;
      that.dateType = 'two';
      that.timeVal = that.getTime(0) + '~' + that.getTime(-6);
      that.touchBol = true;
      this.$emit("sendweek", [that.dateType, that.getTime(0), that.getTime(-6), that.touchBol]);
      // that.confirm = true;
      $('.user_edit').slideUp(400);
    },
    //选择本月
    thismonth() {
      var that = this;
      that.custom = false;
      that.defaultDate = new Date();
      that.dateType = 'three';
      var month = that.defaultDate.getFullYear() + '-' + (that.defaultDate.getMonth() + 1 < 10 ? '0' + (that.defaultDate.getMonth() +
        1) : that.defaultDate.getMonth() + 1);
      that.timeVal = month;
      that.confirm = true;
      $('.user_edit').slideUp(400);
      that.touchBol = true;
      this.$emit("sendmonth", [that.dateType, that.touchBol]);
    },

    //自定义
    userEdit() {
      var that = this;
      that.custom = !that.custom;
      that.dateType = 'four';
      that.touchBol = !that.touchBol;
      this.$emit("sendtype", [that.dateType, that.touchBol]);
      that.confirm = false;
      $('.user_edit').slideToggle(400);

    },
    //开始时间
    beginTime() {
      var that = this;
      that.openPicker();
    },
    //结束时间
    endTime() {
      var that = this;
      that.openPicker2();
    },
    //打开自定义
    openPicker() {
      var that = this;
      this.$refs.picker.open();
      that.confirm = false;
    },
    //打开自定义2
    openPicker2() {
      var that = this;
      that.$refs.picker2.open();
      that.confirm = false;
      console.log('asdsa')
    },
    //开始时间
    handleConfirm(e) {
      var that = this;
      that.custom = false;
      that.confirm = true;
      that.time1 = e;
      that.begin = e.getFullYear() + '-' + (e.getMonth() + 1 < 10 ? '0' + (e.getMonth() + 1) : e.getMonth() + 1) + '-' +
        (e.getDate() < 10 ? '0' + (e.getDate()) : e.getDate());
      that.timeVal = that.begin + '至' + that.end;

      if (that.time2) {
        if (that.time2 >= that.time1) {
          that.touchBol = true;
          this.$emit("sendbegin", [that.begin, that.touchBol]);
          $('.user_edit').slideUp(400);

        } else {
          MessageBox({
            title: '警告',
            message: '选择的结束时间不得小于开始时间！',
            showCancelButton: false
          });
        }
      } else {
        this.$refs.picker2.open();
        this.$emit("sendbegin", [that.begin, that.touchBol]);
      }
    },
    //结束时间
    handleConfirm2(e) {
      var that = this;
      that.time2 = e;
      that.custom = false;
      that.confirm = true;
      console.log(that.end)
      that.end = e.getFullYear() + '-' + (e.getMonth() + 1 < 10 ? '0' + (e.getMonth() + 1) : e.getMonth() + 1) + '-' + (e
        .getDate() < 10 ? '0' + (e.getDate()) : e.getDate());
      that.timeVal = that.begin + '至' + that.end;

      if (that.time1) {
        if (that.time2 >= that.time1) {
          that.touchBol = true;
          this.$emit("sendend", [that.end, that.touchBol]);
          $('.user_edit').slideUp(400);
        } else {
          MessageBox({
            title: '警告',
            message: '选择的结束时间不得小于开始时间！',
            showCancelButton: false
          });
        }
      } else {
        this.$refs.picker.open();
        this.$emit("sendend", [that.end, that.touchBol]);
      }
    }
  },
  mounted() {
    $('.user_edit').slideUp(0)
  }
}
</script>

<style lang="scss">
@import "../../../style/scss/datePicker";
</style>
