// pages/user/user.js
const app = getApp()
var fromDetailPage = false //模拟用户首次通过二维码进入detail页面，进而跳转至user页面进行授权和绑定手机号，之后需要跳转回detail页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userPhone: "点击绑定手机号",
    authorizedOrNot: true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
 
    // var that = this
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           app.globalData.userInfo = res.userInfo
    //           console.log("getsetting!!!!" + res.userInfo)

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况

    //         }
    //       })
    //     } else {
    //       that.setData({
    //         authorizedOrNot: false
    //       })
    //     }
    //   }
    // })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   * 
   * 小程序启动时，就会检查用户是否同意授权，若同意了就会获取用户信息，否则*   app.globalData.userInfo为空。所以这里若是检查到app.globalData.userInfo为空，则说明用户还未同意授权，通过令authorizedOrNot为false是授权按钮出现，引导用户进行授权。把这些代码写在onShow里面是为了，当用户同意授权并返回到用户个人界面时（会执行onShow），界面会进行实时更新。
   */
  onShow: function () {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo     
      })

      var userPhone = wx.getStorageSync("userPhone")
      if (userPhone != null && userPhone != "") {
        this.setData({
          userPhone: userPhone
        })  
        //模拟用户扫描二维码进入detail页，并跳转至该页面进行授权和绑定手机号。完成后需跳转回detail页引导用户认领车辆。用fromDetailPage来模拟是否从detail页面跳转而来
        if(fromDetailPage){
          wx.showLoading({
            title: '加载中',
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../detail/detail',
            })
            wx.hideLoading()},1000)
          
        }
      } else {
        console.log("未读取到手机号！！")
      }  
    } else {
      this.setData({
        authorizedOrNot: false
      })
      console.log("未授权，无用户信息！！")
    }

    


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
   * 点击手机号时触发的函数。可以更改绑定的手机号。
   */
  binduserPhoneNumber: function(){
    var userPhone = wx.getStorageSync('userPhone')
    if(userPhone){
      wx.showModal({
        title: '提醒',
        content: '是否更改所绑定的手机号？',
        success(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../userphone/userphone',
            })
          } 
        }
      })
      return
    } 
    wx.navigateTo({
      url: '../userphone/userphone',
    })
  },

  bindGetUserInfo: function(e){
    //通过e.detail.userInfo判断用户是否同意授权。
    var userInfo = e.detail.userInfo
    if(userInfo){
      //用户同意授权，将用户信息传入视图层，并赋值给全局变量
      this.setData({
        authorizedOrNot: true,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = userInfo
      //console.log("sfafsggagg")
    }
  }
 
})