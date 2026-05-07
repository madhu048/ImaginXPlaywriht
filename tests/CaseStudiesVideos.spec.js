import {test,expect,request} from '@playwright/test';
import * as fs from 'fs';


let count=1;
// After each test, append URL if the test failed
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    let attemptedUrl = testInfo.annotations.find(url =>url.type === "attemptedUrl")?.description;
    // “use the left side if it’s not null or not undefined; otherwise use the right side.”
    const failedUrl = attemptedUrl ?? await page.url();
    const workerindex = testInfo.workerIndex;
    
    const urlFil = `FailedUrls/FailedUrl_${testInfo.workerIndex}.txt`
    if(!fs.existsSync(urlFil)){
      fs.writeFileSync(urlFil, failedUrl + '\n', 'utf8');
      console.log(`❌ ${count}. Test Failed → saved URL in ${workerindex}: ${failedUrl}`);
    }else{
      fs.appendFileSync(urlFil,failedUrl+'\n','utf8');
      console.log(`❌ ${count}. Test Failed → saved URL in same ${workerindex}: ${failedUrl}`);
    }
    count++;
  }
});

// printing local date & time
const date = new Date().toLocaleDateString().replace(/[/\//]/g,'-');
const time = new Date().toLocaleTimeString().replace(/[:. ]/g,'-');
const Date_Time = `${date},${time}`;
console.log(`time is : ${Date_Time}`);

// Scroll to bottom of the page
async function scrollToBottom(page, step, delay) {
        if(!page.isClosed()){
        try {
            await page.evaluate(async ({step,delay}) => {
                for (let i = 0; i < document.body.scrollHeight; i += step) {
                window.scrollTo(0, i);
                await new Promise(resolve => setTimeout(resolve, delay)); // wait for for each scroll
                }
            },{step,delay});
            await page.waitForTimeout(1000); // wait after scroll completed
        } catch (error) {
            console.error('⚠️ Scrolling to bottom error : '+error);
        }
    }
};
// Scroll to top of the page
async function scrolltoTop(page) {
    if(!await page.isClosed()){
    try {
        await page.evaluate(()=>{
        window.scrollTo(0,0);
    });
    await page.waitForTimeout(1000);
    } catch (error) {
        console.error('⚠️ Scrolling to top error : '+error);
        }
    }
};

/**
 * @param {import('@playwright/test').Page} page  -The Playwright Page object.
 * @param {String} name -Name for the video file (e.g. 'Banner').
 */
// Take screenshot
async function takeScreenshot(page,name,testInfo) {

    if(!await page.isClosed()){
        try {

        //     await page.screenshot({ path: `screenshots/${name}_${Date_Time}.png`, fullPage: true ,timeout:5000});
            const screenshotPath = `screenshots/${name}_FullPage_${Date_Time}.png`;
                            await page.screenshot({path:screenshotPath,fullPage:true,timeout:10000});
                            // This one will attach the every screenshot manually to the html report from screenshot folder
                            await testInfo.attach(`${name}`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error('⚠️ Screenshot Error : '+error);
        }
    }
    else{
        console.error(`⚠️ Screenshot not taken for ${name}, because browser has been closed.`);
    }
}; 

async function urlStatus(page,url,key,testInfo){
    try {
            try {
                    // url loading wait time is 90 sec
                     const responseOfUrl = await page.goto(url, {timeout: 90000,waitUntil: "domcontentloaded"});
                     const statuscode = await responseOfUrl.status();
                     await page.waitForTimeout(5000);
                     // stop further loading
                    await page.evaluate(() => window.stop());
                    expect(await statuscode).toBeLessThan(400);
                    console.log(`       ✅ ${statuscode}-${url} -Loading fine in browser.`);
                    await takeScreenshot(page,key,testInfo);
                } catch (e) {
                    console.error(`       ⚠️  ${e.message}`);
                    // Checking with Http requet
                    const api = await request.newContext();
                    const urlRes = await api.get(url,{timeout:15000}); // api request waiting time 15 sec
                    let statusCode = urlRes.status();
                    if(await statusCode < 400){
                        expect.soft(await statusCode).toBeLessThan(400);
                        console.log(`       ✅ ${statusCode}-${url} -URL is healthy, ⚠️ But getting issue in browser loading..`);
                        await takeScreenshot(page,key,testInfo);
                    }else{
                            expect.soft(false).toBeTruthy();
                            console.error(`     ⚠️ ${statusCode}-URL is DOWN. Skipping navigation..: ${url}`);
                            await takeScreenshot(page,key,testInfo);
                            return false;
                        }
            } 
    } catch (error) {
        console.error(`     ❌ There is issue with Url: ${url}: ${error}`);
        console.error(`     ➡️ Error Message: ${error.message}`);
        console.error(`     ➡️ Error Stack: ${error.stack}`);
        expect.soft(false).toBeTruthy();
        await takeScreenshot(page,key,testInfo);
        return false;
    } 
}

async function isvideoWithSrcPlaying(page,request,testInfo,videoUrl,videoName,pageName,isBannerVideoChecking=false) {
        try {
                // Video url status checking
                const fileResponse = await request.head(videoUrl);
                console.log(`Video Url Status: ${fileResponse.status()} - ${videoUrl}`);
                expect.soft(fileResponse.status()).toBe(200);
                if(fileResponse.status()!==200){
                        console.error(`❌ Video URL not reachable (${fileResponse.status()}): ${videoUrl}`);
                        return false;
                }
                let mactchedVideo = null;
                const isVideoPlaying = await page.evaluate(async({videoUrl,isBannerVideoChecking,pageName})=>{
                    console.log(`entered into evaluate block`);
                    // Extracting the video element whitch is matched with given video url, if found will add to matchedVideo variable
                    const videos = Array.from(document.querySelectorAll('video'));
                    for(const ele of videos){
                        console.log(`entered into for loop.`);
                                if(ele.src && ele.src.includes(videoUrl)){
                                        mactchedVideo = ele;
                                        break;
                                }
                                const source = ele.querySelector('source');
                                if(source && source.src && source.src.includes(videoUrl)){
                                        mactchedVideo = ele;
                                        break;
                                }
                    }
                    if(mactchedVideo!==null){
                        if(isBannerVideoChecking){
                                // await new Promise(res => setTimeout(res, 30000)); // wait 30s
                                // return !mactchedVideo.paused && mactchedVideo.readyState > 2;

                                let t1 = mactchedVideo.readyState;
                                let count =0;
                                let videoStatus = false;
                                while(count <= 15){
                                        if(t1 < 2 && mactchedVideo.paused){
                                                await new Promise(res => setTimeout(res, 20000)); // wait 20s
                                                t1 = mactchedVideo.currentTime;
                                                count++;
                                        }else{
                                                videoStatus = true;
                                                break;
                                        }     
                                }
                                if(count == 15){`${videoName} not loaded in givne 5 minits time limit.`}
                                return videoStatus;
                        }else{
                                let t1 = mactchedVideo.currentTime;
                                let count =0;
                                let videoStatus2 = false;
                                while(count <= 15){
                                        if(t1 == 0){
                                                await new Promise(res => setTimeout(res, 20000)); // wait 20s
                                                t1 = mactchedVideo.currentTime;
                                                count++;
                                        }else{
                                                videoStatus2 = true;
                                                break;
                                        }     
                                }
                                if(count == 15){`${videoName} not loaded in givne 5 minits time limit.`}
                                return videoStatus2;                                
                                // await new Promise(res => setTimeout(res, 15000)); // wait 15s
                                // let t2 = mactchedVideo.currentTime;
                                // return t2 > t1 || t1 > 0;
                        }
                    }else{
                        console.error(`No video found with the url: ${videoUrl} on ${pageName} page. `);
                        return false;
                    }
                },{videoUrl,isBannerVideoChecking,pageName});
                if(isVideoPlaying){
                    console.log(`✅ ${videoName} video is playing fine on ${pageName} page.`);
                    return true;
                }else{
                    console.log(`⚠️ Issue with the ${videoName} video on ${pageName} page.`);
                        // await takeScreenshotEle(page,testInfo,videoUrl,videoName);
                        await takeScreenshot(page,videoName,testInfo);
                    return false;
                }
        } catch (error2) {
            console.error(`⚠️ ${videoName} video error on ${pageName}: ${error2}`);
                //   await takeScreenshotEle(page,testInfo,videoUrl,videoName);
                  await takeScreenshot(page,videoName,testInfo);
            return false;
        };
};

// Exstracting attribute value of the element with xpath
async function getAttributeWithXpath(scope,xpath,attrubuteName) {
        try {
                let attributeValue=null;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       try {
                                const page = scope.page(); // it will extract the main page onject from scope parameter
                                await page.locator(xpath).waitFor({timeout:40000});
                                console.log(`Attribute value Extraction Timer debug`);
                                const ele = await page.locator(xpath);
                                // await ele.waitFor({timeout:60000});
                                attributeValue = await ele.getAttribute(attrubuteName);
                                console.log(`Attribute value Extraction process done for '${xpath}'.`);
                                return attributeValue;
                       } catch (error) {
                                console.error(`⚠️ Error during Attribute value Extraction for '${xpath}': ${error}`);
                                return "SampleText";
                       }
                        
                } else {
                        try {
                                await scope.locator(xpath).waitFor({timeout:40000});
                                console.log(`Attribute value Extraction Timer debug`);
                                const ele = await scope.locator(xpath);
                                // await ele.waitFor({timeout:60000});
                                attributeValue = await ele.getAttribute(attrubuteName);
                                console.log(`Attribute value Extraction process done for '${xpath}'.`);
                                return attributeValue;
                       } catch (error) {
                                console.error(`⚠️ Error during Attribute value Extraction for '${xpath}': ${error}`);
                                return "SampleText";
                       }   
                }
        } catch (error) {
                console.error(`⚠️ Error during getting the attribute value: ${error}`);
                return `⚠️ Unable to get the attribute value.`;
        }
};

const videoUrlsList = JSON.parse(
  fs.readFileSync('./CaseStudiesVideoUrls.json', 'utf8')
);
for(const videoData of videoUrlsList){
        const videoName = videoData.videoname;
        const videoUrl = videoData.videosrc;
        test(`${videoName} URL validation`, async({page,request},testInfo)=>{
                testInfo.annotations.push({type:"attemptedUrl", description: videoUrl});
                await urlStatus(page,videoUrl,videoName,testInfo);
                await scrollToBottom(page,500,500);
                // scroll to top of the page
                await scrolltoTop(page);
                const videoSrc = await getAttributeWithXpath(page,"//section[contains(@class,'linkedInPosts')]/div/div/div/video","src");
                const videoResult = await isvideoWithSrcPlaying(page,request,testInfo,await videoSrc,videoName,"Case Studies",false);
                expect.soft(videoResult).toBeTruthy();
        });
};
