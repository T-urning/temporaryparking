//index.js 
Page({ 
  data: { searchKey: "", history: [] }, 
  getSearchKey: function(e) { 
    this.setData({ 
      searchKey: e.detail.value 
      }) 
  },
  clearHistory: function() {
    this.setData({ 
      history: [] 
    }) 
    wx.setStorageSync("history", []) }, 
     routeToSearchResPage: function(e) { 
      let _this = this; 
      let _searchKey = this.data.searchKey; 
      if (!this.data.searchKey) { 
        return 
      } 
      let history = wx.getStorageSync("history") || [];
      history.push(this.data.searchKey) 
      wx.setStorageSync("history", history); 
      }, //每次显示钩子函数都去读一次本地storage 
  onShow: function() { 

    this.setData({ 
      history: wx.getStorageSync("history") || [] 
    })
  },
  getFocus: function(e){
    this.setData({
      history: wx.getStorageSync("history") || []
    })
  }


 
})
