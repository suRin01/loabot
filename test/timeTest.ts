import axios from "axios";
import "dotenv";
process.env.TZ = 'Etc/UTC';

(async ()=>{
    const data = JSON.stringify({
        "contents": [
        {
            "parts": [
            {
                "text": "당직봇 넌 뭘 할 수 있어?"
            }
            ]
        }
        ]
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD8jSdF7EiR8S_AMGR8DaPt_6lut7cpphw`,
        headers: { 
        'Content-Type': 'application/json'
        },
        data : data
    };
    const result = await axios(config);
    const responseData = result.data;
    const responseText = responseData.candidates[0]?.content?.parts[0]?.text || '';
    console.log(responseText);
})()