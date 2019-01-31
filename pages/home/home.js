// pages/homepage/homepage.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginUrl:'http://2z330q6958.imwork.net/wx/login',//开发者服务器登录请求url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var openId = wx.getStorageSync('openId')
    var that = this
    //判断是否已获取该用户的openId
    if (openId) {
      console.log('什么情况' + openId)
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
          })
        },
        fail: function () {
          console.log('获取失败！')
        },
        complete: function () {
          console.log("获取用户信息完成！")
        }
      })
    } else {  //若没有获取过openId，则进行获取

      wx.login({
        success: function (res) {
          console.log(res.code)
          if (res.code) {
            wx.request({
              url: that.data.loginUrl,
              data: {
                code: res.code,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              method: 'GET',
              header: {
                'conten-type': 'application/json'
              },
              success: function (res) {
                wx.setStorageSync('openId', res.data.openId)
                console.log("获取到的openid：" + res.data)
              },
              fail: function (res) {
                console.log(res.statusCode)
              }
            })
            wx.getUserInfo({
              withCredentials: true,
              successs: function (res_user) {
                console.log("successkkkkkk")

              },
              fail: function () {
                wx.showModal({
                  title: '注意',
                  content: '您选择了拒绝授权，将无法正常使用该小程序，点击确定重新获取授权',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          if (res.authSetting['scope.userInfo']) {
                            wx.login({
                              success: function (res_login) {
                                if (res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res_user) {
                                      wx.request({
                                        url: that.data.loginUrl,
                                        data: {
                                          code: res_login.code,
                                          encryptedData: res_login.encryptedData,
                                          iv: res_login.iv
                                        },
                                        method: 'GET',
                                        header: {
                                          'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                          that.setData({
                                            nickName: res.data.nickName,
                                            avatarUrl: res.data.avatarUrl
                                          })
                                          wx.setStorageSync('openId', res.data.openId)
                                          console.log("获取到的openid：" + res.data)

                                        }
                                      })
                                    }
                                  })
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})