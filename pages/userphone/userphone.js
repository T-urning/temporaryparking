// pages/userphone/userphone.js
var zhenzisms = require('../../utils/zhenzisms.js')

var apiUrl = 'https://sms_developer.zhenzikj.com'
var appId = '100703'
var appSecret = '96e18732-6fa1-46f2-b44c-10eccf349543'

var code = "";
var userPhone = "";
var checkedCodeWasTrue = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    zhenzisms.client.init(apiUrl,appId,appSecret)
 
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
   * 生命周期函数--监听页面卸载
   * 将一些变量恢复初始值，防止出现在未填写验证码和手机号情况下绑定成功的情况
   */
  onUnload: function() {
    code = ""
    userPhone = ""
    checkedCodeWasTrue = ""
  },

  bindInputPhone: function(e){
    userPhone = e.detail.value
  },
  bindInputCode: function(e){
    code = e.detail.value
  },
  bindRequesBtnClick: function(){
    //待接入接口，请求得来
    //trueCode = "1"
    console.log(userPhone.length)
    if(userPhone.length != 11){
      wx.showToast({
        title: '手机号不规范,请重新输入！',
        icon: 'none',
        duration: 2000

      })
    } else {

      zhenzisms.client.sendCode(function (res) {
        if (res.code != 0) {
          checkedCodeWasTrue = true
          wx.showToast({
            title: '发送失败，请重试。',
            icon: 'none',
            duration: 2000
          })
        }
        //console.log(res.data)
      }, userPhone, '验证码为：{code}', userPhone, 60, 4)
    }
    
  },

  bindSureBtnClick: function(){
    var result = zhenzisms.client.validateCode(code)
    if(result && checkedCodeWasTrue){
      wx.setStorageSync("userPhone", userPhone)
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 1500
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },1500)
      
    } else {
      wx.showToast({
        title: '验证码错误，请重试！',
        icon: 'none'
      })
    }

  }
})