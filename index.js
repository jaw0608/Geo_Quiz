var done = new Set()
var wrongQuestions = []
var questions = []
var chapters = []
var selectedQuestions
var neededCorrect = 0
var correct = 0

var reset = false

var wrong = 0
$(function(){

  $.getJSON( "questions.json", function(data) {
    for (var i=0; i<data.length; i++){
      questions.push(data[i]);
      if (!chapters.includes(data[i].chapter)){
        chapters.push(data[i].chapter)
      }
    }
    chapters.sort()
    for (var i=0; i<chapters.length; i++){
      var box = $(`<input type="checkbox" class = "checkIn" value="${chapters[i]}" name="Chap${chapters[i]}"> </input>`);
      var label = $(`<label for="Chap${chapters[i]}" class="checkbox"</label>`)
      var div = $("<div class=\"checkboxdiv\"/>")
      label.html(chapters[i])
      box.html(chapters[i])
      div.append(label)
      div.append(box);
      $("#chapters").append(div);
    }
  }).then(function(){
    $("#next").click(function(){
        if (selectedQuestions==undefined){
          var selectedElements = $('#chapters').find('input')
          selectedQuestions = []
          selectedChapters = []
          for (var i=0; i<selectedElements.length; i++){
            var item = selectedElements[i];
            if (item.checked){
              selectedChapters.push(item.value)
            }
          }
          if (selectedChapters.length==0){
            selectedQuestions = questions
          }
          else {
            for (var i=0; i<questions.length; i++){
              var q = questions[i]
              if (selectedChapters.includes(q.chapter)){
                selectedQuestions.push(q)
              }
            }
          }

        }
        $("#chapters").empty();
        $("#answers").empty();
        $("#next").html('Next Question')
        newQuestion();
    });
  });
});

function reset(){
  $("#answers").empty();
}

function newQuestion(){
  var noNew = true
  while (done.size!=selectedQuestions.length){
    noNew= false
    var rand = Math.floor(selectedQuestions.length * Math.random())
    if (done.has(rand)) continue;
    else {
      $("#next").css('visibility','hidden')
      selectQuestion(rand)
      break;
    }
  }
  if (noNew) {
      if (wrongQuestions.length>0){
        $("#question").html('All questions completed!')
        $("#answers").html('<h4>Now lets go over the ones you got wrong again..</h4>')
        $("#multiple").css('display','none')
        $("#current_chapter").css('display','none');
        newSelect = []
        for (var i=0; i<wrongQuestions.length; i++){
          newSelect.push(selectedQuestions[wrongQuestions[i]])
        }
        selectedQuestions = newSelect
        wrongQuestions = []
        console.log(selectedQuestions)
        done = new Set()
        reset = true
        return
      }
      $("#answers").html('<h4>You answered all the questions correctly! Refresh to restart</h4>')
      $("#question").html('All questions completed!')
      $("#next").css('visibility','hidden')
      $("#multiple").css('display','none')
      $("#current_chapter").css('display','none');
  }
}

function selectQuestion(rand){
  var entry = selectedQuestions[rand];
  $("#question").html(entry.question)
  $("#current_chapter").css('visibility','visible');
  $("#current_chapter").css('display','block');
  $("#current_chapter").html("Chapter: "+entry.chapter)
  $([document.documentElement, document.body]).animate({
      scrollTop: $("#question").offset().top
  }, 0);
  neededCorrect = entry.correct.length;
  if (entry.correct.length>1){
    $("#multiple").css('visibility','visible');
    $("#multiple").css('display','block');
  }
  else {
    $("#multiple").css('visibility','hidden');
    $("#multiple").css('display','none');
  }
  correct = 0;
  wrong = 0;
  for (var i=0; i < entry.answers.length; i++){
    var ans = $("<h4></h4>");
    ans.html(entry.answers[i]);
    if (entry.correct.includes(i)){
      ans.click(function(){
        correct++
        $(this).unbind("click");
        $( this ).css("background-color", "#00ff44");
        if (neededCorrect==correct){
          if (wrong!=0){
            wrongQuestions.push(rand)
          }
          $("#next").css('visibility','visible')
          $([document.documentElement, document.body]).animate({
              scrollTop: $("#next").offset().top
          }, 300);
        }
      });
    }
    else {
      ans.click(function(){
        wrong++
        $( this ).css("background-color", "#ff4040");
      });
    }
    $("#answers").append(ans);
  }
  done.add(rand)
}
