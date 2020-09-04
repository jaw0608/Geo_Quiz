import re
import json

filename = "prac1.html"

string_new_question = "<span class=\"cls_005\">____</span></div>"

chapter = "Practice 1"

string_break_question = "<span class=\"cls_005\">"

answer_marks = ["a.","b.","c.","d.","e.","f."]

letter_to_number = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5}

question_starts = []

questions = []

answers = []

content = []

correct = []

fullOut = []

def main():
    global content
    
    with open(filename,encoding="mbcs") as f:
        content = f.readlines()
    # you may also want to remove whitespace characters like `\n` at the end of each line
    content = [x.strip() for x in content]

    for index,line in enumerate(content):
        if string_new_question in line:
            question_starts.append(index)
            
    for i in question_starts:
        q = ""
        q_line = 0;
        while True:
            new_question = content[i+2+q_line]
            res = check_question(new_question)
            if res[0]==True: #was a question
                q+=" "+res[1]
                q_line+=1
                continue
            elif res[0]==False and res[1]=="": #neither condition
                if q!="":
                    questions.append(q)
                break
            else: #answer
                questions.append(q)
                ans = []
                while True:
                    response = get_full_answer(i+2+q_line)
                    if response[0]!=-1 and response[0]!=0:
                        ans.append(response[1])
                        q_line+=response[0]
                    else:
                        ans.sort()
                        answers.append(ans)
                        break
            break
    
    answer_string = "<span class=\"cls_005\">ANS:</span></div>"
    for index,item in enumerate(content):
        line = content[index]
        og = line
        if answer_string in line:
            line = content[index+1]
            og = line
            if string_break_question in line:
                end = line.index(string_break_question) + len(string_break_question)
                length_stop = len(line)-len("</span></div>")
                line = line[end:length_stop]
                line = re.sub(r'<.*?>', "", line)
                correct.append([letter_to_number[line]])
        elif "ANS:" in line:
            index = line.index("ANS:")+len("ANS:")
            length_stop = len(line)-len("</span></div>")
            line = line[index:length_stop]
            line = re.sub(r'<.*?>', "", line)
            line = line.strip()
            
            correct.append([letter_to_number[line]])
            
         
    for index,item in enumerate(questions):
        new_q = {}
        new_q["question"] = questions[index]
        new_q["answers"] = answers[index]
        new_q["chapter"] = chapter
        new_q["correct"] = correct[index]
        fullOut.append(new_q)
        
        
                
#returns a) True, line, b) False, line if next is answer, c) false, "" if neither
def check_question(line):
    if string_break_question in line:
        qnew = line.index(string_break_question) + len(string_break_question)
        length_stop = len(line)-len("</span></div>")
        line = line[qnew:length_stop]
        line = re.sub(r'<.*?>', "", line)
        if line[0:2]!='a.':
            return True,line
        else:
            return False,line
    return False,""

#returns True, answer, index
def get_full_answer(index):
    global content
    answer = ""
    started = False
    changed_index = 0
    while 1==1:
        line = content[index+changed_index]
        if string_break_question in line:
            if string_new_question in line:
                return changed_index,answer
            start = line.index(string_break_question) + len(string_break_question)
            length_stop = len(line)-len("</span></div>")
            line = line[start:length_stop]
            line = re.sub(r'<.*?>', "", line)
            if started == True and line[0:2] in answer_marks:
                return changed_index,answer
            elif started == False and line[0:2] not in answer_marks:
                return -1, ""
            else:
                started = True
                answer+=" "+line
                changed_index+=1
        else:
            return changed_index,answer


if __name__== "__main__" :
    main()
    print (json.dumps(fullOut))