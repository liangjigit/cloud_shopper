<template>
  <div id="perHeaderT">
    <header ref="headerHeight">
      <div class="choose_box">
        <span class="chooseSpace">选择范围</span>
        <span class="chooseVal" @click="showGuideName = !showGuideName">
          <span>{{showSelectName}}</span>
          <span class="icon-circle-down" v-show="!showGuideName"></span>
          <span class="icon-circle-up" v-show="showGuideName"></span>
        </span>
      </div>
      <div class="mask" v-show="showGuideName">
        <div class="box">
          <div class="allPerson" ref="personHeight">
            <a class="person" v-for="(item,index) in guideList" :key="item.guideId" :class="item.guideId == selectId ? 'active' : ''" @click="getGuideInfo(index,item.guideId)">
              {{item.name}}
            </a>
          </div>
        </div>
      </div>
    </header>
    <footer></footer>
  </div>
</template>
<script>
export default {
  name: 'perHeaderT',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      guideList: [],
      all: [{
        guideId: '0',
        name: '全部'
      }],
      //选中的导购id
      selectId: 0,
      showSelectName: '全部',
      showGuideName: false
    }
  },
  created() {
    this.getShopGuide()
  },
  watch: {
    showGuideName(vN) {
      this.$emit('getOpenSelect', vN)
    }
  },
  methods: {
    /**
     * 店长查询门店导购
     */
    getShopGuide() {
      this.$api.get('/guideList', {
        guideId: this.id
      }, res => {
        // console.log(res)
        if (res.errcode == 0) {
          this.guideList = [...this.all, ...res.data]
        }
      }, err => {
        console.log(err)
      })
    },
    /**
     * 获取个人数据
     */
    getGuideInfo(index, id) {
      this.selectId = id
      this.showSelectName = this.guideList[index].name
      this.$emit('deliveryId', id)
      this.showGuideName = false
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/icomoon/style.css";
@import "../../../../style/scss/perHeader.scss";
</style>