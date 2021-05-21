import Vue from 'vue'
import VueRouter from 'vue-router'

// 光引用不成，还得使用
Vue.use(VueRouter)

export default new VueRouter({
  // mode: 'hash',
  // mode: 'history',
  // 正式服
  //  base: '/crm/vue/',
  //    测试服
  base: '/crm/',
  routes: [{
      // 首页
      path: '/',
      name: 'index',
      component: () => import('@/pages/index'),
      meta: {
        title: '导购助手',
        auth: true,
        keepAlive: true, //需要缓存
        isBack: false, //用于判断上一个页面是哪个
      }
    },
    {
      //登录
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login'),
      meta: {
        title: '登录',
        keepAlive: false, //此组件不需要被缓存
      }
    },
    {
      // 修改密码
      path: '/changePsd',
      name: 'changePsd',
      component: () => import('@/pages/minePages/setup/changePsd'),
      meta: {
        title: '修改密码',
        keepAlive: false, //此组件不需要被缓存
      }
    },
    {
      // 设置新密码
      path: '/newPsd',
      name: 'newPsd',
      component: () => import('@/pages/minePages/setup/newPsd'),
      meta: {
        title: '设置新密码',
        keepAlive: false, //此组件不需要被缓存
      }
    },
    {
      // 个人中心
      path: '/mine',
      name: 'mine',
      component: () => import('@/pages/minePages/setup/mine'),
      meta: {
        title: '导购助手',
        keepAlive: true,
        isBack: false, //用于判断上一个页面是哪个
      }
    },
    {
      // 我的-设置
      path: '/setUp',
      name: 'setUp',
      component: () => import('@/pages/minePages/setup/setUp'),
      meta: {
        title: '设置',
        keepAlive: false,
      }
    },
    {
      // 我的二维码
      path: '/myQRCode',
      name: 'myQRCode',
      component: () => import('@/pages/minePages/myEmployees/myQRCode'),
      meta: {
        title: '我的二维码',
        keepAlive: false,
      }
    },
    {
      // 我的-我的员工
      path: '/myEmployees',
      name: 'myEmployees',
      component: () => import('@/pages/minePages/myEmployees/myEmployees'),
      meta: {
        title: '我的员工',
        keepAlive: false,
      }
    },
    {
      //我的-在职员工-调店
      path: '/changeShop',
      name: 'changeShop',
      component: () => import('@/pages/minePages/myEmployees/changeShop'),
      meta: {
        title: '更换导购归属门店',
        keepAlive: false
      }
    },
    {
      // 分配员工
      path: '/assignStaff',
      name: 'assignStaff',
      component: () => import('@/pages/minePages/myEmployees/assignStaff'),
      meta: {
        title: '我的员工',
        keepAlive: false,
      }
    },
    {
      // 分配员工
      path: '/storeAllocation',
      name: 'storeAllocation',
      component: () => import('@/pages/minePages/myEmployees/storeAllocation'),
      meta: {
        title: '我的员工',
        keepAlive: false,
      }
    },
    {
      //首页-我的会员
      path: '/memberListScreening',
      name: 'memberListScreening',
      component: () => import('@/pages/workPages/listFiltering/memberListScreening'),
      meta: {
        title: '我的会员',
        keepAlive: false, //此组件不需要被缓存
      }
    },
    {
      //会员列表页面 better-scroll
      path: '/listFiltering',
      name: 'listFiltering',
      component: () => import('@/pages/workPages/listFiltering/listFiltering'),
      meta: {
        title: '筛选列表',
        keepAlive: true,
        isBack: false, //用于判断上一个页面是哪个
      }
    },
    {
      //会员标签-选择标签
      path: '/tags',
      name: 'tags',
      component: () => import('@/pages/workPages/listFiltering/tags'),
      meta: {
        title: '筛选标签',
        keepAlive: false
      }
    },
    {
      //待绑定会员分类邀约详细数据
      path: '/classInvite',
      name: 'classInvite',
      component: () => import('@/pages/workPages/classInvite/classInvite'),
      meta: {
        title: '分类邀约',
        keepAlive: false,
      }
    },
    {
      //邀约管理
      path: '/management',
      name: 'management',
      component: () => import('@/pages/workPages/classInvite/management'),
      meta: {
        title: '邀约管理',
        keepAlive: false, //此组件不需要被缓存
      },

    },
    {
      //待绑定会员分类邀约详细数据
      path: '/inviteListJ',
      name: 'inviteListJ',
      component: () => import('@/pages/workPages/classInvite/inviteListJ'),
      meta: {
        title: '分类邀约',
        keepAlive: false,
      }
    },
    {
      //卡券发放
      path: '/cardIssue',
      name: 'cardIssue',
      component: () => import('@/pages/workPages/cardIssue/cardIssue'),
      meta: {
        title: '卡券发放',
        keepAlive: false
      }
    },
    {
      //卡券发放
      path: '/cardIssueTo',
      name: 'cardIssueTo',
      component: () => import('@/pages/workPages/cardIssue/cardIssueTo'),
      meta: {
        title: '卡券发放',
        keepAlive: false
      }
    },
    {
      //绑定查询/修改绑定关系
      path: '/allMembers',
      name: 'allMembers',
      component: () => import('@/pages/workPages/listFiltering/allMembers'),
      meta: {
        title: '所有会员',
        keepAlive: false
      }
    },
    {
      //待绑定会员
      path: '/pendingMember',
      name: 'pendingMember',
      component: () => import('@/pages/workPages/pendingMember/pendingMember'),
      meta: {
        title: '待绑定会员',
        keepAlive: false
      }
    },
    {
      //待绑定会员筛选
      path: '/pendingMemberFilter',
      name: 'pendingMemberFilter',
      component: () => import('@/pages/workPages/pendingMember/pendingMemberFilter'),
      meta: {
        title: '待绑定会员',
        keepAlive: true,
        isBack: false //用于判断上一个页面是哪个
      }
    },
    {
      //客户资料
      path: '/customerInformation',
      name: 'customerInformation',
      component: () => import('@/pages/workPages/customerInformation/customerInformation'),
      meta: {
        title: '客户资料',
        keepAlive: false
      },
    },
    {
      //新增标签
      path: '/addTag',
      name: 'addTag',
      component: () => import('@/pages/workPages/customerInformation/addTag/addTag'),
      meta: {
        title: '新增标签',
        keepAlive: false
      }
    },
    {
      //我的会员当前积分页
      path: '/currentScore',
      name: 'currentScore',
      component: () => import('@/pages/workPages/customerInformation/currentScore/currentScore'),
      meta: {
        title: '当前积分',
        keepAlive: false,
      }
    },
    {
      //新增邀约
      path: '/newOffer',
      name: 'newOffer',
      component: () => import('@/pages/workPages/customerInformation/newOffer/newOffer'),
      meta: {
        title: '新增邀约',
        keepAlive: false,
      }
    },
    {
      //修改绑定会员
      path: '/replaceSuperior',
      name: 'replaceSuperior',
      component: () => import('@/pages/workPages/customerInformation/replaceSuperior/replaceSuperior'),
      meta: {
        title: '更换上级销售员',
        keepAlive: false
      }
    },

    {
      //卡券查看更多
      path: '/seeMoreCoupon',
      name: 'seeMoreCoupon',
      component: () => import('@/pages/workPages/customerInformation/seeMore/seeMoreCoupon'),
      meta: {
        title: '卡券',
        keepAlive: false
      }
    },
    {
      //邀约回访查看更多
      path: '/seeMoreInvitation',
      name: 'seeMoreInvitation',
      component: () => import('@/pages/workPages/customerInformation/seeMore/seeMoreInvitation'),
      meta: {
        title: '邀约记录',
        keepAlive: false
      }
    },
    {
      //门店，线上查看更多
      path: '/seeMoreOrder',
      name: 'seeMoreOrder',
      component: () => import('@/pages/workPages/customerInformation/seeMore/seeMoreOrder'),
      meta: {
        title: '更多订单',
        keepAlive: false
      }
    },
    {
      //选择短信模板
      path: '/selectNote',
      name: 'selectNote',
      component: () => import('@/pages/workPages/customerInformation/sendNote/selectNote'),
      meta: {
        title: '短信模板',
        keepAlive: false
      }
    },
    {
      //修改短信模板
      path: '/sendNote',
      name: 'sendNote',
      component: () => import('@/pages/workPages/customerInformation/sendNote/sendNote'),
      meta: {
        title: '编辑短信',
        keepAlive: false
      }
    },
    {
      // 订单管理
      path: '/orderManagement',
      name: 'orderManagement',
      component: () => import('@/pages/workPages/orderManagement/orderManagement'),
      meta: {
        title: '订单管理',
        keepAlive: true,
        isBack: false, //用于判断上一个页面是哪个
      },
    },
    {
      // 订单详情
      path: '/orderDetails',
      name: 'orderDetails',
      component: () => import('@/pages/workPages/orderManagement/orderDetails'),
      meta: {
        title: '订单详情',
        keepAlive: false,
      }
    },
    {
      //业绩管理
      path: '/performance',
      name: 'performance',
      component: () => import('@/pages/workPages/performance/performance'),
      meta: {
        title: '业绩管理',
        keepAlive: false
      }
    },
    {
      //区域邀约管理
      path: '/areaManage',
      name: 'areaManage',
      component: () => import('@/pages/workPages/areaManage/areaManage'),
      meta: {
        title: '区域邀约管理',
        keepAlive: false
      }
    },
    {
      //区域邀约管理
      path: '/inviteShow',
      name: 'inviteShow',
      component: () => import('@/pages/workPages/areaManage/inviteShow'),
      meta: {
        title: '邀约管理',
        keepAlive: false
      }
    },
    {
      //从首页进入佣金详情
      path: '/moneyDetail',
      name: 'moneyDetail',
      component: () => import('@/pages/workPages/moneyDetail/moneyDetail'),
      meta: {
        title: '佣金明细',
        keepAlive: false
      }
    },
    {
      //退货详情
      path: '/tuiHuoDetail',
      name: 'tuiHuoDetail',
      component: () => import('@/pages/workPages/moneyDetail/tuiHuoDetail'),
      meta: {
        title: '退货明细',
        keepAlive: false
      }
    }
    // {
    //   //从详情页进入club小程序
    //   path: '/launchMiniProgram',
    //   name: 'launchMiniProgram',
    //   component: () => import('@/pages/workPages/customerInformation/launchMiniProgram/launchMiniProgram'),
    //   meta: {
    //     title: '去往club小程序',
    //     keepAlive: false
    //   }
    // }
    // ------------------------------------------------------------------------------------------
    //以下待使用路由
    // {
    //     //分配会员
    //     path: '/assign',
    //     name: 'assign',
    //     component: () => import('@/pages/workPages/toBeUsed/assign'),
    //     meta: {
    //         title: '分配会员',
    //         keepAlive: false
    //     }
    // },
    // {
    //     // 佣金方案
    //     path: '/commissionPlan',
    //     name: 'commissionPlan',
    //     component: () => import('@/pages/workPages/toBeUsed/commissionPlan'),
    //     meta: {
    //         title: '佣金方案',
    //         keepAlive: false, //此组件不需要被缓存
    //     }
    // },
    // {
    //     // 佣金明细
    //     path: '/commission',
    //     name: 'commission',
    //     component: () => import('@/pages/workPages/toBeUsed/commission'),
    //     meta: {
    //         title: '佣金明细',
    //         keepAlive: false, //此组件不需要被缓存
    //     }
    // },
    // {
    //     // 分类邀约
    //     path: '/classification',
    //     name: 'classification',
    //     component: () => import('@/pages/workPages/toBeUsed/classification'),
    //     meta: {
    //         title: '分类邀约',
    //         keepAlive: true,
    //         isBack: false, //用于判断上一个页面是哪个
    //     }
    // },
    // {
    //     // 邀约列表
    //     path: '/inviteList',
    //     name: 'inviteList',
    //     component: () => import('@/pages/workPages/toBeUsed/inviteList'),
    //     meta: {
    //         title: '邀约列表',
    //         keepAlive: true,
    //         isBack: false, //用于判断上一个页面是哪个
    //     }
    // },
    // {
    //     // 我的会员
    //     path: '/memberList',
    //     name: 'memberList',
    //     component: () => import('@/pages/workPages/toBeUsed/memberList'),
    //     meta: {
    //         title: '我的会员',
    //         keepAlive: false, //此组件不需要被缓存
    //     }

    // },
    // {
    //     // 线上佣金
    //     path: '/onlineCommission',
    //     name: 'onlineCommission',
    //     component: () => import('@/pages/workPages/toBeUsed/onlineCommission'),
    //     meta: {
    //         title: '线上佣金',
    //         keepAlive: true, //此组件不需要被缓存
    //     }
    // },
    // {
    //     // 我的业绩
    //     path: '/myPerformance',
    //     name: 'myPerformance',
    //     component: () => import('@/pages/workPages/toBeUsed/myPerformance'),
    //     meta: {
    //         title: '我的业绩',
    //         keepAlive: true,
    //     }
    // },
    // {
    //     // 导购排行
    //     path: '/ShoppersRanking',
    //     name: 'ShoppersRanking',
    //     component: () => import('@/pages/workPages/toBeUsed/ShoppersRanking'),
    //     meta: {
    //         title: '导购排行',
    //         keepAlive: false,
    //     }
    // },
    // {
    //     // 商品分析
    //     path: '/commodityAnalysis',
    //     name: 'commodityAnalysis',
    //     component: () => import('@/pages/workPages/toBeUsed/commodityAnalysis'),
    //     meta: {
    //         title: '商品分析',
    //         keepAlive: false,
    //     }
    // },
    // {
    //     // 会员分析
    //     path: '/memberAnalysis',
    //     name: 'memberAnalysis',
    //     component: () => import('@/pages/workPages/toBeUsed/memberAnalysis'),
    //     meta: {
    //         title: '会员分析',
    //         keepAlive: true,
    //     }
    // },
    // {
    //     // 门店管理
    //     path: '/storeManagement',
    //     name: 'storeManagement',
    //     component: () => import('@/pages/workPages/toBeUsed/storeManagement'),
    //     meta: {
    //         title: '门店管理',
    //         keepAlive: false,
    //     }
    // },
    // {
    //     // 导购排行
    //     path: '/cardLogout',
    //     name: 'cardLogout',
    //     component: () => import('@/pages/workPages/toBeUsed/cardLogout'),
    //     meta: {
    //         title: '卡券核销',
    //         keepAlive: false,
    //     }
    // },
  ],
})
