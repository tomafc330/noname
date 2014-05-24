//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.

$("div#player").append(inputTemplate());
$(document).unbind("keypress.key13");
$("div#player").css('position','relative');
// console.log('Im here');
// createDemo();

var position = {};
for (i=0;i<40;i++){
 	position[i] = true;
};
var danmaku = "";
var dmnum = 1;
var lol,awesome,OMG;

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
  	 		$("div#player").append("<div class=\"danmaku\" id="+newid+" style=\"top:"+20*i+"px\">"+d+"</div>");
  	 		// $("div#player").append(templateD(newid,i,d));
  			$("#"+newid).animate({left:"-"+$("#"+newid).css("width")},5000,"linear");
  			setTimeout(function(){
  				$("#"+newid).remove()
  			},5000);
  			setTimeout(function(){
  				position[i]=true;
  			},2000);
  			dmnum++;
  	    	break;
  		}
  	}	
}

$("#enter").click(function(){
      if ($("#textbox").val()!=""){
          danmaku=$("#textbox").val();
          createNewDanmaku(danmaku);
          $("#textbox").val("");
        }
    });
    $("input").keydown(function(e){ 
      console.log('danmaku');
      if ($("#textbox").val()!=""){
        if (e.keyCode == 13){
          e.preventDefault();
          e.stopPropagation();
          danmaku=$("#textbox").val();
          createNewDanmaku(danmaku);
          $("#textbox").val("");
          }
      }
});

function templateD(textId,count,content){
 var newHTML = '<div class=\"msg-frame danmaku\" id=\"'+newid+'\" style=\"top:'+25*i+'px;\">';
        newHTML+='<img src=\"images/circle-image.png\" alt=\"image\">';
        newHTML+='<p class=\"msg-content\">'+d+'</p>';
        newHTML+='</div>';
  return template
}

function inputTemplate(){
  return '<div id="enterText"><form><input type="text" id="textbox" class="text" placeholder="Your danmaku"></p><button id="enter">Enter</button><button id="demo">Play Demo</button></form></div>';
}

