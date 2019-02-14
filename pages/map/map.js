// pages/map/map.js
var app = getApp()
var locationBlueIconUrl = '../images/blue_rectangle.png'; //空车位图标URL
var locationRedIconUrl = '../images/car.png'; //非空车位图标URL
var destinationIconUrl = '../images/location.png'; //定位图标
var parksInfo = [{
  id: 1,
  name: "1号",
  latitude: 28.719035,
  longitude: 115.827919,
  isEmpty: true  
  }, {
  id: 2,
  name: "2号",
  latitude: 28.718941,
  longitude: 115.828219,
  isEmpty: false
  }];
var destinationOrPark = 0;  //用于判断被点击的是目的地的图标还是停车位的图标。0：目的地； 1：停车位

Page({

  /**
   * 页面的初始数据
   */
  data: {

    destinationsInfo:[{
      id: 1,
      name: "东华理工大学机电楼",
      latitude: 28.722098, 
      longitude: 115.826556,
      //latitude: 39.943436,  //北京坐标，用于测试视野
      //longitude: 116.477051,
      parksInfo: parksInfo
    },{
      id: 2,
      name: "东华理工大学行政楼",
      latitude: 28.719129, 
      longitude: 115.828128,
      parksInfo: parksInfo
    },{
      id: 3,
      name: "东华理工大学地学楼",
      latitude: 28.720089, 
      longitude: 115.824995,
      parksInfo: parksInfo
    }],
    
    parksInfo:[{
      id: 1,
      name: "1号",
      latitude: 28.719035,
      longitude: 115.827919,
      isEmpty: true
      
    },{
      id: 2,
      name: "2号",
      latitude: 28.718941,
      longitude: 115.828219,
      isEmpty: false
    }],

    markers: [],

    //初始状态下地图的中心
    latitude: 28.718941,
    longitude: 115.828219,

    
    searchInputVal: "", //搜索框的内容
    mapContext: null, //地图上下文
    mapScale : 11, //地图的缩放级别

    //customized dialog
    isShowModal: false,
    placeName: "东华理工大学",
    parkCount: 8,
    address: "江西省南昌市广兰大道418号东华理工大学"
  },

 

  
  
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log("看看有没有地名"+options)
    this.mapContext = wx.createMapContext("myMap")
    this.mapContext.moveToLocation()
  }, 
    

  onShow: function(){
    //当用户搜索地名后，在地图上显示匹配的所有地理对象
    var searchedPlaceName = wx.getStorageSync("placeName")
    if(searchedPlaceName != "" && searchedPlaceName != null){
      this.searchDestination()

    }
    wx.setStorageSync("placeName", "")
  },
  onReady: function (options) {
  
    
    //console.log(this.data.parksInfo.length)
    //debugger
    
    
  },
  /**
   * 将包含坐标的信息数组批量在地图上以图标进行显示。
   * 传入：
   * infoArray：包含坐标数据的信息数组
   * iconUrl: 指定图标的地址，若未传入则用默认的图标地址,用于显示目的地图标，显示车位图标则不填该项
   * 返回：
   * tempMarkers: 临时图标集合变量
   * tempPoints: 临时坐标变量，以便地图在一个视野内显示所有坐标点
   */
  putMarkersOnTheMap: function(infoArray, iconUrl){
    if(infoArray == null) return
    var tempMarkers = []
    var tempPoints = [] //存下所有的坐标，以便地图把所有点都同时显示在一个视野内
    
    for (var number = 0; number < infoArray.length; number++) {
      try {
        var perInfo = infoArray[number]
        var point = {
          latitude: perInfo.latitude,
          longitude: perInfo.longitude
        }
        var marker = {
          id: perInfo.id,
          name: perInfo.name,
          latitude: perInfo.latitude,
          longitude: perInfo.longitude,
          iconPath: locationBlueIconUrl,
          anchor: { x: 0.5, y: 0.5 },
          width: '60',
          height: '60'
          //color: '#4169E1',
          //fillColor: '#4169E1',
          //radius: 4
        }
        //该车位此时是否未被占用，被占用则执行
        if(perInfo.isEmpty == false){
          marker.iconPath = locationRedIconUrl 
        }
        //显示目的地图标的情况
        if(iconUrl != null &&　iconUrl != ""){
          marker.iconPath = iconUrl
          marker.width = "40"
          marker.height = "40"
          marker.anchor = {x:.5, y:1}
        }
        tempPoints.unshift(point)
        tempMarkers.unshift(marker)
        //console.log(circles)
      } catch (e) {
        console.log("occur error(s) when using function putMarkersOnTheMap !!" + e)
      }
    }
    return [tempMarkers,tempPoints]
  },


  //用于将所有坐标显示在一个视野中
  mapIncludePoints: function(points){
    
    this.mapContext.includePoints({
      points: points,
      padding: [40, 40, 40, 40],
      success: function () {
        console.log("included all pointes successfully!!")
      },
      complete: function () {
        console.log("included all pointes")
      }
    })
  },
  //绑定搜索图标点击事件，搜索与关键字匹配的所有目的地
  bindSearchDestination: function(){
    destinationOrPark = 0 //每次搜索后，被点击的图标一定是目的地的图标，此时停车图标还未显示
    var tempMarkers = this.putMarkersOnTheMap(this.data.destinationsInfo, destinationIconUrl)[0]
    var tempPoints = this.putMarkersOnTheMap(this.data.destinationsInfo, destinationIconUrl)[1]
    console.log(tempMarkers)
    console.log(tempPoints)
    //把所有坐标都显示在同一视野中
    this.mapIncludePoints(tempPoints)
    if(this.data.searchInputVal == ""){
      this.setData({
        //mapScale: 18,
        markers: tempMarkers
      })
    }

  },
  searchDestination: function(){
    destinationOrPark = 0 //每次搜索后，被点击的图标一定是目的地的图标，此时停车图标还未显示
    var tempMarkers = this.putMarkersOnTheMap(this.data.destinationsInfo, destinationIconUrl)[0]
    var tempPoints = this.putMarkersOnTheMap(this.data.destinationsInfo, destinationIconUrl)[1]
    console.log(tempMarkers)
    console.log(tempPoints)
    //把所有坐标都显示在同一视野中
    this.mapIncludePoints(tempPoints)
    if (this.data.searchInputVal == "") {
      this.setData({
        //mapScale: 18,
        markers: tempMarkers
      })
    }
  },
  //绑定输入框内容变动事件
  bindSearchInput: function(e){
    //this.data.searchInputVal = e.detail.value
  },
  bindSearchFocus: function(e){
    wx.navigateTo({
      url: '../searchpage/searchpage',
    })
  },
  //绑定图标点击事件
  bindParkMarkerTap: function(e){
    //先判断点击的是目的地还是某个停车位的图标
    var touchedIconId = e.markerId
    console.log("you touched an icon whose id is" + touchedIconId)
    var tempInfo = null
    if(destinationOrPark == 0){
      //显示详情窗体
      this.setData({
        isShowModal: true
      })
      tempInfo = this.data.destinationsInfo
      for(var number = 0; number < tempInfo.length; number++ ){
        if (tempInfo[number].id == touchedIconId){
          console.log("you touched a destinaton whose id is" + touchedIconId)
          var tempMarkers = this.putMarkersOnTheMap(tempInfo[number].parksInfo)[0]
          var tempPoints = this.putMarkersOnTheMap(tempInfo[number].parksInfo)[1]
          this.setData({
            markers: tempMarkers,
            mapScale: 21
          })
          this.mapIncludePoints(tempPoints)
          destinationOrPark = 1 //点击目的地图标后，以后被点击的应该是车位图标
          return
        }
      }
    }else{  //当被点击的是某一停车位图标是执行
      tempInfo = this.data.parksInfo
      console.log("you touched a park whose id is" + touchedIconId)
      
      
    }
    

  },


  //customized dialog
  bindMaskTap: function(){
    this.setData({
      isShowModal: false
    })
    console.log("masktap...")
  },

 
})

