//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.
var numOfShooters = 3;

$("html").append(createStage(numOfShooters));
$("html").append(inputTemplate());
$(document).unbind("keypress.key13");
var playerWidth = $("#danmakuPlayer").width();
// $("div#player").css('position','relative');

// createDemo();

var position = {};
for (i=0;i<numOfShooters;i++){
  position[i] = true;
};

var danmaku = "";
var dmnum = 1;
var lol,awesome,OMG;
var youtube = new Firebase('https://incandescent-fire-5345.firebaseio.com/video/youtube');
var youtubeID = $(".html5-main-video").attr("data-youtube-id");
var thisvideo = youtube.child(youtubeID);
var NumOfDanmaku=0;

thisvideo.child('NumOfDanmaku').once('value', function(snapshot) {
    if (snapshot.val() === null){
      thisvideo.child('NumOfDanmaku').set(0);
    }
});



function createNewDanmaku(rawText){

  var pB = prepareDanmaku(rawText);

  for (var i = 0 ; i < numOfShooters ; i++ ){
      if (position[i]==true){
        position[i]=false;
        var newid="dmnum"+dmnum;
        console.log('Length: ',pB.startPositionX);
        $("div#barrel_"+i).append(templateD(newid,i,pB.cleanText,pB.startPositionX,pB.contentWidth));
        console.log('STARTING POSITON:-'+(pB.startPositionX,+pB.contentWidth)+'px)');
        setTimeout(function(){
          $("#"+newid).css('-webkit-transition','all '+danmakuSpeed(pB.travelDistanceX)*1000+'ms cubic-bezier(0.000, 0.505, 1.000, 0.585)');
          $("#"+newid).css('-webkit-transform','translate(-'+(pB.travelDistanceX)+'px)');
        },10);  
                
        $("#"+newid).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
          $("#"+newid).remove()
          console.log('finished',e);
        });
        setTimeout(function(){
          position[i]=true;
        },(danmakuSpeed(pB.contentWidth+150)*1000));
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
  var capWords = rawText.match(/\b([A-Z]{2,})\b/g);

  var contentWidth = (rawText.length*13)+70;

  if(capWords){//如果有大写的字把content加长
    var contentWidth = (rawText.length*18)+70;
  }

  var startingPosition = playerWidth+20;
  var travelDistance = startingPosition+contentWidth;
  console.log("startingPosition",startingPosition);
  var preparedDictionary = {
    startPositionX : startingPosition,
    travelDistanceX : travelDistance,
    contentWidth : contentWidth,
    cleanText : cleanedText
  };
  return preparedDictionary
}

//计算弹幕数度。
function danmakuSpeed(distance){
  //1152 = starting position for 1 letter 
  //6 = number of seconds of transition
  var speed = 1156/5;
  var newTime = distance/speed;
  console.log("NEWTIME: ",newTime);
  return newTime;
}

function createStage(numOfShooters){
  var shooterTemplate='';

  for (var i = 0; i < numOfShooters; i++){
    shooterTemplate += '<div class=\"shooters\" id=\"barrel_'+i+'\"></div>'
      console.log('creating shooters');
  }

  var stageTemplate = '<div id="danmakuPlayer" id="screen">';
  stageTemplate += shooterTemplate;
  stageTemplate += '</div>';

  console.log('SHOOTER CRAETED: ',stageTemplate);

  return stageTemplate;
}


function createNewDanmakuWithTime(d,t){
  function myhandler(){
    if ((Math.abs(document.getElementsByClassName("video-stream html5-main-video")[0].currentTime - t)<0.2) && (document.URL.indexOf($(".html5-main-video").attr("data-youtube-id")) > -1)) {
        createNewDanmaku(d);
        document.getElementsByClassName("video-stream html5-main-video")[0].removeEventListener('timeupdate',myhandler,false);
    }
  }
  function myhandler2(){
    document.getElementsByClassName("video-stream html5-main-video")[0].addEventListener("timeupdate", myhandler, false);    
  }
  document.getElementsByClassName("video-stream html5-main-video")[0].addEventListener("seeked", myhandler2, false);
  document.getElementsByClassName("video-stream html5-main-video")[0].addEventListener("timeupdate", myhandler, false);
}

$("#enter").click(function(){
      if ($("#textbox").val()!=""){
          danmaku=$("#textbox").val();
          createNewDanmaku(danmaku);
          $("#textbox").val("");
        }
    });
    $("#danmakuTextBox").keydown(function(e){ 
      console.log('danmaku');
      if ($("#danmakuTextBox").val()!=""){
        if (e.keyCode == 13){
          e.preventDefault();
          e.stopPropagation();
          danmaku=$("#danmakuTextBox").val();
          saveNewDanmaku(danmaku,document.getElementsByClassName("video-stream html5-main-video")[0].currentTime,youtubeID);
          $("#danmakuTextBox").val("");
          }
      }
});

thisvideo.on('child_added', function(snapshot) {
  var dmData = snapshot.val();
  if (dmData.text !== undefined){
    createNewDanmakuWithTime(dmData.text,dmData.time);
  }
  else {
    $(".video-extras-likes-dislikes").prepend("<span id='danmaku-count'>"+'弹幕数:'+snapshot.val()+"</span>");
  }
});

function saveNewDanmaku(d,t,url){
  thisvideo.push({time:t, text:d});
  thisvideo.child('NumOfDanmaku').transaction(function(current_value) {
  		new_value = current_value + 1
  		document.getElementById("danmaku-count").innerHTML = '弹幕数:'+ new_value;
        return new_value;
  });
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

