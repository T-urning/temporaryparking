//index.js 
Page({ 
  data: { 
    searchKey: "", 
    history: [] 
    }, 

  bindSearchInput: function(e) { 
    this.setData({ 
      searchKey: e.detail.value 
      }) 
  },

  clearHistory: function() {
    this.setData({ 
      history: [] 
    }) 
    wx.setStorageSync("history", []) 
  }, 

  routeToSearchResPage: function(e) { 
    
    let _this = this; 
    let _searchKey = this.data.searchKey; 
    if (!this.data.searchKey) { 
      return 
    } 
    wx.navigateBack({
      delta:1 
    })
    history = wx.getStorageSync("history") || [];
    history.push(this.data.searchKey) 
    wx.setStorageSync("history", history); 
    
    //存搜索关键词
    wx.setStorageSync("placeName", this.data.searchKey)

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
