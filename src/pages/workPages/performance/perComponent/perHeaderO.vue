<template>
  <div id="perHeaderO">
    <header ref="headerHeight">
      <div class="choose_box">
        <span class="chooseSpace">选择范围</span>
        <span class="chooseVal" @click="showGuideName = !showGuideName">
          <span>{{showSelectName | dealName}}</span>
          <!-- ZHG内蒙兴安万达广场乌兰浩特市札萨克图西街店 -->
          <span class="icon-circle-down" v-show="!showGuideName"></span>
          <span class="icon-circle-up" v-show="showGuideName"></span>
        </span>
      </div>
      <div class="mask" v-show="showGuideName">
        <div class="box">
          <div class="allPerson" ref="personHeight">
            <input type="text" v-model="searchShopValue" placeholder="请输入门店名称">&nbsp;&nbsp;&nbsp;<span @click="getShopList">搜索</span>
            <a class="person" :class="perOrAll == 'P' ? 'active' : ''" @click="getPersonal">
              个人
            </a>
            <a class="person" :class="perOrAll == 'A' ? 'active' : ''" @click="getAllShop">
              全部
            </a>
            <div v-if="shopList.length > 0" class="shop-list">
              <a class="list" v-for="(item,index) in shopList" :key="item.id" :class="item.id == selectId ? 'activeShop' : ''" @click="getShopInfo(index,item.id,item.name)">
                {{item.name}}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <footer></footer>
  </div>
</template>
<script>
export default {
  name: 'perHeaderO',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shopList: [],
      perOrAll: 'A',
      //选中的导购id
      selectId: 0,
      showSelectName: '全部',
      showGuideName: false,
      searchShopValue: ''
    }
  },
  watch: {
    showGuideName(vN) {
      this.$emit('getOpenSelect', vN)
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    /**
     * 获取区经下的所有门店
     */
    getShopList() {
      this.$api.get('/shoplist', {
        guideId: this.id,
        name: this.searchShopValue
      }, res => {
        // console.log(res)
        if (res.errcode == 0) {
          if (res.data.length != 0) {
            this.shopList = res.data
          } else {
            this.$messagebox('', '未搜索到该门店')
          }
        }
      }, err => {
        console.log(err)
      })
    },
    /**
     * 获取全部综合信息
     */
    getAllShop() {
      this.perOrAll = 'A'
      this.selectId = 0
      this.showSelectName = '全部'
      this.searchShopValue = ''
      this.showGuideName = false
      this.$emit('devType', 'PROVINCE')
      this.getShopList()
    },
    /**
     * 获取个人数据
     */
    getPersonal() {
      this.perOrAll = 'P'
      this.selectId = 0
      this.searchShopValue = ''
      this.showSelectName = '个人'
      this.showGuideName = false
      this.$emit('devType', 'SHOPGUIDE')
      this.getShopList()
    },
    /**
     * 获取门店数据
     */
    getShopInfo(index, id, name) {
      this.perOrAll = ''
      this.selectId = id
      this.showSelectName = name
      const data = {
        shopId: id,
        shopType: 'SHOP'
      }
      this.$emit('delShop', data)
      this.showGuideName = false
    },
  },
  filters: {
    dealName(name) {
      if (name.length < 18) {
        return name
      } else {
        let finalName = `${name.substr(0, 18)}...`
        return finalName
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/icomoon/style.css";
@import "../../../../style/scss/perHeaderO.scss";
</style>