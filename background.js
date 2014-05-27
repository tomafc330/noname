//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.

$("div#player").append(inputTemplate());
$(document).unbind("keypress.key13");
$("div#player").css('position','relative');
// var chromeUrl = chrome.extension.getUR('images/circle-image.png');

// console.log('Im here');
// createDemo();

var position = {};
for (i=0;i<40;i++){
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


function createDemo(){
    lol = setInterval(function(){
      createNewDanmaku("LOOOOOOOOOOOOOOOOL");
      // console.log('created');
    }, 1000);
    awesome = setInterval(function(){
      createNewDanmaku("awesome");
    },700);
    OMG = setInterval(function(){
      createNewDanmaku("OMG");
    },877);
    return;
};

function createNewDanmaku(d){
  for (var i = 0 ; i < 40 ; i++ ){
      if (position[i]==true){
        position[i]=false;
        var newid="dmnum"+dmnum;
        // $("div#player").append("<div class=\"danmaku\" id="+newid+" style=\"top:"+20*i+"px\">"+d+"</div>");
        $("div#player").append(templateD(newid,i,d));
        // $("#"+newid).animate({left:"-"+$("#"+newid).css("width")},5000,"linear");
        setTimeout(function(){
          // $("#"+newid).remove()
        },5000);
        setTimeout(function(){
          position[i]=true;
        },2000);
        dmnum++;
          break;
      }
    } 
}

// function createNewDanmakuWithTime(d,t){
//  setInterval(function(){
//    if (Math.abs(document.getElementsByClassName("video-stream html5-main-video")[0].currentTime-t)<0.101){
//        createNewDanmaku(d);
//    }
//  },200);
// }

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
          createNewDanmaku(danmaku);
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
    $(".video-extras-likes-dislikes").prepend("<span class='danmaku-count'>"+'弹幕数:'+snapshot.val()+"</span>");
  }
});

function saveNewDanmaku(d,t,url){
  thisvideo.push({time:t, text:d});
  thisvideo.child('NumOfDanmaku').transaction(function(current_value) {
        return current_value + 1;
  });
}


function templateD(newid,count,content){
 var newHTML = '<div class=\"danmaku msg-frame\" id=\"'+newid+'\" style=\"top:'+25*count+'px;\">';
    newHTML+='<img src=\"#\" alt=\"image\">';
    newHTML+='<p class=\"msg-content\">'+content+'</p>';
    newHTML+='</div>';
  return newHTML
}


function inputTemplate(){
  return '<div id="enterText"><form><input type="text" id="danmakuTextBox" class="text" placeholder="Your danmaku"></p><button id="enter">Enter</button><button id="demo">Play Demo</button></form></div>';
}

