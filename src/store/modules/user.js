import {loginByUsername, logout, getUserInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    userId: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, id) => {
      state.userId = id
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({commit}, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if(response.data.code===200){
            const token = response.data.data
            console.log(token)
            commit('SET_TOKEN', token)
            // commit('SET_USERID', data.userInfo.id)
            setToken(token)
          }
            resolve(response.data)

        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      for (var key in state) {
        console.log('key:' + key + ' value:' + state[key])
      }
      return new Promise((resolve, reject) => {
        // 只有admin权限
        commit('SET_ROLES', ['admin','editor'])
        commit('SET_NAME', 'admin')
        commit('SET_AVATAR', 'http://gouyigou.oss-cn-zhangjiakou.aliyuncs.com/20180420/img/BBE3837323D34793B6D0005BD9F694A8.jpg')
        let response = {
          data:{
            data: {
                roles:['admin','editor']
            }
          }
        }
        resolve(response);
        /*getUserInfo(state.userId).then(response => {
          debugger
          // if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
          //   reject('error')
          // }
          const data = response.data
          if (data.data.roles && data.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            const rolesArr = []
            for (let i = 0; i < data.data.roles.length; i++) {
              rolesArr.push(data.data.roles[i].role_name)
            }
            commit('SET_ROLES', rolesArr)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.data.username)
          commit('SET_AVATAR', data.data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })*/
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.userId).then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        debugger
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({commit}, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
