// 配置API接口地址
import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'

const root = 'API/api/v1/assistant/'

//取消请求
// const CancelToken = axios.CancelToken;
let requestName = '';

// 开始设置请求 发起的拦截处理
// config是发送请求的参数
axios.interceptors.request.use(function (config) {
  // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的相同字段的请求
  // 如果没有 requestName 就默认添加一个 不同的时间戳
  if (config.method === 'POST') {
    if (config.data && config.data.requestName) {
      requestName = config.data.requestName
    } else {
      requestName = new Date().getTime()
    }
  } else {
    if (config.params && config.params.requestName) {
      requestName = config.params.requestName
    } else {
      requestName = new Date().getTime()
    }
  };
  // -----------------------------------------------------------------------------------
  // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
  // requestName为 '' 时为 false
  // if (requestName) {
  //   //如果存在axios[requestName]，axios[requestName].cancel说明上次请求已经存在
  //   if (axios[requestName] && axios[requestName].cancel) {
  //     axios[requestName].cancel()
  //   }
  //   //传递一个 executor 函数到 CancelToken 的构造函数来创建 cancel token：
  //   config.cancelToken = new CancelToken(function (c) {
  //     axios[requestName] = {}
  //     axios[requestName].cancel = c
  //   })
  // };
  return config
}, function (error) {
  return Promise.reject(error)
})
// 请求到结果的拦截处理
axios.interceptors.response.use(function (config) {
  // 返回请求正确的结果
  return config
}, function (error) {
  // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break

      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
    Vue.prototype.$toast({
      message: error.message,
      duration: 3000,
      confirmButtonText: '确定',
    })
  } else {
    // console.log('Error', error.message);
  }
  return Promise.reject(error)
})

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数 trim() 去除空白
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
};

/*
  接口处理函数
  * @param method 请求类型，分为POST/GET/PUT/DELETE
  * @param url 请求url
  * @param params 请求参数
  * @returns {Promise<any>}
*/
function apiAxios(method, url, params, success, failure) {
  //如果有参数，进行过滤
  if (params) {
    params = filterNull(params)
  }
  //发起请求
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? Qs.stringify(params) : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: true,
    headers: {
      'deviceCode': 'A95ZEF1-47B5-AC90BF3'
    },
    timeout: 30000,
  })
    .then(function (res) {
      if (res.data.errcode == 0) {
        success(res.data)
      } else if (res.data.errcode == 100) {
        failure(res.data);
        Vue.prototype.$toast({
          message: '加载失败，请稍后重试',
          duration: 3000,
        });
      } else {
        failure(res.data);
      }
    })
    .catch(function (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break;
          case 403:
            error.message = '拒绝访问'
            break;
          case 404:
            error.message = '请求错误，未找到该资源'
            break;
          case 405:
            error.message = '请求方法未允许'
            break;
          case 408:
            error.message = '请求超时'
            break;
          case 500:
            error.message = '服务器端出错'
            break;
          case 501:
            error.message = '网络未实现'
            break;
          case 502:
            error.message = '网络错误'
            break;
          case 503:
            error.message = '服务不可用'
            break;
          case 504:
            error.message = '网络超时'
            break;
          case 505:
            error.message = 'http版本不支持该请求'
            break;
          default:
            error.message = `连接错误${error.response.status}`
            break;
        }
        Vue.prototype.$toast({
          message: error.message,
          duration: 3000,
          confirmButtonText: '确定',
        })
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
      }
    })
}

/**
 * 在vue模板中的调用接口
 */
export default {
  get(url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post(url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put(url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete(url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
