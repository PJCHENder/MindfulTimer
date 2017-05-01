/* global $ _ */

// 程式封裝
;(function () {
  /* 左邊補0 */
  function padLeft (str, len) {
    str = '' + str
    if (str.length >= len) {
      return str
    } else {
      return padLeft('0' + str, len)
    }
  }

  //  將毫秒轉為字串的分秒，輸入數值，輸出字串
  function msToTime (duration) {
    let seconds = parseInt((duration / 1000) % 60)
    let minutes = parseInt((duration / (1000 * 60)) % 60)

    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds

    return `${minutes}:${seconds}`
  }

  //  設定要倒數的時間（將輸入的分鐘數轉為毫秒）
  function minToMs (minutes) {
    return minutes * 60 * 1000
  }

  //  clocking: 儲存 setInterval
  //  history: array，用來紀錄歷史紀錄
  //  startTimeStamp: 開始時間的時間戳記


  let timer
  let history = []
  let currentTime           //  當前時間（字串）
  let currentDateTime       //  取的當前時間（日期物件）
  let startTimeStamp        //  取得開始任務時的時間戳記（毫秒）
  let setRestTimeMs         //  使用者輸入的時間（毫秒）
  let stopTimeStamp         //  計算結束時的時間戳記（毫秒）
  let currentTimeStamp      //  取得當前的時間戳記（毫秒）
  let restMs                //  計算剩餘的時間（毫秒）

  //  logCurrentTime: function，紀錄完成時間，並顯示於頁面上
  function logCurrentTime () {
    currentDateTime = new Date()
    let task = $('#set_task').val() || '未設定'
    currentTime = `${padLeft(currentDateTime.getHours(), 2)}:${padLeft(currentDateTime.getMinutes(), 2)}:${padLeft(currentDateTime.getSeconds(), 2)} => ${task}`
    history.push(currentTime)
    $('#log').html(history.join('<br>'))
  }

  // refreshRestTime: function，顯示剩餘時間
  function refreshRestTime () {
    currentTimeStamp = Date.now()
    restMs = stopTimeStamp - currentTimeStamp
    $('#show').html(msToTime(restMs))      //  將毫秒轉回分秒，並顯示於網頁上
    document.title = msToTime(restMs)      //  將毫秒轉為分秒，並顯示於網頁 title 上

    if (restMs < 100) {
      clearInterval(timer)
      logCurrentTime()
      stopClockingAnimation()
      window.alert("Time's up")
    }
  }

  //  按下開始計時動畫的轉換
  function startClockingAnimation () {
    $('.set_time, .set_task, #clocking').fadeOut(function () {
      $('.task').fadeIn(function () {
        $(this).find('h4').text($('#set_task').val() || '你並未設定任何任務')
      })
    })
  }

  //  計時器停止時的畫面
  function stopClockingAnimation () {
    $('.task').fadeOut(function () {
      $('.set_time, .set_task, #clocking').fadeIn()
    })
  }

  //  按下按鈕開始計時
  $('#clocking').on('click', function () {
    //  如果 Timer 已經計時中，則先重設
    if (timer) {
      clearInterval(timer)
    }
    startTimeStamp = Date.now()
    setRestTimeMs = minToMs($('#set_time').val())
    stopTimeStamp = startTimeStamp + setRestTimeMs
    timer = setInterval(refreshRestTime, 1000)

    startClockingAnimation()
  })

  //  按下重設
  $('#reset').on('click', function () {
    clearInterval(timer)
    $('#set_time').val(' ')
    $('#show').html(' ')
    document.title = 'Mindful Clock'
    stopClockingAnimation()
  })

  //  載入 localStorage 的資料
  $(document).ready(function () {
    try {
      let noteContent = window.localStorage.getItem('noteContent')
      $('#note').val(noteContent)
      console.log('loadNote')
    } catch (e) {
      console.log('error', e.message)
    }
  })

  //  將 note 的資料寫入 localStorage
  function saveNote () {
    window.localStorage.setItem('noteContent', $('#note').val())
    console.log('saveNote')
    $('.alert').fadeIn('slow', function () {
      $('.alert').fadeOut('slow')
    })
  }
  $('#note').on('keyup', _.debounce(saveNote, 1000, {leading: false, trailing: true}))
}())
