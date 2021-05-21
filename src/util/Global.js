// const imgURL = 'http://ykf.aimergroup.com/target-retail/';
// const baseFormalURL = 'http://ykf.aimergroup.com/shopping-guide/Shopping_assistant/page/'; //生产环境接口

const imgURL = 'http://ykftest.aimergroup.com:8081/target-retail/';
const baseFormalURL = 'http://ykftest.aimergroup.com:8081/shopping-guide/Shopping_assistant/page/'; //测试环境接口

let user = localStorage.getItem('user')
let userNew = '';

if (user) {
  userNew = user.replace(/\"/g, "")
  //console.log(userNew);
}

export default {
  //图片接口地址
  imgURL,
  // 导购id
  MEMBERID: userNew,
  baseFormalURL,
}
