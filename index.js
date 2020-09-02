var done = new Set()
var questions = []
var chapters = []
var selectedQuestions
var neededCorrect = 0
var correct = 0
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
      var box = $(`<input type="checkbox" value=${chapters[i]} name="Chap${chapters[i]}"> </input>`);
      var label = $(`<label for="Chap${chapters[i]}" class="checkbox"</label>`)
      label.html(chapters[i])
      box.html(chapters[i])
      label.append(box);
      $("#chapters").append(label);
      $("#chapters").append($('<br/>'))
    }
    console.log(questions);
  }).then(function(){
    $("#next").click(function(){
        if (selectedQuestions==undefined){
          var selectedElements = $('#chapters').children('input')
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
      $("#answers").html('No more questions! Refresh to restart')
      $("#question").html('All questions completed!')
      $("#next").css('visibility','hidden')
  }
}

function selectQuestion(rand){
  var entry = selectedQuestions[rand];
  $("#question").html(entry.question)
  neededCorrect = entry.correct.length;
  correct = 0;
  for (var i=0; i < entry.answers.length; i++){
    var ans = $("<h4></h4>");
    ans.html(entry.answers[i]);
    if (entry.correct.includes(i)){
      ans.click(function(){
        correct++
        $(this).unbind("click");
        $( this ).css("background-color", "#00ff44");
        if (neededCorrect==correct){
          $("#next").css('visibility','visible')
        }
      });
    }
    else {
      ans.click(function(){
        $( this ).css("background-color", "#ff4040");
      });
    }
    $("#answers").append(ans);
  }
  done.add(rand)
}
