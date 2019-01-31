// pages/userphone/userphone.js
var code = null;
var userPhone = null;
var trueCode = null;
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

  bindInputPhone: function(e){
    userPhone = e.detail.value
  },
  bindInputCode: function(e){
    code = e.detail.value
  },
  bindRequesBtnClick: function(){
    //待接入接口，请求得来
    trueCode = "1"
  },
  bindSureBtnClick: function(){
    if(code == trueCode){
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