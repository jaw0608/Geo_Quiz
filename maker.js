var questions = []

var wrong = 0
$(function(){
  $("#addAns").on('click',function(){
    answerBox();
  });
  $("#submit").on('click',function(){
    process_question(true);
  });
  $("textarea").bind('input propertychange',function(){
    process_question(false);
  });

  $("#print").on('click',function(){
    print_questions();
    download_questions();
  });

  $(window).on('resize', function(){
    resize_textareas();
  });
});


function answerBox(){
  var div = $("<div class=\"answerDivs center\"/>")
  var div2 = $("<div class=\"inline-block center\"/>")
  var ans = $("<textarea class=\"answerbox center\"/>")

  ans.bind('input propertychange',function(){
    process_question(false);
  });

  var x = $("<button class=\"X\"/>")
  var check = $("<label> <input type=\"checkbox\" class=\"check\"/> Correct? </label>")
  check.on('click',function(){
    process_question(false);
  });
  x.html("X")
  x.on('click',function(){
    $(this).parent().remove();
    process_question(false);
  })
  div.append(ans)
  div.append(x)
  div2.append(check)
  div.append(div2)
  $("#answers").append(div)
  resize_textareas();
}

function process_question(add){

  var q = $("#question").val();
  var answers = []
  var correct = []
  var count = 0;
  var chapter = $("#chapter").val();
  $("#answers").children("div").each(function(s,div){
    var ans = $(div).children("textarea")[0];
    var checkLabel = $($(div).children("div")[0]).children('label');
    var isCorrect = $(checkLabel).children("input")[0].checked
    console.log(isCorrect);
    if (ans.value.replace(/\s/g,'')!="") {
      if (isCorrect==true) correct.push(count)
      answers.push(ans.value);
      count++;
    }
  });
  if (count==0 || q.replace(/\s/g,'')=="" || correct.length==0){
    $("#qJson").val("Invalid Question");
    return;
  }
  question = {
    "question":q,
    "answers":answers,
    "correct":correct,
    "chapter":chapter
  }
  $("#qJson").val(JSON.stringify(question));
  if (add==true){
    questions.push(question);
    print_questions();
    clear_all()
  }
}

function clear_all(){
  $("#answers").empty()
  $("#question").val("")
}

function print_questions(){
  $("#qsJson").val(JSON.stringify(questions))
}

function download_questions(){
  if (questions.length!=0)
    download(JSON.stringify(questions),"geo_questions.json","application/json");
  else{
    $("#qsJson").val("No questions to download!")
  }
}

function clear_questions(){
  questions = []
}


function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function resize_textareas(){
  var win = $(window);
  if (win.height()<=win.width()){
    var width = win.width() * 0.05;
    var height = width/20;
  }
  else {
    var height = win.height() * 0.005
    var width = height*4;

  }

  $("textarea").each(function(){
    $(this).attr('cols',width);
    $(this).attr('rows',height);
  });
}
