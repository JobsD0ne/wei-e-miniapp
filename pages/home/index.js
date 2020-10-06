const recorderManager = wx.getRecorderManager()

recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})
recorderManager.onStop((res) => {
  console.log('recorder stop', res)
  const { tempFilePath } = res
})
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
var intt;
Page({
  data: {
    recordStatus :0,
    recordMove :"",
    recordText :"轻点开始录音",
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    timecount: '00:00:00',
    cost: 0,
    flag: 1,
    endtime: "",
    url :'',
  },
  onLoad: function () {
    this.initRecorderManager();
  },
  recorderStart: function(e) {
      //recorderManager.start(options)
  },
  //格式化录音时间
  fmtRecoderTime(duration = 0) {
      duration = duration / 1000;
      const seconds = duration.toString().split(".")[0]; //取秒
      return seconds;
  },
  initRecorderManager(){
    recorderManager.onStop(res => {
      const durationRaw = res.duration
      const duration = this.fmtRecoderTime(durationRaw); //获取录音时长
      //小程序录音最长1分钟(60秒)
      this.duration = duration;
      console.log(res.duration)
      wx.uploadFile({
        url: 'http://api.wei-e.club:9501/upload', //仅为示例，非真实的接口地址
        filePath: res.tempFilePath,
        name: 'file',
        formData:{
        },
        success (res){
          var data = JSON.parse(res.data)
          const url = data.result.url
          //录制成功，跳转到播放页面
          wx.navigateTo({
            url: '/pages/home/confirm/index?url='+url+'&duration='+durationRaw
          })
        }
      })
    });
  },
  bindtap (ev){ 
    var that = this
    let recordMove = that.data.recordMove ? "" : "record-border-move"
    if(recordMove != ""){
      //开始录制
      that.startSetInter()
      
    }else{
      //暂停录制
      that.stopTime()
      //判断录制时间是否过短
      if(that.data.second < 1){
        console.log('录音时间过短')
      }
      that.setData({
        recordText: "轻点开始录音",
      })
      recorderManager.stop()
      
    }
    that.setData({
        recordMove : recordMove
    })
  },
  //计时器开始
  startSetInter(){
    var that = this;

    wx.authorize({
      scope: 'scope.record',
      success() {
        recorderManager.start(options)
        //停止（暂停）
        clearInterval(intt);
        //时间重置
        that.setData({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        intt = setInterval(function () { that.timer() }, 50);
      },
    })
    
  },
  //暂停
  stopTime: function () {
    clearInterval(intt);
  },
  //事件处理
  timer: function () {
    var that = this;
    that.setData({
      millisecond: that.data.millisecond + 5
    })
    if (that.data.millisecond >= 100) {
      that.setData({
        millisecond: 0,
        second: that.data.second + 1
      })
    }
    if (that.data.second >= 60) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1
      })
    }

    if (that.data.minute >= 60) {
      that.setData({
        minute: 0,
        hour: that.data.hour + 1
      })
    }
    that.setData({
      recordText: that.data.hour + ":" + that.data.minute + ":" + that.data.second + ":" + that.data.millisecond
    })
  },
  //计时器结束
})
