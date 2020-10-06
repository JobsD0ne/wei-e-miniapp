// 创建一个播放对象
const myaudio = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tridPlay: true,// 播放的flag
    duration: '00:00',// 播放时长     时间格式
    current:'00:00',// 当前播放时长   时间格式
    durationNum:0,// 播放时长数字     数字格式
    currentNum:0,// 当前播放时长数字   数字格式
    durationRaw :0,//音频时长Raw
    isEnd : false
  },
  initMyaudio(){
    let that = this
    myaudio.onTimeUpdate(function(){
      let durationnum = parseInt(myaudio.duration)
      let time = that.formatSeconds(myaudio.duration)
      that.setData({
        durationNum: durationnum,
        duration:time
      })
      console.log(myaudio.currentTime)
      that.changeCurrent(myaudio.currentTime)
    })
    myaudio.onEnded(function(){
      that.setData({
        tridPlay:true,
        isEnd:true
      })
    })
  },
  onLoad: function (options) {
    let that = this
    let time = that.formatSeconds(options.duration/1000)
    that.setData({
      duration: time,
      durationRaw:options.duration
    })
    myaudio.src = options.url
    myaudio.obeyMuteSwitch=true
    this.initMyaudio()
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  onUnload(){
    myaudio.pause()
  },
  // 左侧补零
  addZero(val){
    if(val<10){
      return 0+''+val
    }else{
      return val
    }
  },
  // 时间格式化
  formatSeconds(value) {
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime > 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    var result = "" + this.addZero(parseInt(secondTime)) + "";
    if (minuteTime > 0) {
      result = "" + this.addZero(parseInt(minuteTime)) + ":" + result;
    }else{
      result = "" + this.addZero(parseInt(minuteTime)) + ":" + result;
    }
    if (hourTime > 0) {
      result = "" + parseInt(hourTime) + ":" + result;
    }
    return result;
  },
  // 播放暂停
  play() {
    let that = this;
    if (that.data.tridPlay) {
      if(that.data.isEnd){
        that.changeCurrent(0)
      }
      myaudio.play();
      setTimeout(() => {
        console.log(myaudio.paused)
      }, 100)
      that.setData({
        tridPlay: false
      })
    } else {
      myaudio.pause()
      that.setData({
        tridPlay: true
      })
    }
    
  },

  // 滑块拖动快进，快退
  changeValue(e){
    let val = e.detail.value
    let step = (val / 100) * this.data.durationNum
    myaudio.seek(parseInt(step))
    this.changeCurrent(step)
    // setTimeout(() => { myaudio.pause()},0)
    // setTimeout(() => { myaudio.play() }, 10)
    // myaudio.pause()
    // myaudio.play()
  },
  // 当前播放格式化
  changeCurrent(step){
    let currentnum = parseInt(step)
    let currentt = this.formatSeconds(currentnum)
    this.setData({
      current: currentt,
      currentNum: currentnum*100
    })
  },
})
//https://juejin.im/post/6844904029617651725