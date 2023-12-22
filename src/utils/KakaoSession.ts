import * as fs from 'node:fs/promises';
import puppeteer, { Browser, Page, Protocol } from "puppeteer";
export class KakaoSession {
    constructor() {
        
    }
    private browser:Browser|null = null;
    private cookieString:Protocol.Network.Cookie[] = [];

    private getBrowser = async ()=>{
        if(this.browser !== null){
            return this.browser;
        }
        
        this.browser = await puppeteer.launch({headless: 'new', executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox']});
        //this.browser = await puppeteer.launch({headless: false,});
        return this.browser;
    }


    private getCookiedPage = async ():Promise<Page>=>{
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        await page.setCookie(...this.cookieString);
        return page;
    }


    public init = async ()=>{
        this.browser = await this.getBrowser();
        
        const cookiesString = await fs.readFile(__dirname+'/../auth/cookie.txt');
        this.cookieString = JSON.parse(cookiesString.toString());
        return;
    }

    public desctruct = async ()=>{
        if(this.browser !== null){
            await this.browser.close();
            return true;
        }

        return true;
        
    }

    public saveCookie = async (cookie:string)=>{
        await fs.writeFile(__dirname+'/../auth/cookie.txt', cookie);

        return;
    }

    public checkCurrentCookie = async():Promise<boolean>=>{
        const page = await this.getCookiedPage();
        await page.setViewport({
            width : 1920,
            height : 1080,
            deviceScaleFactor : 1,
            isMobile : false,
            hasTouch : false,
            isLandscape : false,
        });

        const cookiesString = await fs.readFile(__dirname+'/../auth/cookie.txt');
        if(cookiesString.byteLength !== 0){
            const cookies:[] = JSON.parse(cookiesString.toString());
            await page.setCookie(...cookies);
        }

        await page.goto('https://developers.kakao.com/');
        try {
            await page.waitForSelector("button[type=button].btn_email")
            console.log("current cookie is vaild")
            let cookies = await page.cookies();
            
            if(cookies.length === 0){
                return false;
            }

            let cookieString = "[";
            cookieString += cookies.map((cookie)=>{return JSON.stringify(cookie)}).join(",");
            cookieString += "]"


            await this.saveCookie(cookieString);
            console.log(cookieString);
            console.log("saved.");

            return true;
        } catch (error) {
            console.log("current cookie is invaild");
            
            return false
        }

    }

    public setKakaoSession = async (userId: string, userPassword: string): Promise<boolean>=>{
        const page = await this.getCookiedPage();
        await page.setViewport({
            width : 1920,
            height : 1080,
            deviceScaleFactor : 1,
            isMobile : false,
            hasTouch : false,
            isLandscape : false,
        });
        try{
            await page.goto('https://accounts.kakao.com/login/?continue=https%3A%2F%2Fdevelopers.kakao.com%2Flogin%3Fcontinue%3Dhttps%253A%252F%252Fdevelopers.kakao.com%252F&lang=ko#login');
            await page.click("input[type=checkbox][name=saveSignedIn]");
            await page.focus("input[type=text][name=loginId].tf_g");
            await page.keyboard.type(userId)
            await page.focus("input[type=password][name=password].tf_g");
            await page.keyboard.type(userPassword)
        }catch{
            console.log("Element not found.");
            return false;
        }
        await page.click("button[type=submit].submit");
        let isLogin = false;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!                                                                                        !")
        console.log("!                                 Check 2FA notification                                 !")
        console.log("!                                                                                        !")
        console.log("!                                                                                        !")
        console.log("!   If 2FA notification dosen't arrived, login proccess will be continue automatically   !")
        console.log("!                                                                                        !")
        console.log("!                                                                                        !")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        try {
            await page.waitForSelector("strong.info_address")
            await page.click("input[type=checkbox].inp_choice");
    
            await page.waitForSelector("button[type=button].btn_email")
            isLogin = true;
        } catch (error) {
            const myProfileButton = await page.$("button[type=button].btn_email")
            if(myProfileButton === null){
                isLogin = false;
            }else{
                isLogin = true;
            }
            
        }
        if(isLogin){
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log("!                                                                                        !")
            console.log("!                                     Login Success                                      !")
            console.log("!                                                                                        !")
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            const cookies = await page.cookies();
            this.cookieString = cookies;
            await fs.writeFile(__dirname+'/../auth/cookie.txt', JSON.stringify(cookies, null, 2));

            
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log("!                                                                                        !")
            console.log("!                                     Cookie Saved                                       !")
            console.log("!                                                                                        !")
            console.log("!                             Location: ./auth/cookies.json                              !")
            console.log("!                                                                                        !")
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            return true;
        }

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!                                                                                        !")
        console.log("!                                       Login Fail                                       !")
        console.log("!                                                                                        !")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return false;
        
    }
}