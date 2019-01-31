//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  //事件处理函数
  bindViewTap: function() {
    
  },
  bindShowToast: function() {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
    //setTimeout(function(){wx.hideToast()},1000);
    wx.login({
      success: function(res) {
        console.log(res.code +'哈哈哈'+ res.errMsg)
      }
    })

  },
  //新添加的页面入口导航事例代码
  bindViewDemo: function() {
    
  },
  bindTry: function() {
    
  },
  bindScrollView: function() {
    
  },
  bindRedirectTo: function() {
    wx.openLocation({
      latitude: 28.717087,
      longitude: 115.827312,
      scale: 18,
      address: "东华理工大学 江西省南昌市青山湖区广兰大道418号"
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
