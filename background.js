(function($) {
    var pressTimer;
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.on("mousedown", function(e) {
          pressTimer = window.setTimeout(function() {
            $el.css('cursor', opt.cursor)
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
          },200);
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
            clearTimeout(pressTimer)
            // Clear timeout
            return false;
        });

    }
})(jQuery);

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
  $(".video-extras-likes-dislikes").prepend("<span id='danmaku-count'>弹幕数:</span>");//Danmaku Count
  $('#danmakuTextBox').drags();
  $(document).unbind("keypress.key13");
}
var playerWidth = $("#danmakuPlayer").width();
// $("div#player").css('position','relative');

// createDemo();

var position = {};
for (i=0;i<numOfShooters;i++){
  position[i] = true;
};

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
    }
});

thisvideo.child('NumOfDanmaku').once('value', function(snapshot) {
    console.log('NO DANMU',snapshot.val());
    if (snapshot.val() === null){
      thisvideo.child('NumOfDanmaku').set(0);
    }
    if (snapshot.val() === 0){
      var prepareText = prepareDanmaku('Don\'t be sky. Be the first to create a danmaku')
      createNewDanmaku(prepareText.text,prepareText.width);
    } 
});

thisvideo.on('child_added', function(snapshot) {
  var DMData = snapshot.val();
  console.log('NEW DANMU');
  if (DMData.text !== undefined){
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
  console.log('SAVED');

  thisvideo.child('NumOfDanmaku').transaction(function(current_value) {
      new_value = current_value + 1
      document.getElementById("danmaku-count").innerHTML = '弹幕数:'+ new_value;
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

  for (var i = 0 ; i < numOfShooters ; i++ ){
      if (position[i]==true){
        position[i]=false;
        var newid="dmnum"+dmnum;
        $("div#barrel_"+i).append(templateD(newid,i,DMText,startingPosition,DMContentWidth));
        // setTimeout(function(){
        //   $("#"+newid).css('-webkit-transition','all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)');
        //   $("#"+newid).css('-webkit-transform','translate(-'+(travelDistance)+'px)');
        // },10);  
        setTimeout(function(){
          $("#"+newid).css('-webkit-transition','all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)');
          $("#"+newid).css('-webkit-transform','translate(-'+(travelDistance)+'px,0px)');
        },10);
        // $("#"+newid).animate({left:"-"+$("#"+newid).css("width")},5000,"linear");
        $("#"+newid).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
          $("#"+newid).remove()
          // console.log('finished',e);
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

// function moveDanmaku(newid){
// 	$("#"+newid).css('-webkit-transition','all '+danmakuSpeed(travelDistance)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)');
//     $("#"+newid).css('-webkit-transform','translate(-'+(travelDistance)+'px,0px)');
// }

function prepareDanmaku(rawText){
  var cleanedText = rawText.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/ /g,"&nbsp;");//替换 空的，特别符号 成为html
  var contentWidth = measureText(cleanedText);
  var preparedDictionary = {
    contentWidth : contentWidth,
    cleanText : cleanedText
  };
  console.log('PREPARED');
  return preparedDictionary
}


var measureFrameCount = 0;
function measureText(content){
  var html = '<div class=\"textMeasurementFrame frame_'+measureFrameCount+'\">'+content+'</div>';
  $('html').prepend(html);
  var width = $('.textMeasurementFrame.frame_'+measureFrameCount).width();
  // console.log('WIDTH','.textMeasurementFrame frame_'+measureFrameCount);
  console.log('COUNT',width);
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
  // console.log("NEWTIME: ",newTime);
  return newTime;
}

function createStage(numOfShooters){
  var shooterTemplate='';
  for (var i = 0; i < numOfShooters; i++){
    shooterTemplate += '<div class=\"shooters\" id=\"barrel_'+i+'\"></div>'
      // console.log('creating shooters');
  }
  var stageTemplate = '<div id="danmakuPlayer" id="screen">';
  stageTemplate += shooterTemplate;
  stageTemplate += '</div>';
  // console.log('SHOOTER CRAETED: ',stageTemplate);
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

function inputTemplate(){
  return '<div id="enterText"><form><input type="text" id="danmakuTextBox" class="text" placeholder="Your danmaku"></p></form></div>';
}



