Page({
  data: {
    carNumInput: "",
  },
  //输入框内容变化响应函数
  bindCarNumInput: function(e) {
    this.data.carNumInput = e.detail.value
  },
  //绑定车牌号
  bindCarNumber: function() {
    console.log("这是车牌号：" + this.data.carNumInput)
  },
  //点击问号图标响应函数
  bindInfoImgClick: function() {
    wx.showModal({
      title: '提示',
      content:'1、您可手动输入也可选择车牌的照片，我们会进行识别。'+'\n'+
      '2、您可在用户界面中的“车牌管理”中对车牌号进行删添。',
      showCancel: false,

    })
  },
  //点击摄像机图标响应函数
  showPictures: function() {
    wx.chooseImage({
      success: function(res) {
        //补全照片识别车牌功能
      },
    })
  },
  onLoad: function (options) {
    //wx.clearStorageSync()
  },

});
