const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function timing(that){
  var seconds = that.data.seconds
  //这里可以加入一些时间判断事件
  if (seconds == 415 && !that.data.isConfirmed){
    wx.showToast({
      title: '请尽快认领！',
      icon: 'none',
      duration: 2000

    })
  }
  if(seconds == 420){
    wx.showToast({
      title: '您已停车7分钟，再过三分钟后将开始收费。',
      icon: 'none',
      duration: 3000

    })
  } 
  if(seconds == 600){
    wx.showToast({
      title: '您已停车10分钟，现在开始收费。',
      icon: 'none',
      duration: 3000

    })
   } 
  setTimeout(function(){

    that.setData({
      seconds: seconds + 1
    })
    if (wx.getStorageSync('parkingState')){
      console.log("123!!" )
      timing(that)
    }
    

  },1000)

  formatSeconds(that)
}
function charging(that){
  var seconds = that.data.seconds
  if(seconds > 600){
    return Math.ceil((seconds - 600)/180) * 1
  }
  return 0
}
function formatSeconds(that){
  var mins = 0, hours = 0, seconds = that.data.seconds
  if(seconds < 60){

  } else if(seconds < 3600){
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else{
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60 
  }
  that.setData({
    time: formatNumber(hours) + ':' + formatNumber(mins) + ':' + formatNumber(seconds)
  })
}


function sendRequest(url, data){
  wx.request({
    url: url,
    data: data,
    method: 'GET',
    header: {
      'conten-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      return res
    },
    fail: function (res) {
      return 0
    }
  })
}


module.exports = {
  formatTime: formatTime,
  timing: timing,
  charging: charging,
  sendRequest: sendRequest
}
