const scriptName = "당직봇";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    const replyTemplate = functionSwithcer(room, msg);
    

    replyTemplate.forEach((jsonMessage)=>{
        replier.reply(room, jsonMessage.body);
    })

    /**
      프로키온
      랜전카
      도가토
      도비스
      시너지
      각인서 or 전각 '각인명'
      비싼전각 or 비싼각인
      카게지도 or ㅋㄱㅈㄷ
      쌀값 or 재료값
      각인 '각인명'
      떠상 '서버명'
      아바타 '캐릭명'
      정보 '캐릭명'
      장비 '캐릭명'
      장신구 '캐릭명'
      스킬 '캐릭명'
      보석 '캐릭명'
      부캐 '캐릭명'
      주급 '캐릭명'
      /분배금 '금액'
      경매장 '보석이름'
    */
}
/**
 * 
 * @param {*} msg 
 * @returns 
 */

const functionSwithcer = (msg)=>{
    switch (msg) {
        case '프로키온':
            return [{
                "type": "text",
                "body": "프로키온 답변 1",
            },{
                "type": "text",
                "body": "프로키온 답변 2",
            }]
            break;
        case '랜전카':

            break;
        case '도가토':

            break;
        case '도비스':

            break;
        
    }
    switch (true) {
        case /각인서 .*/.test(msg):
            return [{
                "type": "text",
                "body": "각인서 답변 1",
            },{
                "type": "text",
                "body": "각인서 답변 2",
            }]
            break;
        case ((/비싼전각 .*/).test(msg)):
            return [{
                "type": "text",
                "body": "비싼전각 답변 1",
            },{
                "type": "text",
                "body": "비싼전각 답변 2",
            }]

            break;
        case ((/쌀값 .*/).test(msg)):

            break;
        case ((/아바타 .*/).test(msg)):
            
            break;
        case ((/정보 .*/).test(msg)):

            break;
        case ((/장비 .*/).test(msg)):

            break;
        case ((/스킬 .*/).test(msg)):

            break;
        case ((/보석 .*/).test(msg)):

            break;
        case ((/부캐 .*/).test(msg)):

            break;
        case ((/부캐 .*/).test(msg)):

            break;
        case ((/주급 .*/).test(msg)):

            break;
        case ((/ㅂㅂㄱ .*/).test(msg)):
            const msgSplitArr = msg.split(" ");
            const value = msgSplitArr[1];

            if(isNaN(value*1)){
                return [{
                    "type": "text",
                    "body": "올바른 숫자를 입력해주세요"
                }]
            }

            const fourMemberParty = value * 57 / 80;
            const eightMemberParty = value * 133 / 160;
            return [{
                "type": "text",
                "body": "8인 입찰가: "+eightMemberParty.toFixed()+"골드\n8인 추천 입찰가: "+(eightMemberParty * 10 / 11 + 1).toFixed()+"골드"
                    +"\n4인 입찰가: "+fourMemberParty.toFixed()+"골드\n4인 추천 입찰가: "+(fourMemberParty * 10 / 11 + 1).toFixed()+"골드"
            }]
        case ((/경매장 .*/).test(msg)):

            break;

        default:
            break;
    }
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
    var textView = new android.widget.TextView(activity);
    textView.setText("Hello, World!");
    textView.setTextColor(android.graphics.Color.DKGRAY);
    activity.setContentView(textView);
}

function onStart(activity) { }

function onResume(activity) { }

function onPause(activity) { }

function onStop(activity) { }