
/* 左邊補0 */
const padLeft = function (str, len) {
  str = '' + str
  if (str.length >= len) {
    return str
  } else {
    return padLeft('0' + str, len)
  }
}

//  將毫秒轉為分秒，輸入數值，輸出字串
const msToTime = function (duration) {
  let seconds = parseInt((duration / 1000) % 60)
  let minutes = parseInt((duration / (1000 * 60)) % 60)

  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return `${minutes}:${seconds}`
}
//  設定要倒數的時間（將輸入的分鐘數轉為毫秒）
const minToMiniSec = (minutes) => minutes * 60 * 1000

//  clocking: 儲存 setInterval
//  history: array，用來紀錄歷史紀錄
//  startTimeStamp: 開始時間的時間戳記
//  durationTime: 剩餘時間的毫秒數
//  currentDateTime: object，當前時間日期資訊
//  currentTime: 當前時間
//
let clocking
let history = []
let currentTime           //  當前時間（字串）
let currentDateTime       //  取的當前時間（日期物件）
let startTimeStamp        //  取得滑鼠點下時的時間戳記（毫秒）
let durationTime          //  使用者輸入的時間（毫秒）
let stopTimeStamp         //  計算結束時的時間戳記（毫秒）
let currentTimeStamp      //  取得當前的時間戳記（毫秒）
let restTimeMiniSec       //  計算剩餘的時間（毫秒）

//  logCurrentTime: function，紀錄完成時間，並顯示於頁面上
const logCurrentTime = () => {
  currentDateTime = new Date()
  currentTime = `${padLeft(currentDateTime.getHours(), 2)}:${padLeft(currentDateTime.getMinutes(), 2)}:${padLeft(currentDateTime.getSeconds(), 2)}`
  history.push(currentTime)
  $('#log').html(history.join('<br>'))
}

// showDuration: function，顯示剩餘時間
const showDuration = () => {
  currentTimeStamp = Date.now()
  restTimeMiniSec = stopTimeStamp - currentTimeStamp
  $('#show').html(msToTime(restTimeMiniSec))      //  將毫秒轉回分秒，並顯示於網頁上
  document.title = msToTime(restTimeMiniSec)      //  將毫秒轉為分秒，並顯示於網頁 title 上

  if (restTimeMiniSec < 1) {
    clearInterval(clocking)
    logCurrentTime()
    alert("Time'up")
  }
}

//  按下按鈕開始計時
$('#clocking').on('click', function () {
  startTimeStamp = Date.now()
  durationTime = minToMiniSec($('#set_time').val())
  stopTimeStamp = startTimeStamp + durationTime
  clocking = setInterval(showDuration, 1000)
})

//  按下重設
$('#reset').on('click', function () {
  clearInterval(clocking)
  $('#set_time').val(' ')
})
