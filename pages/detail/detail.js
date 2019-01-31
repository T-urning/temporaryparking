// pages/try/try.js
/**
 * 当用户未扫描二维码而直接进入小程序时，本页面应无信息展示
 */
var app = getApp()
var util = require('../../utils/util.js')
var requestParkStateUrl = ""
var parkId = ""
var isCameFromCode = true//测试，模拟判断用户是否通过扫描二维码进入小程序
var isParkOccupied = true//测试，模拟用户扫描二维码时，车位上有车辆停放。无车辆停放时应无信息显示。
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    
    
    isInATranscation: false,//模拟用户处于一个停车事务中,由isCameFromCode和isParkOccupied共同决定
    isConfirmed: false,  //测试，模拟判断用户是否已认领车辆
    
    latitude: 28.719129,
    longitude: 115.828128,
    markers: [{
      iconPath: "../images/car.png",
      id: 0,
      latitude: 28.718941,
      longitude: 115.828219,
      width: 50,
      height: 50
    }],
    carNumber: "苏E 05EV8",
    address: "东华理工大学-行政楼",
    parkId: 2,

    //
    time: "",
    seconds: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.clearStorage()
    //this.data.time = '01:11:12'
    

    if (isCameFromCode){//如果用户扫描进入
     // var isParkOccupied = util.sendRequest(requestParkStateUrl, parkId)//发送请求，判断是否有车辆停靠
      if (isParkOccupied){//如果车位有车辆停靠
        this.setData({
          isInATranscation: true
        })
        this.ifCameFromCodeAndParkWasOccupied()//测试，模拟用户通过二维码进入小程序且停车位有车辆停放，则执行
      }else{  //否则，转至首页
        wx.switchTab({
          url: '../map/map',
        })
      }     
    } else {   //否则，该页面显示无信息
      this.setData({
        isInATranscation: false
      })
    }
    //对未记录的时间进行补偿
    var parkingState = wx.getStorageSync("parkingState")
    if(parkingState){
      var timeUnrecordedStart = wx.getStorageSync("timeUnrecordedStart")
      if(timeUnrecordedStart){
        var seconds = this.data.seconds
        var timeUnrecordedEnd = new Date().getTime()
        this.setData({
          seconds: seconds + timeUnrecordedEnd - timeUnrecordedStart
        })
        
      }
      
    }
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapContext = wx.createMapContext("miniMap")
    
  },

  /**
   * 生命周期函数--监听页面显示
   * 
   * 先检查用户是否已授权，以及是否绑定手机号
   */
  onShow: function () {

    console.log("page try on show!!")
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          var userPhone = wx.getStorage({
            key: 'userPhone',
            success: function (res) {    
            },
            fail: function () {
              wx.showModal({
                title: '注意',
                content: '请先绑定手机号！',
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../user/user',
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.showModal({
            title: '注意',
            content: '请先授权用户信息并绑定手机号！',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("page try on hide!!")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var timeUnrecordStart = new Date().getTime()
    wx.setStorageSync('timeUnrecordStart',timeUnrecordStart )
    console.log(timeUnrecordStart)
  },

  bindConfirmCar: function(){
    var isConfirmed = this.data.isConfirmed
    this.setData({
      isConfirmed: true
    })
    //util.timing(this) //这里只是测试，不应该在此处开始计时，而是当与服务器发生交互时。
    //wx.setStorageSync("parkingState", 1)  //认领车辆后，则说明用户处于一个停车事件中
  },

  haveATest: function(){
    this.parkingWasOver()
  },
  /**
   * 先写好。用户若是通过扫描二维码进入小程序detail页面，则进行如下操作。
   * 建立websocket连接，令parkingState为1(这个操作应该放在认领车辆之后)，接收从服务器发过来的车辆已停时间（秒数），开始计时（要加上已停秒数）
   */
  ifCameFromCodeAndParkWasOccupied: function(){
    //建立websocket连接
    wx.setStorageSync("parkingState", 1)
    var seconds = 1200 //模拟，这里需要服务器的记录的时间
    this.data.seconds = seconds
    util.timing(this)

  },

  /**
   * 先写好。若用户驶离停车位，则进行如下操作。
   * 将parkingsState设置为0，timeUnrecordedStart从缓存中删除。
   * 还需要通知用户他离开的时间，以及停车记录的时间，是否要扣费，扣多少。
   */
  parkingWasOver: function(){
    wx.removeStorageSync('parkingState')
    wx.removeStorageSync('timeUnrecordedStart')
    //接下来是通知操作
    //console.log(wx.getStorageSync('parkingState'))
    var charge = util.charging(this)
    var parkingTime = Math.ceil(this.data.seconds / 60)
    var that = this
    wx.showModal({
      title: '通知',
      content: '您已驶离车位,共停车'+ parkingTime +'分钟，本次收费为' + charge + "元",
      showCancel: false,
      success(res){
       if(res.confirm){
         that.setData({
           isInATranscation: false
         })
       } 
      }
    })
  }
  
})

