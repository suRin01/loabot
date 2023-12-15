import moment from "moment";
process.env.TZ = 'Etc/UTC';

(()=>{
    let nowDate = moment().add(9, 'hour');
    console.log("what time is it now?")
    console.log(nowDate);
    console.log("to js date obj?")
    console.log(new Date());
    console.log(nowDate.valueOf());
    console.log(new Date(nowDate.valueOf()));
    console.log(new Date());
})()