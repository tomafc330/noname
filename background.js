//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.

var numOfShooters = 3;

var dmnum = 1;
var lol,awesome,OMG;
var youtube = new Firebase('https://incandescent-fire-5345.firebaseio.com/video/newYoutube');
var youtubeID = $(".html5-main-video").attr("data-youtube-id");
var thisvideo = youtube.child(youtubeID);
var NumOfDanmaku=0;

if(youtubeID != undefined){
  $("html").append(createStage(numOfShooters));
  $("html").append(inputTemplate());
  $(document).unbind("keypress.key13");
}
var playerWidth = $("#danmakuPlayer").width();
// $("div#player").css('position','relative');

var position = {};
for (i=0;i<numOfShooters;i++){
  position[i] = true;
};

/*
*
* textbox states
*
*/

$('#enterText').drags();

var dMisHidden = 1;
$('#closeDamaku').on('click',function(){
  numOfShooters = 0;
  var shooters = $('.shooters').toArray();
  $.each(shooters,function(i,value){
    shooters[i].remove();
    numOfShooters --;
  });
  if(dMisHidden){
    $('#closeDamaku').html('Show Dmac');
    $('#closeDamaku').css('background','green');
    dMisHidden--;
  } else {
    $('#closeDamaku').html('Hide Dmac');
    dMisHidden++;
  }
});

var inputIsOpen = 1;
$('#danmakuTextBox').dblclick(function() {
  toggleInputBox();
});

function toggleInputBox(){
  $('#danmakuTextBox').toggleClass('smallTextBox');
  if(inputIsOpen){
    $('#danmakuTextBox').val('What do you think?');
    inputIsOpen --;
  } else {
    $('#danmakuTextBox').val('');
    inputIsOpen ++;
  }
}

/*
*
* textbox states
*
*/
$(window).keydown(function(){
  console.log('typing');
  $("#danmakuTextBox").focus();
});
$("#danmakuTextBox").keydown(function(e){ 
  if (e.keyCode == 13){
    if ($("#danmakuTextBox").val()!=""){
        e.preventDefault();
        e.stopPropagation();
        saveNewDanmaku($("#danmakuTextBox").val());
        $("#danmakuTextBox").val("");
      }
      else{
        e.preventDefault();
        e.stopPropagation();
      }
    } else {
    if(!inputIsOpen){
      toggleInputBox();
      console.log('Texting');
    }
  }
});

thisvideo.child('NumOfDanmaku').once('value', function(snapshot) {
    if (snapshot.val() === null){
      $('#damakuCount').html('0 DMac');
      var pT = prepareDanmaku('Do not be shy. Be the first to create a danmaku')
      createNewDanmaku(pT.cleanText,pT.contentWidth);
      console.log('WTF AHHAA');
      thisvideo.child('NumOfDanmaku').set(0);
      return;
    } 
    if(snapshot.val() == 0){
      var pT = prepareDanmaku('LOL WTF')
      createNewDanmaku(pT.cleanText,pT.contentWidth);
      console.log('Be ther first to write something');
    }
    $('#damakuCount').html(snapshot.val()+' DMac');
});

thisvideo.on('child_added', function(snapshot) {
  var DMData = snapshot.val();
  // console.log('NEW DANMU');
  if (DMData.text != undefined){
    createNewDanmakuWithTime(DMData.text,DMData.time,DMData.width);
  }
});

function saveNewDanmaku(rawText){
  var currentVideoTime = document.getElementsByClassName("video-stream html5-main-video")[0].currentTime,youtubeID
  var currentTime = new Date();
  var DMPrepared = prepareDanmaku(rawText);
  // createNewDanmaku(DMPrepared.cleanText,DMPrepared.contentWidth);
  thisvideo.push({time:currentVideoTime, 
                  text:DMPrepared.cleanText,
                  width:DMPrepared.contentWidth,
                  creationTime: currentTime
                });
  // console.log('SAVED');

  thisvideo.child('NumOfDanmaku').transaction(function(current_value) {
      new_value = current_value + 1;
      $('#damakuCount').html(new_value+' DMax');
      return new_value;
  });
}


function createNewDanmakuWithTime(DMText,DMStartTime,DMContentWidth){
  function myhandler(){
    if ((Math.abs($(".video-stream.html5-main-video")[0].currentTime - DMStartTime)<0.2) && (document.URL.indexOf($(".html5-main-video").attr("data-youtube-id")) > -1)) {
        createNewDanmaku(DMText,DMContentWidth);
        $(".video-stream.html5-main-video")[0].removeEventListener('timeupdate',myhandler,false);
    }
  }
  function myhandler2(){
    $(".video-stream.html5-main-video")[0].addEventListener("timeupdate", myhandler, false);    
  }
  $(".video-stream.html5-main-video")[0].addEventListener("seeked", myhandler2, false);
  $(".video-stream.html5-main-video")[0].addEventListener("timeupdate", myhandler, false);
}

function createNewDanmaku(DMText,DMContentWidth){

  var startingPosition = playerWidth+20;
  var travelDistance = startingPosition+DMContentWidth;
  // console.log('CREATED');
  for (var i = 0 ; i < numOfShooters ; i++ ){
      if (position[i]==true){
        position[i]=false;
        var newid="dmnum"+dmnum;
        $("div#barrel_"+i).append(templateD(newid,i,DMText,startingPosition,DMContentWidth));
        // var objectToMove = $("#"+newid);
        // TweenLite.to(objectToMove, 3, {left:'-1000px',onComplete:function(){
        //     console.log('created');
        //   }
        // });
        setTimeout(function(){
          $("#"+newid).css({
            '-webkit-transition':'all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)',
            '-moz-transition':'all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)',
            '-o-transition':'all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)',
            'transition:':'all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)'
          });
          $("#"+newid).css({
            '-webkit-transform':'translate(-'+(travelDistance)+'px)',
            '-moz-transform':'translate(-'+(travelDistance)+'px)',
            '-o-transform':'translate(-'+(travelDistance)+'px)',
            'transform':'translate(-'+(travelDistance)+'px)'
          });
        },100);  
                
        $("#"+newid).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
          $("#"+newid).remove()
        });
        setTimeout(function(){
          position[i]=true;
        },(danmakuSpeed(DMContentWidth+150)*1000));
        dmnum++;
          break;
      }
    } 
}

/*
*准备弹幕的信息
* - 清洁弹幕
* - 计算长短
*/
function prepareDanmaku(rawText){
  var cleanedText = rawText.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/ /g,"&nbsp;");//替换 空的，特别符号 成为html
  var contentWidth = measureText(cleanedText);
  var preparedDictionary = {
    contentWidth : contentWidth,
    cleanText : cleanedText
  };
  // console.log('PREPARED');
  return preparedDictionary
}


var measureFrameCount = 0;
function measureText(content){
  var html = '<div class=\"textMeasurementFrame frame_'+measureFrameCount+'\">'+content+'</div>';
  $('html').prepend(html);
  var width = $('.textMeasurementFrame.frame_'+measureFrameCount).width();
  $('.textMeasurementFrame.frame_'+measureFrameCount).remove();
  measureFrameCount++;
  return width+70;
}


//计算弹幕数度。
function danmakuSpeed(distance){
  //1152 = starting position for 1 letter 
  //6 = number of seconds of transition
  var speed = 1156/3;
  var newTime = distance/speed;
  return newTime;
}

function createStage(numOfShooters){
  var shooterTemplate='';
  for (var i = 0; i < numOfShooters; i++){
    shooterTemplate += '<div class=\"shooters\" id=\"barrel_'+i+'\"></div>'
  }
  var stageTemplate = '<div id="danmakuPlayer" id="screen">';
  stageTemplate += shooterTemplate;
  stageTemplate += '</div>';
  return stageTemplate;
}

//弹幕的html样本
function templateD(newid,count,cleanContent,startingPosition,contentWidth){
   var newHTML = '<div class=\"msg-frame\" id=\"'+newid+'\" style=\"left:'+startingPosition+'px; width:'+contentWidth+'px\">';
    newHTML+='<img src=\"'+chrome.extension.getURL('/images/circle-image.png')+'\" alt=\"image\">';
    newHTML+='<p class=\"msg-content\">'+cleanContent+'</p>';
    newHTML+='</div>';
  return newHTML
}

function totalDMTemplate(totalDM){
  return '<div id="enterText"><form><input type="text" id="danmakuTextBox" placeholder="Your danmaku" autocomplete="off"></form></div>';
}

function inputTemplate(){
  return '<div id="enterText"><form><input type="text" id="danmakuTextBox" placeholder="Your danmaku" autocomplete="off"></form><span id="damakuCount" class="dmac_info">DMac Count</span><span class="dmac_info" id="closeDamaku">Hide DMac</span></div>';
}




