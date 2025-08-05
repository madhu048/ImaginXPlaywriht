import {test,expect} from "@playwright/test";

// Browser opening for every test
async function urlStatus(page) {
     try {
            const response = await page.goto(`https://imaginxavr.com/`);
        // const response = await page.goto(`https://dev.imaginxavr.com/imaginx/`);
            try {
                    await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
            } catch (e) {
                    console.warn('⚠️ Page took too long to load fully. Continuing...');
            }
            expect(response.status()).toBeLessThan(400);
            expect.soft(await page.title()).toEqual(`imaginX - Innovate & Inspire`);
            return true;
    } catch (error) {
            console.error(`❌ There is issue with Url : ${error}`);
            console.error(`➡️ Error Message: ${error.message}`);
            console.error(`➡️ Error Stack: ${error.stack}`);
            expect.soft(true).toBeTruthy();
            return false;
    }
};
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
    if(!page.isClosed()){
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
// printing local date & time
const date = new Date().toLocaleDateString().replace(/[/\//]/g,'-');
const time = new Date().toLocaleTimeString().replace(/[:. ]/g,'-');
const Date_Time = `${date},${time}`;
console.log(`time is : ${Date_Time}`);

/**
 * @param {import('@playwright/test').Page} page  -The Playwright Page object.
 * @param {String} name -Name for the video file (e.g. 'Banner').
 */
// Take screenshot
async function takeScreenshot(page,name) {

    if(!page.isClosed()){
        try {

            await page.screenshot({ path: `screenshots/${name}_${Date_Time}.png`, fullPage: true });
        } catch (error) {
            console.error('⚠️ Screenshot error : '+error);
        }
    }
};
/**
 * 
 * @param {import('@playwright/test').Page} page  -The Playwright Page object.
 * @param {testInfo} - IT is a object like page.
 * @param {String} Imgurl -Need img url in string form.
 * @param {String} name  Name for the screenshot.
 */
// Take screenshot of element with url of element
async function takeScreenshotEle(page,testInfo,Imgurl,name) {
    if(!page.isClosed()){
        try {
                const fullUrl = Imgurl;
                const fileName = fullUrl.split('/').pop(); // it will give last part of url
                const ele = await page.locator(`(//*[contains(@src, "${fileName}")]/parent::*)[1]`);
                await ele.waitFor({timeout:40000});
                const screenshotPath = `ErrorScreenshots/${name}error_${Date_Time}.png`;
                await ele.screenshot({path:screenshotPath});
                // This one will attach the every screenshot manually to the html report from screenshot folder
                await testInfo.attach(`${name}error`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error(`⚠️ ${name} screenshot error : ${error}`);
        }
    }
};
// Take screenshot of element with xpath of element
async function takeScreenshotEle2(page,testInfo,xpath,name) {
    if(!page.isClosed()){
        try {
                const ele = await page.locator(xpath);
                await ele.waitFor({timeout:40000});
                const screenshotPath = `ErrorScreenshots/${name}error_${Date_Time}.png`;
                await ele.screenshot({path:screenshotPath});
                // This one will attach the every screenshot manually to the html report from screenshot folder
                await testInfo.attach(`${name}error`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error(`⚠️ ${name} screenshot error : ${error}`);
        }
    }
};
// Hover and click any element with xpath
async function hoverAndClickWithXpath(scope,xpath) {
        try {
        //     const locator = await page.locator(xpath);
                const locator = scope.locator(xpath);
                let page;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page then it will return true
                        page = scope.page(); // it will extract the main page onject from scope parameter
                } else {
                        page = scope; // if scope is the page itself
                }
            await page.waitForTimeout(500);
            await locator.hover();
            await page.waitForTimeout(500);
            await locator.click();
            await page.waitForTimeout(2000);
            return true;
        } catch (error) {
            console.error(`⚠️ Error during hover and click: ${error}`);
            return false;
        }
};
// Hover and click any element with direct locator
async function hoverAndClickWithLocator(locator) {
        try {
            const page = locator.page(); // Get the page from locator
            await locator.waitFor({timeout:40000});
            await locator.hover();
            await page.waitForTimeout(500);
            await locator.click();
            await page.waitForTimeout(2000);
            return true;
        } catch (error) {
            console.error(`⚠️ Error during hover and click: ${error}`);
            return false;
        }
};
// Hovering the element with xpath of element
async function hoverWithXpath(scope,xpath) {
        try {
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.hover();
                       return true;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.hover();
                       return true;
                }
        } catch (error) {
                console.error(`⚠️ Error during hover: ${error}`);
                return false;
        }
};
// Hover the element with direct locator
async function hoverWithLocator(locator) {
        try {
                await locator.waitFor({ timeout: 40000});
                await locator.hover();
                return true;
        } catch (error) {
                console.error(`⚠️ Error during hover: ${error}`);
                return false;
        }
        
};
// Click the element with xpath of element
async function clickWithXpath(scope,xpath) {
        try {
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.click();
                       return true;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.click();
                       return true;
                }
        } catch (error) {
                console.error(`⚠️ Error during click: ${error}`);
                return false;
        }
};
// Click the element with direct locator
async function clickWithLocator(locator) {
        try {
                await locator.waitFor({ timeout: 40000});
                await locator.click();
                return true;
        } catch (error) {
                console.error(`⚠️ Error during click: ${error}`);
                return false;
        }
        
};
// Exstracting inner text of the element with xpath
async function getInnerTextWithXpath(scope,xpath) {
        try {
                let text=null;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       text = await ele.innerText();
                       return text;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       text = await ele.innerText();
                       return text;
                }
        } catch (error) {
                console.error(`⚠️ Error during getting innet text: ${error}`);
                return `⚠️ Unable to get the text.`;
        }
};
// Exstracting inner text of the element with locator
async function getInnetTextWithLocator(locator) {
        try {
                let text = null;
                await locator.waitFor({ timeout: 40000});
                text = await locator.innerText();
                return text;
        } catch (error) {
                console.error(`⚠️ Error during getting innet text: ${error}`);
                return `⚠️ Unable to get the text.`;
        }
        
}
// Exstracting attribute value of the element with xpath
async function getAttributeWithXpath(scope,xpath,attrubuteName) {
        try {
                let attributeValue=null;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                //        await ele.waitFor({timeout:40000});
                       attributeValue = await ele.getAttribute(attrubuteName);
                       return attributeValue;
                } else {
                        const ele = await scope.locator(xpath);
                //        await ele.waitFor({timeout:40000});
                       attributeValue = await ele.getAttribute(attrubuteName);
                       return attributeValue;
                }
        } catch (error) {
                console.error(`⚠️ Error during getting the attribute value: ${error}`);
                return `⚠️ Unable to get the attribute value.`;
        }
};
// Exstracting attribute value of the element with locator
async function getAttributeWithLocator(locator,attributeName) {
        try {
                let attributeValue = null;
                // await locator.waitFor({ timeout: 40000});
                attributeValue = await locator.getAttribute(attributeName);
                return attributeValue;
        } catch (error) {
                console.error(`⚠️ Error during getting the attribute value: ${error}`);
                return `⚠️ Unable to get the attrubute value.`;
        }
        
}
// Element checking on page
async function elementCheck(page,testInfo,elementPath,elementName,pageName) {
    try {
            const element = await page.locator(elementPath);
            await element.waitFor({timeout:40000});
            if(await element.isVisible()){
                console.log(`✅ ${elementName} is displayed on ${pageName} page.`);
                await element.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500);
                await element.hover();
                await page.waitForTimeout(500);
                return true;
            }else{
                console.log(`⚠️ Issue with the ${elementName} on ${pageName} page.`);
                await takeScreenshotEle2(page,testInfo,elementPath,elementName);
                return false;
        }
    } catch (error) {
        console.error(`⚠️ Issue with the ${elementName} on ${pageName} page. ${error}`);
        return false;
    } 
};
/**
 * 
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {String} CSSselector -CSS selector of the image element (e.g. 'img[alt="logo"]').
 * @param {String} imageName - Name for the image file (e.g. 'Logo', 'Banner').
 * @param {String} imgUrl - image 'src' value (e.g., 'https://example.com/logo.png').
 * @param {String} pageName - web page neme (e.g., "home")
 */
// Image checking
async function imageChecking(page,testInfo,imgUrl,imageName,pageName) {
             try {
                // it will store all images and check the loading of the images which are matching of given url or src value.
                const isImageLoaded = await page.evaluate((url)=>{
                            return [...document.images].some(img =>
                                        img.src === url && img.complete && img.naturalWidth > 0
                                    );
                },imgUrl);
                if(isImageLoaded){
                    console.log(`✅ ${imageName} image Displayed on ${pageName} page.`);
                    return true;
                }else{
                    console.log(`⚠️ Issue with the ${imageName} image on ${pageName} page.`);
                    await takeScreenshotEle(page,testInfo,imgUrl,imageName);
                    return false;
                }
        } catch (error1) {
                await takeScreenshotEle(page,testInfo,imgUrl,imageName);
                console.error(`⚠️ ${imageName} image error on ${pageName} page: ${error1}`);
                return false;
        };

};
/**
 * Checks if a video with a given source URL is playing and takes a screenshot.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} videoUrl - The partial or full src URL to match the video.
 * @param {string} videoName - The label/name used for video file naming.
 * @param {string} pageName - The label/name used for page naming.
 * @param {number} waitingTime - This time is to wait the video to load.
 * @param {boolean} isBannerVideoChecking - For banner video checking the value is "true", for normal video checking the value is "false".
 */
// Banner video checking
async function isvideoWithSrcPlaying(page,testInfo,videoUrl,videoName,pageName,waitingTime=5000,isBannerVideoChecking=false) {
        try {  
                const isVideoPlaying = await page.evaluate(async({videoUrl,waitingTime,isBannerVideoChecking})=>{
                    let mactchedVideo = null;
                    const delay = (ms) => new Promise(res => setTimeout(res, ms));
                    const videos = Array.from(document.querySelectorAll('video'));
                    for(const ele of videos){
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
                    await delay(waitingTime); // Wait for video to buffer and play
                    if(isBannerVideoChecking){
                        return (
                                mactchedVideo &&                     
                                !mactchedVideo.paused &&
                                mactchedVideo.readyState >= 3
                        );
                    }else{
                        return (
                            mactchedVideo &&                     
                            mactchedVideo.readyState >= 3
                        );
                    }
                   
                },{videoUrl,waitingTime,isBannerVideoChecking});
                if(isVideoPlaying){
                    console.log(`✅ ${videoName} video is playing fine on ${pageName} page.`);
                    return true;
                }else{
                    console.log(`⚠️ Issue with the ${videoName} video on ${pageName} page.`);
                    await takeScreenshotEle(page,testInfo,videoUrl,videoName);
                    return false;
                }
        } catch (error2) {
            console.error(`⚠️ ${videoName} video error on ${pageName}: ${error2}`);
            await takeScreenshotEle(page,testInfo,videoUrl,videoName);
            return false;
        };
};
/**
 * 
 * @param {import('@playwright/test').Page} page 
 * @param {String} elementXpath - Element xpath
 * @param {Number} elementXvalue - Element X value
 * @param {Number} elementYvalue - Element Y value
 * @param {String} elementName  - Element Name
 * @param {String} pageName  - Page Name
 * @returns 
 */
async function elementCoordinates(page,elementXpath,elementXvalue,elementYvalue,elementName,pageName) {
        try {
                // Header coordinates checking for page design checking
                const element = await page.locator(elementXpath);
                await element.waitFor({timeout:40000});
                const box = await element.boundingBox();
                if (!box) {
                        console.warn('⚠️ Not visible or has no bounding box.');
                        return false;
                }
                console.log(`${pageName} Page ${elementName} coordinates - x: ${box.x}, y: ${box.y}`);
                if(box.x === elementXvalue && box.y === elementYvalue){
                        console.log(`✅ ${pageName} page ${elementName} desing ok.`);
                        return true;
                }else{console.error(`⚠️ ${pageName} page ${elementName} design got broken.`);
                        return false;
                }
        } catch (error) {
                console.error(`❌ Error checking coordinates for ${elementName} on ${pageName} page:`, error.message);
                return false;
        }     
}
// Home page checking
test('Home Page', async({page},testInfo)=>{
    if(await urlStatus(page)){
        // Scroll to bottom
        await scrollToBottom(page,300,500);
        // Scroll to top
        await scrolltoTop(page);
        // take screenshot
        await takeScreenshot(page,"HomePage");
        // Logo checking
        const result =await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/imaginxlogo.svg","Logo","Home");
        // if(!result){await takeScreenshotEle(page,"img[alt='logo']","Logo")}
        expect.soft(result).toBeTruthy();
        // Banner video checking
        const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/assets/vids/-e753-4fb1-8ee7-af0035d9f693.mp4","BannerVideo","Home",5000,true);
        // if(!videoRes){await takeScreenshotEle(page,"//video","BannerVideo")};
        expect.soft(videoRes).toBeTruthy();
        // header checking
        const headerCoRes = await elementCoordinates(page,"//h1[contains(normalize-space(),'Empowering Tomorrow')]",370.40625,360,"Header","Home");
        expect.soft(headerCoRes).toBeTruthy();
        const header = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Empowering Tomorrow')]","MainHeader","Home")
        expect.soft(header).toBeTruthy();
        // paragraph checking
        const para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'With over a decade of experience in VR/AR/XR technologies')]","para","Home")
        expect.soft(para).toBeTruthy();
        // Experience Innovation button checking
        const experienceInnovationButton = await elementCheck(page,testInfo,"//a[contains(normalize-space(),'Experience Innovation')]","experienceInnovationButton","Home")
        expect.soft(experienceInnovationButton).toBeTruthy();
        if(experienceInnovationButton){
                        const res8 = await hoverAndClickWithXpath(page,"//a[contains(normalize-space(),'Experience Innovation')]");
                        expect.soft(res8).toBeTruthy();
                        // Checking the Contact Us page is open or not
                        const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                        expect.soft(contactUsPageHeadr).toBeTruthy();
                        if(res8){
                                // Going back to Home page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }      
        }
        // Education button checking
        const EducationButton = await elementCheck(page,testInfo,"//li[normalize-space()='Education']","EducationButton","Home")
        expect.soft(EducationButton).toBeTruthy();
        if(EducationButton){
            // Jet engine image checking
            const jetEngineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/educational.png","JetEngine","Home");
            expect.soft(jetEngineImg).toBeTruthy();
            // Education Header checking
            const educationHeader = await elementCheck(page,testInfo,"//h2[normalize-space()='Revolutionizing Learning']","educationHeader","Home")
            expect.soft(educationHeader).toBeTruthy();
            // Education Para checking
            const educationPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Engage students with experiential learning through VR simulations')]","educationPara","Home")
            expect.soft(educationPara).toBeTruthy();
            // View more button checking
            const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
            expect.soft(viewMoreButton).toBeTruthy();
            if(viewMoreButton){
                        const res7 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
                        expect.soft(res7).toBeTruthy();
                        if(res7){
                                // Checking the Educational page is open or not
                                const educationalPageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Immersive Learning')]/span[contains(normalize-space(),'Solutions')])[1]","educationalPageHeadr","Educational");
                                expect.soft(educationalPageHeadr).toBeTruthy();
                                // Going back to Home page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }
                }
        }
        // Workforce button checking
        const WorkforceButton = await elementCheck(page,testInfo,"//li[normalize-space()='Workforce']","WorkforceButton","Home")
        expect.soft(WorkforceButton).toBeTruthy();
        if(WorkforceButton){
            const res6 = await hoverAndClickWithXpath(page,"//li[normalize-space()='Workforce']");
            expect.soft(res6).toBeTruthy();
            await page.waitForTimeout(1000);
            // Ice machine image checking
            const iceMachineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/workforce-tab.png","iceMachineImg","Home");
            expect.soft(iceMachineImg).toBeTruthy();
            // WorkforceHeader checking
            const WorkforceHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Training Tomorrow')]","WorkforceHeader","Home")
            expect.soft(WorkforceHeader).toBeTruthy();
            // WorkforcePara checking
            const WorkforcePara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Enhance workforce development with XR solutions designed to upskill')]","WorkforcePara","Home")
            expect.soft(WorkforcePara).toBeTruthy();
            // View more button checking
            const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
            expect.soft(viewMoreButton).toBeTruthy();
            if(viewMoreButton){
                        const res5 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
                        expect.soft(res5).toBeTruthy();
                        if(res5){
                                // Checking the Workforce page is open or not
                                const workforcePageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Workforce Development')]/span[contains(normalize-space(),'Solutions')])[1]/parent::*","workforcePageHeadr","Workforce");
                                expect.soft(workforcePageHeadr).toBeTruthy();
                                // Going back to Home page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }      
                }
        }
         // Industry button checking
        const industryButton = await elementCheck(page,testInfo,"//li[normalize-space()='Industry']","industryButton","Home")
        expect.soft(industryButton).toBeTruthy();
        if(industryButton){
            const res4 = await hoverAndClickWithXpath(page,"//li[normalize-space()='Industry']");
            expect.soft(res4).toBeTruthy();
            await page.waitForTimeout(1000);
            // Cessna machine image checking
            const cessnaMachineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/industry.png","cessnaMachineImg","Home");
            expect.soft(cessnaMachineImg).toBeTruthy();
            // IndustryHeader checking
            const industryHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Optimizing Efficiency')]","industryHeader","Home")
            expect.soft(industryHeader).toBeTruthy();
            // IndustryPara checking
            const industryPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Boost productivity and efficiency with immersive virtual training')]","industryPara","Home")
            expect.soft(industryPara).toBeTruthy();
            // View more button checking
            const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
            expect.soft(viewMoreButton).toBeTruthy();
            if(viewMoreButton){
                        const res2 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
                        expect.soft(res2).toBeTruthy();
                        // Checking the Industrial page is open or not
                        const industrialPageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Industrial Training')]/span[contains(normalize-space(),'Solutions')])[1]","industrialPageHeadr","Industrial");
                        expect.soft(industrialPageHeadr).toBeTruthy();
                        // Going back to Home page
                        await page.goBack();
                        await page.waitForLoadState("load");
                        await page.waitForTimeout(1000);
                }
        }
         // Healthcare button checking
        const healthcareButton = await elementCheck(page,testInfo,"(//li[normalize-space()='Healthcare'])[2]","healthcareButton","Home")
        expect.soft(healthcareButton).toBeTruthy();
        if(healthcareButton){
            const res1 = await hoverAndClickWithXpath(page,"(//li[normalize-space()='Healthcare'])[2]");
            expect.soft(res1).toBeTruthy();
            await page.waitForTimeout(1000);
            // Heart image checking
            const heartImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/healthcare.png","heartImg","Home");
            expect.soft(heartImg).toBeTruthy();
            // HealthcareHeader checking
            const healthcareHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Transforming Care')]","healthcareHeader","Home")
            expect.soft(healthcareHeader).toBeTruthy();
            // HealthcarePara checking
            const healthcarePara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Revolutionize patient care and medical training with our VR simulations')]","healthcarePara","Home")
            expect.soft(healthcarePara).toBeTruthy();
            // View more button checking
            const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
            expect.soft(viewMoreButton).toBeTruthy();
            if(viewMoreButton){
                        const res = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
                        expect.soft(res).toBeTruthy();
                        if(res){
                                // Checking the HealthCare page is open or not
                                const HealthCarePageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Healthcare Training')]/span[contains(normalize-space(),'Solutions')])[1]","HealthCarePageHeadr","HealthCare");
                                expect.soft(HealthCarePageHeadr).toBeTruthy();
                                // Going back to Home page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }    
                }
        }
        // Maximized ROI image checking
        const maximizedROIimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/roi.svg","maximizedROIimg","Home");
        expect.soft(maximizedROIimg).toBeTruthy(); 
        // Your Long-Term Innovation Partner image checking
        const YourLongTermInnovationPartnerimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/partner.svg","YourLongTermInnovationPartnerimg","Home");
        expect.soft(YourLongTermInnovationPartnerimg).toBeTruthy();
        // Versatile Solutions Across Sectors image checking
        const versatileSolutionsAcrossSectorsimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/solution.svg","versatileSolutionsAcrossSectorsimg","Home");
        expect.soft(versatileSolutionsAcrossSectorsimg).toBeTruthy();
        // Red Hat Logo image checking
        const redHatLogoImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/redhat-logo.png","redHatLogoImg","Home");
        expect.soft(redHatLogoImg).toBeTruthy();
        // Clint Slider checking
        const clientSlider = page.locator("//div[contains(@id,'swiper-wrapper')]");
        await clientSlider.waitFor({timeout:40000});
        expect.soft(clientSlider).toBeVisible();
        if(clientSlider.isVisible()){clientSlider.scrollIntoViewIfNeeded();}
        // Footer logo checking
        const footerLogo = await elementCheck(page,testInfo,"img[alt='imaginx logo']","FooterLogo","Home");
        expect.soft(footerLogo).toBeTruthy();
        // Mail checking
        const mail = await elementCheck(page,testInfo,"//a[normalize-space()='info@imaginxavr.com']","SiteMail","Home");
        expect.soft(mail).toBeTruthy();
        // Copyright text checking
        const copyrightText = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Copyright © 2025 • imaginX.')]","Copyrights","Home");
        expect.soft(copyrightText).toBeTruthy();
        await page.waitForTimeout(1000);
        await scrolltoTop(page);
    }else{console.log(`❌ Home Page test got Failed.`);
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Ixgenie Page
test('IXGenie Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res13 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='iXGenie'])[1]");
                    expect.soft(res13).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ IXGenie Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"IXGeniePage");
                    // Banner video checking
                    const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/assets/imgs/ixgenie.mp4","IXgeniePageBannerVideo","IXgenie",5000,true);
                    expect.soft(videoRes).toBeTruthy();
                    // header checking
                    const headerCoRes = await elementCoordinates(page,"(//h1[contains(normalize-space(),'iXGenie the Ultimate Training & Learning Platform')])[1]",175.0625,484,"Header","IXGenie");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'iXGenie the Ultimate Training & Learning Platform')])[1]","MainHeader","IXgenie")
                    expect.soft(header).toBeTruthy();
                    // paragraph checking
                    const para = await elementCheck(page,testInfo,"(//p[contains(normalize-space(),'Empowering Education, Workforce, Industry, and Healthcare')])[1]","para","IXgenie")
                    expect.soft(para).toBeTruthy();
                    // Schedule a Call button checking
                    const scheduleCallButton = await elementCheck(page,testInfo,"(//a[contains(normalize-space(),'Schedule a Call')])[1]","scheduleCallButton","IXgenie")
                    expect.soft(scheduleCallButton).toBeTruthy();
                    if(scheduleCallButton){
                                const res12 = await hoverAndClickWithXpath(page,"(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                expect.soft(res12).toBeTruthy();
                                await page.waitForTimeout(1000);
                                // Checking the Contact Us page is open or not
                                const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                                expect.soft(contactUsPageHeadr).toBeTruthy();
                                if(contactUsPageHeadr){
                                        // Going back to IXgenie page
                                        await page.goBack();
                                        await page.waitForLoadState("load");
                                        await page.waitForTimeout(1000);
                                }    
                        }
                    // Sub-header checking
                    const subHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Industry-Wide')]","subHeader","IXgenie");
                    expect.soft(subHeader).toBeTruthy();
                    // Industry & Workforce Training button checking
                    const IndustryWorkforceTrainingButton = await elementCheck(page,testInfo,"//button[normalize-space()='Industry & Workforce Training']","IndustryWorkforceTrainingButton","IXgenie")
                    expect.soft(IndustryWorkforceTrainingButton).toBeTruthy();
                    if(IndustryWorkforceTrainingButton){
                        const res11 = await hoverAndClickWithXpath(page,"//button[normalize-space()='Industry & Workforce Training']");
                        expect.soft(res11).toBeTruthy();
                        // Industry & Workforce Training sub-header1 checking
                        const IndustryWorkforceTrainingSubHeader1 = await elementCheck(page,testInfo,"//h3[normalize-space()='Advanced Equipment Training']","IndustryWorkforceTrainingSubHeader1","IXgenie")
                        expect.soft(IndustryWorkforceTrainingSubHeader1).toBeTruthy();
                        // Industry & Workforce Training sub-header2 checking
                        const IndustryWorkforceTrainingSubHeader2 = await elementCheck(page,testInfo,"//h3[normalize-space()='Remote Troubleshooting & Support']","IndustryWorkforceTrainingSubHeader2","IXgenie")
                        expect.soft(IndustryWorkforceTrainingSubHeader2).toBeTruthy();
                        // Industry & Workforce Training sub-header3 checking
                        const IndustryWorkforceTrainingSubHeader3 = await elementCheck(page,testInfo,"//h3[normalize-space()='Predictive & Preventive Maintenance']","IndustryWorkforceTrainingSubHeader3","IXgenie")
                        expect.soft(IndustryWorkforceTrainingSubHeader3).toBeTruthy();
                    }
                    // Healthcare & Medical Training button checking
                    const HealthcareMedicalTrainingButton = await elementCheck(page,testInfo,"//button[normalize-space()='Healthcare & Medical Training']","HealthcareMedicalTrainingButton","IXgenie")
                    expect.soft(HealthcareMedicalTrainingButton).toBeTruthy();
                    if(HealthcareMedicalTrainingButton){
                        const res10 = await hoverAndClickWithXpath(page,"//button[normalize-space()='Healthcare & Medical Training']");
                        expect.soft(res10).toBeTruthy();
                        // Healthcare & Medical Training sub-header1 checking
                        const HealthcareMedicalTrainingSubHeader1 = await elementCheck(page,testInfo,"//h3[normalize-space()='Surgical & Procedural Simulations']","HealthcareMedicalTrainingSubHeader1","IXgenie")
                        expect.soft(HealthcareMedicalTrainingSubHeader1).toBeTruthy();
                        // Healthcare & Medical Training sub-header2 checking
                        const HealthcareMedicalTrainingSubHeader2 = await elementCheck(page,testInfo,"//h3[normalize-space()='Medical Equipment Handling']","HealthcareMedicalTrainingSubHeader2","IXgenie")
                        expect.soft(HealthcareMedicalTrainingSubHeader2).toBeTruthy();
                        // Healthcare & Medical Training sub-header3 checking
                        const HealthcareMedicalTrainingSubHeader3 = await elementCheck(page,testInfo,"//h3[normalize-space()='Emergency Response & Crisis Management']","HealthcareMedicalTrainingSubHeader3","IXgenie")
                        expect.soft(HealthcareMedicalTrainingSubHeader3).toBeTruthy();
                    }
                    // Education & Skill Development button checking
                    const EducationSkillDevelopmentButton = await elementCheck(page,testInfo,"//button[normalize-space()='Education & Skill Development']","EducationSkillDevelopmentButton","IXgenie")
                    expect.soft(EducationSkillDevelopmentButton).toBeTruthy();
                    if(EducationSkillDevelopmentButton){
                        const res9 = await hoverAndClickWithXpath(page,"//button[normalize-space()='Education & Skill Development']");
                        expect.soft(res9).toBeTruthy();
                        // Education & Skill Development sub-header1 checking
                        const EducationSkillDevelopmentSubHeader1 = await elementCheck(page,testInfo,"//h3[normalize-space()='STEM, History, and Arts in VR']","EducationSkillDevelopmentSubHeader1","IXgenie")
                        expect.soft(EducationSkillDevelopmentSubHeader1).toBeTruthy();
                        // Education & Skill Development sub-header2 checking
                        const EducationSkillDevelopmentSubHeader2 = await elementCheck(page,testInfo,"//h3[normalize-space()='Virtual Lab Simulations']","EducationSkillDevelopmentSubHeader2","IXgenie")
                        expect.soft(EducationSkillDevelopmentSubHeader2).toBeTruthy();
                        // Education & Skill Development sub-header3 checking
                        const EducationSkillDevelopmentSubHeader3 = await elementCheck(page,testInfo,"//h3[normalize-space()='AI-Powered Learning Assistants']","EducationSkillDevelopmentSubHeader3","IXgenie")
                        expect.soft(EducationSkillDevelopmentSubHeader3).toBeTruthy();
                    }
                    // Ixgenie image checking
                    const IxgenieImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/industry-workforce-training.png","IXgenie","IXgenie");
                    expect.soft(IxgenieImg).toBeTruthy();
                    // IXgenie page sub header2
                    const IXgeniePagesubHeader2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='iXGenie']","SubHeader2","IXgenie");
                    expect.soft(IXgeniePagesubHeader2).toBeTruthy();
                    // IXgenie page sub header3
                    const IXgeniePagesubHeader3 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Seamless']","SubHeader3","IXgenie");
                    expect.soft(IXgeniePagesubHeader3).toBeTruthy();
                    // Ixgenie image2 checking
                    const IxgenieImg2 = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/iXGenie-connect.png","IXgenie2","IXgenie");
                    expect.soft(IxgenieImg2).toBeTruthy();
                    // IXgenie page sub header4
                    const IXgeniePagesubHeader4 = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Experience the future of learning')]","SubHeader4","IXgenie");
                    expect.soft(IXgeniePagesubHeader4).toBeTruthy();
                    // Unlimited Users image checking
                    const UnlimitedUsersImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/unlimited-users-and-faculty-students.png","UnlimitedUsersImg","IXgenie");
                    expect.soft(UnlimitedUsersImg).toBeTruthy();
                    // Custom Simulation image checking
                    const CustomSimulationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/simulations.png","CustomSimulationImg","IXgenie");
                    expect.soft(CustomSimulationImg).toBeTruthy();
                    // Learn/Guided - Assessment Evaluation Summary image checking
                    const LearnGuidedAssessmentImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/pedagogy-experts.png","LearnGuidedAssessmentImg","IXgenie");
                    expect.soft(LearnGuidedAssessmentImg).toBeTruthy();
                    // Pedagogy Experts image checking
                    const PedagogyExpertsImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/gamification-icon.png","PedagogyExpertsImg","IXgenie");
                    expect.soft(PedagogyExpertsImg).toBeTruthy();
                    // Gamification image checking
                    const GamificationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/multiplayer-icon.png","GamificationImg","IXgenie");
                    expect.soft(GamificationImg).toBeTruthy();
                    // Multiplayer image checking
                    const MultiplayerImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/assignments-icon.png","MultiplayerImg","IXgenie");
                    expect.soft(MultiplayerImg).toBeTruthy();
                    // Auto Grading image checking
                    const AutoGradingImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/auto-grading-icon.png","AutoGradingImg","IXgenie");
                    expect.soft(AutoGradingImg).toBeTruthy();
                    // AI image checking
                    const AIImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/ai-icon.png","AIImg","IXgenie");
                    expect.soft(AIImg).toBeTruthy();
                    // System Integration  image checking
                    const SystemIntegrationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/lms-integration-icon.png","SystemIntegrationImg","IXgenie");
                    expect.soft(SystemIntegrationImg).toBeTruthy();
                    // Case studies header checking
                    const caseStudeisText = await elementCheck(page,testInfo,"//h1/span[normalize-space()='Studies']","CaseStudiesHeader","IXgenie");
                    expect.soft(caseStudeisText).toBeTruthy();
                    // Video1 checking
                    // Asset Management Process video thumbnail checking
                    const assetManagementProcessVideoThumbnail = await imageChecking(page,testInfo,"https://www.imaginxavr.com/uploads/videos/asset-management-process17455083702547191745508370.jpg","assetManagementProcessVideoThumbnail","IXgenie");
                    expect.soft(assetManagementProcessVideoThumbnail).toBeTruthy();
                    if(assetManagementProcessVideoThumbnail){
                        const res8 =  await hoverAndClickWithXpath(page,"//img[@src='https://www.imaginxavr.com/uploads/videos/asset-management-process17455083702547191745508370.jpg']");
                        expect.soft(res8).toBeTruthy();
                        // video pop-up checking
                        const assetManagementProcessVideoPopUp = await elementCheck(page,testInfo,"//div[@class='grtvideo-popup-content']","assetManagementProcessVideoPopUp","IXgenie");
                        expect.soft(assetManagementProcessVideoPopUp).toBeTruthy();
                        await page.waitForTimeout(2000);
                        if(assetManagementProcessVideoPopUp){
                            // it will check the video is playing or not
                            const assetManagementProcessVideo = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/videos/asset-management-process17466245198830021746624519.mp4","assetManagementProcessVideo","IXgenie",10000,false);
                            expect.soft(assetManagementProcessVideo).toBeTruthy();
                            const res7 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                            expect.soft(res7).toBeTruthy();
                        }
                    }
                    // Video2 checking
                    // Machine Installation with AI video thumbnail checking
                    const MachineInstallationWithAIVideoThumbnail = await imageChecking(page,testInfo,"https://www.imaginxavr.com/uploads/videos/filtrex-with-ai17455871506053571745587150.png","MachineInstallationWithAIVideoThumbnail","IXgenie");
                    expect.soft(MachineInstallationWithAIVideoThumbnail).toBeTruthy();
                    if(MachineInstallationWithAIVideoThumbnail){
                        const res6 = await hoverAndClickWithXpath(page,"//img[@src='https://www.imaginxavr.com/uploads/videos/filtrex-with-ai17455871506053571745587150.png']");
                        expect.soft(res6).toBeTruthy();
                        // video pop-up checking
                        const MachineInstallationWithAIVideoPopUp = await elementCheck(page,testInfo,"//div[@class='grtvideo-popup-content']","MachineInstallationWithAIVideoPopUp","IXgenie");
                        expect.soft(MachineInstallationWithAIVideoPopUp).toBeTruthy();
                        await page.waitForTimeout(2000);
                        if(MachineInstallationWithAIVideoPopUp){
                            // it will check the video is playing or not
                            const MachineInstallationWithAIVideo = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/videos/filtrex-with-ai17455870359219241745587035.mp4","MachineInstallationWithAIVideo","IXgenie",10000,false);
                            expect.soft(MachineInstallationWithAIVideo).toBeTruthy();
                            const res5 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                            expect.soft(res5).toBeTruthy();
                        }
                    }
                    // Video3 checking
                    // College - Virtual tour video thumbnail checking
                    const CollegeVirtualTourVideoThumbnail = await imageChecking(page,testInfo,"https://www.imaginxavr.com/uploads/videos/college--virtual-tour-17466237137678411746623713.jpg","CollegeVirtualTourVideoThumbnail","IXgenie");
                    expect.soft(CollegeVirtualTourVideoThumbnail).toBeTruthy();
                    if(CollegeVirtualTourVideoThumbnail){
                        const res4 = await hoverAndClickWithXpath(page,"//img[@src='https://www.imaginxavr.com/uploads/videos/college--virtual-tour-17466237137678411746623713.jpg']");
                        expect.soft(res4).toBeTruthy();
                        // video pop-up checking
                        const CollegeVirtualTourVideoPopUp = await elementCheck(page,testInfo,"//div[@class='grtvideo-popup-content']","CollegeVirtualTourVideoPopUp","IXgenie");
                        expect.soft(CollegeVirtualTourVideoPopUp).toBeTruthy();
                        await page.waitForTimeout(2000);
                        if(CollegeVirtualTourVideoPopUp){
                            // it will check the video is playing or not
                            const CollegeVirtualTourVideo = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/videos/college--virtual-tour-17466236458159011746623645.mp4","CollegeVirtualTourVideo","IXgenie",10000,false);
                            expect.soft(CollegeVirtualTourVideo).toBeTruthy();
                            const res3 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                            expect.soft(res3).toBeTruthy();
                        }
                    }
                    // Video4 checking
                    // Human Anatomy video thumbnail checking
                    const HumanAnatomyVideoThumbnail = await imageChecking(page,testInfo,"https://www.imaginxavr.com/uploads/videos/human-anatomy17466411323603661746641132.jpg","HumanAnatomyVideoThumbnail","IXgenie");
                    expect.soft(HumanAnatomyVideoThumbnail).toBeTruthy();
                    if(HumanAnatomyVideoThumbnail){
                        const res2 = await hoverAndClickWithXpath(page,"//img[@src='https://www.imaginxavr.com/uploads/videos/human-anatomy17466411323603661746641132.jpg']");
                        expect.soft(res2).toBeTruthy();
                        // video pop-up checking
                        const HumanAnatomyVideoPopUp = await elementCheck(page,testInfo,"//div[@class='grtvideo-popup-content']","HumanAnatomyVideoPopUp","IXgenie");
                        expect.soft(HumanAnatomyVideoPopUp).toBeTruthy();
                        await page.waitForTimeout(2000);
                        if(HumanAnatomyVideoPopUp){
                            // it will check the video is playing or not
                            const HumanAnatomyVideo = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/videos/human-anatomy17466411329077561746641132.mp4","HumanAnatomyVideo","IXgenie",10000,false);
                            expect.soft(HumanAnatomyVideo).toBeTruthy();
                            const res1 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                            expect.soft(res1).toBeTruthy();
                        }
                    }
                    // Checking the view more button
                    const ViewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","ViewMoreButton","IXgenie");
                    expect.soft(ViewMoreButton).toBeTruthy();
                    if(ViewMoreButton){
                        const res = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
                        expect.soft(res).toBeTruthy();
                        // Checking the Case Studies page is open or not
                        const caseStudiesPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Case')]/span[normalize-space()='Studies']","caseStudiesPageHeadr","CaseStudies");
                        expect.soft(caseStudiesPageHeadr).toBeTruthy();
                        if(res){
                                // Going back to IXgenie page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                                await scrolltoTop(page);
                                await page.waitForTimeout(1000);
                        }
                    }
                    await page.waitForTimeout(1000);
                    await scrolltoTop(page);
            } catch (error) {
                    console.error(error);
            }
    }else{console.log(`❌ IXGenie Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Edmentor AI Page
test('EdMentor AI Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res2 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='EdMentor AI'])[1]");
                    expect.soft(res2).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Edmentor AI Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"EdmentorAIPage");
                    const headerCoRes = await elementCoordinates(page,"//h1[normalize-space()='EdMentor AI']",448,194,"Header","Edmentor AI");
                    expect.soft(headerCoRes).toBeTruthy();
                    // Header checking
                    const header = await elementCheck(page,testInfo,"//h1[normalize-space()='EdMentor AI']","Header","EdmentorAI");
                    expect.soft(header).toBeTruthy();
                    // Sub Header checking
                    const SubHeader = await elementCheck(page,testInfo,"//h2[normalize-space()='Smarter Student Services, Powered by AI + XR']","SubHeader","EdmentorAI");
                    expect.soft(SubHeader).toBeTruthy();
                    // Main content checking
                    const MainContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'EdMentor AI is an intelligent assistant designed to help institutions')]","MainContent","EdmentorAI");
                    expect.soft(MainContent).toBeTruthy();
                    // Header2 checking
                    const header2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Key']/following::span[normalize-space()='Features']","Header2","EdmentorAI");
                    expect.soft(header2).toBeTruthy();
                    // AI-Powered Advising Assistant text checking
                    const AIPoweredAdvisingAssistantText = await elementCheck(page,testInfo,"//h3[normalize-space()='AI-Powered Advising Assistant']","AIPoweredAdvisingAssistantText","EdmentorAI");
                    expect.soft(AIPoweredAdvisingAssistantText).toBeTruthy();
                    // AI-Powered Advising Assistant image checking
                    const AIPoweredAdvisingAssistantImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/ai-icon.svg","AIPoweredAdvisingAssistantImg","EdmentorAI");
                    expect.soft(AIPoweredAdvisingAssistantImg).toBeTruthy();
                    // FAFSA Status & Financial Aid Tracker text checking
                    const FAFSAStatusFinancialAidTrackerText = await elementCheck(page,testInfo,"//h3[normalize-space()='FAFSA Status & Financial Aid Tracker']","FAFSAStatusFinancialAidTrackerText","EdmentorAI");
                    expect.soft(FAFSAStatusFinancialAidTrackerText).toBeTruthy();
                    // FAFSA Status & Financial Aid Tracker image checking
                    const FAFSAStatusFinancialAidTrackerImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/faid-icon.svg","FAFSAStatusFinancialAidTrackerImg","EdmentorAI");
                    expect.soft(FAFSAStatusFinancialAidTrackerImg).toBeTruthy();
                    // Scholarship Application Evaluator text checking
                    const ScholarshipApplicationEvaluatorText = await elementCheck(page,testInfo,"//h3[normalize-space()='Scholarship Application Evaluator']","ScholarshipApplicationEvaluatorText","EdmentorAI");
                    expect.soft(ScholarshipApplicationEvaluatorText).toBeTruthy();
                    // Scholarship Application Evaluator image checking
                    const ScholarshipApplicationEvaluatorImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/scholarship-icon.svg","ScholarshipApplicationEvaluatorImg","EdmentorAI");
                    expect.soft(ScholarshipApplicationEvaluatorImg).toBeTruthy();
                    // Administrative Process Automation text checking
                    const AdministrativeProcessAutomationText = await elementCheck(page,testInfo,"//h3[normalize-space()='Administrative Process Automation']","AdministrativeProcessAutomationText","EdmentorAI");
                    expect.soft(AdministrativeProcessAutomationText).toBeTruthy();
                    // Administrative Process Automation image checking
                    const AdministrativeProcessAutomationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/automation-icon.svg","AdministrativeProcessAutomationImg","EdmentorAI");
                    expect.soft(AdministrativeProcessAutomationImg).toBeTruthy();
                    // Institutional Benifits Sub header text checking
                    const InstitutionalBenifitsText = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Institutional']/following::span[normalize-space()='Benefits']","InstitutionalBenifitsText","EdmentorAI");
                    expect.soft(InstitutionalBenifitsText).toBeTruthy();
                    // Institutional Benifits image checking
                    const InstitutionalBenifitsImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/benefits.png","InstitutionalBenifitsImg","EdmentorAI");
                    expect.soft(InstitutionalBenifitsImg).toBeTruthy();
                    // Seamless Integration header text checking
                    const SeamlessIntegrationText = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Seamless']/following::span[normalize-space()='Integration']","SeamlessIntegrationText","EdmentorAI");
                    expect.soft(SeamlessIntegrationText).toBeTruthy();
                    // SIS Integration image checking
                    const SISIntegrationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/sis-icon.png","SISIntegrationImg","EdmentorAI");
                    expect.soft(SISIntegrationImg).toBeTruthy();
                    // SIS Integration text checking
                    const SISIntegrationText = await elementCheck(page,testInfo,"//h3[normalize-space()='SIS Integration']","SISIntegrationText","EdmentorAI");
                    expect.soft(SISIntegrationText).toBeTruthy();
                    // CRM Integration image checking
                    const CRMIntegrationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/crm-icon.png","CRMIntegrationImg","EdmentorAI");
                    expect.soft(CRMIntegrationImg).toBeTruthy();
                    // CRM Integration text checking
                    const CRMIntegrationText = await elementCheck(page,testInfo,"//h3[normalize-space()='CRM Integration']","CRMIntegrationText","EdmentorAI");
                    expect.soft(CRMIntegrationText).toBeTruthy();
                    // LMS Integration image checking
                    const LMSIntegrationImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/lms-icon.png","LMSIntegrationImg","EdmentorAI");
                    expect.soft(LMSIntegrationImg).toBeTruthy();
                    // LMS Integration text checking
                    const LMSIntegrationText = await elementCheck(page,testInfo,"//h3[normalize-space()='LMS Integration']","LMSIntegrationText","EdmentorAI");
                    expect.soft(LMSIntegrationText).toBeTruthy();
                    // Data Protection & Privacy Policy button checking
                    const DataProtectionPrivacyPolicyButton = await elementCheck(page,testInfo,"//a[normalize-space()='Data Protection & Privacy Policy' and contains(@class,'bg-xgreen')]","DataProtectionPrivacyPolicyButton","EdmentorAI");
                    expect.soft(DataProtectionPrivacyPolicyButton).toBeTruthy();
                    if(DataProtectionPrivacyPolicyButton){
                        const res1 = await hoverAndClickWithXpath(page,"//a[normalize-space()='Data Protection & Privacy Policy' and contains(@class,'bg-xgreen')]");
                        expect.soft(res1).toBeTruthy();
                        // Checking the Data Protection & Privacy Policy page is open or not
                        const DataProtectionPrivacyPolicyPageHeadr = await elementCheck(page,testInfo,"//h1[normalize-space()='Data Protection & Privacy Policy']","DataProtectionPrivacyPolicyPageHeadr","DataProtectionPrivacyPolicy");
                        expect.soft(DataProtectionPrivacyPolicyPageHeadr).toBeTruthy();
                        if(res1){
                                // Going back to Edmentor AI page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }
                    }
                    // Ready to Transform Your Institution header text checking
                    const ReadyToTransformYourInstitutionText = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Ready to Transform']/following::span[normalize-space()='Your Institution?']","ReadyToTransformYourInstitutionText","EdmentorAI");
                    expect.soft(ReadyToTransformYourInstitutionText).toBeTruthy();
                    // Contact Us button checking
                    const ContactUsButton = await elementCheck(page,testInfo,"//a[normalize-space()='Contact Us' and contains(@class,'bg-xgreen')]","ContactUsButton","EdmentorAI");
                    expect.soft(ContactUsButton).toBeTruthy();
                    if(ContactUsButton){
                        const res = await hoverAndClickWithXpath(page,"//a[normalize-space()='Contact Us' and contains(@class,'bg-xgreen')]");
                        expect.soft(res).toBeTruthy();
                        // Checking the Contact Us page is open or not
                        const contacUsPageHeadr = await elementCheck(page,testInfo,"//h1[normalize-space()='Contact Us']","contacUsPageHeadr","ContactUs");
                        expect.soft(contacUsPageHeadr).toBeTruthy();
                        if(res){
                                // Going back to Edmentor AI page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                                await scrolltoTop(page);
                                await page.waitForTimeout(1000);
                        }
                    }
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Edmentor AI Page test got Failed.`)
        expect.soft(false).toBeTruthy();
    }; 
});
// Checking Educational Page
test('Educational Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res5 = await hoverWithXpath(page,"xpath=(//a[normalize-space()='Solutions'])[1]");
                    expect.soft(res5).toBeTruthy();
                    await page.waitForTimeout(1000);
                    const res4 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Educational'])[1]");
                    expect.soft(res4).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Educational Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,800,200);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"EducationalPage");
                    // Banner video checking
                    const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/solutions/educational.mp4","EducationalPageBannerVideo","Educational",5000,true);
                    expect.soft(videoRes).toBeTruthy();
                    // header checking
                    const headerCoRes = await elementCoordinates(page,"(//h1[contains(normalize-space(),'Immersive Learning ')])[1]",487.515625,266,"Header","Educational");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Immersive Learning ')])[1]","MainHeader","Educational")
                    expect.soft(header).toBeTruthy();
                    // paragraph checking
                    const para = await elementCheck(page,testInfo,"(//p[contains(normalize-space(),'iXGenie revolutionizes education for K-12 and higher learning')])[1]","para","Educational")
                    expect.soft(para).toBeTruthy();
                    // Schedule a Call button checking
                    const scheduleCallButton = await elementCheck(page,testInfo,"(//a[contains(normalize-space(),'Schedule a Call')])[1]","scheduleCallButton","Educational")
                    expect.soft(scheduleCallButton).toBeTruthy();
                    if(scheduleCallButton){
                                const res3 = await hoverAndClickWithXpath(page,"(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                expect.soft(res3).toBeTruthy();
                                await page.waitForTimeout(1000);
                                // Checking the Contact Us page is open or not
                                const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                                expect.soft(contactUsPageHeadr).toBeTruthy();
                        if(res3){
                                // Going back to Educational page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                                }
                        }
                     // Header2 checking
                     const header2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Our Proven']","header2","Educational");
                     expect.soft(header2).toBeTruthy();
                     // Use Case1 number checking
                     const useCase1Number = await elementCheck(page,testInfo,"//div[normalize-space()='01']","useCase1Number","Educational");
                     expect.soft(useCase1Number).toBeTruthy();
                     //Use Case1 header checking
                     const useCase1Header = await elementCheck(page,testInfo,"//div[normalize-space()='STEM & Technical Training']","useCase1Header","Educational");
                     expect.soft(useCase1Header).toBeTruthy();
                     //Use Case1 para checking
                     const useCase1Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Extended Reality (XR) transforms STEM and technical training')]","useCase1Para","Educational");
                     expect.soft(useCase1Para).toBeTruthy();
                     //Use Case1 green para checking
                     const useCase1GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into STEM education not only enhances') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Educational");
                     expect.soft(useCase1GreenPara).toBeTruthy();
                     // Use Case2 number checking
                     const useCase2Number = await elementCheck(page,testInfo,"//div[normalize-space()='02']","useCase2Number","Educational");
                     expect.soft(useCase2Number).toBeTruthy();
                     //Use Case2 header checking
                     const useCase2Header = await elementCheck(page,testInfo,"//div[normalize-space()='Soft Skills Training']","useCase2Header","Educational");
                     expect.soft(useCase2Header).toBeTruthy();
                     //Use Case2 para checking
                     const useCase2Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Soft skills are essential for professional success, and XR-based')]","useCase2Para","Educational");
                     expect.soft(useCase2Para).toBeTruthy();
                     //Use Case2 green para checking
                     const useCase2GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into soft skills training provides') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Educational");
                     expect.soft(useCase2GreenPara).toBeTruthy();
                     // Use Case3 number checking
                     const useCase3Number = await elementCheck(page,testInfo,"//div[normalize-space()='03']","useCase3Number","Educational");
                     expect.soft(useCase3Number).toBeTruthy();
                     //Use Case3 header checking
                     const useCase3Header = await elementCheck(page,testInfo,"//div[normalize-space()='Design & Architecture Training']","useCase3Header","Educational");
                     expect.soft(useCase3Header).toBeTruthy();
                     //Use Case3 para checking
                     const useCase3Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR technologies are transforming architectural and design education')]","useCase3Para","Educational");
                     expect.soft(useCase3Para).toBeTruthy();
                     //Use Case3 green para checking
                     const useCase3GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into architectural and design education') and contains(@class,'bg-xgreen')]","useCase3GreenPara","Educational");
                     expect.soft(useCase3GreenPara).toBeTruthy();
                     // 3D container header checking
                     const Interactive3DContainerHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Interactive')]/span[normalize-space()='3D Container']","Interactive3DContainerHeader","Educational");
                     expect.soft(Interactive3DContainerHeader).toBeTruthy();
                     // Our Recent Posts text checking
                     const OurRecentPostsText = await elementCheck(page,testInfo,"//p[normalize-space()='Our Recent Posts']","OurRecentPostsText","Educational");
                     expect.soft(OurRecentPostsText).toBeTruthy();
                     const res2 = await hoverWithXpath(page,"//p[normalize-space()='Our Recent Posts']");
                     expect.soft(res2).toBeTruthy();
                     // Iframe interaction
                     const frame = page.frame({url:'https://experience.imaginxavr.com/cessna_wheel/'});
                     const interactiveUnityContainer = await elementCheck(page,testInfo,"//h2[span[normalize-space()='3D Container']]/following-sibling::iframe","interactiveUnityContainer","Educational");
                     expect.soft(interactiveUnityContainer).toBeTruthy();
                     // Unity build full screen button checking
                     const CessnaWheelUnityBuildFullscreenButton = await elementCheck(frame,testInfo,"//div[@id='unity-fullscreen-button']","CessnaWheelUnityBuildFullscreenButton","Educational"); 
                     expect.soft(CessnaWheelUnityBuildFullscreenButton).toBeTruthy();
                //      if(CessnaWheelUnityBuildFullscreenButton){
                //                 const CessnaWheelUnityBuildFullscreenButton = page.locator("//div[@id='unity-fullscreen-button']");
                //                 const res = await hoverAndClickWithXpath(page,"//div[@id='unity-fullscreen-button']");
                //                 expect.soft(res).toBeTruthy()
                //                 await page.waitForTimeout(1000);
                //                 await page.keyboard.down('Escape');
                //                 await page.waitForTimeout(1000);
                //         }
                     const CessnaWheelUnityBuildTitle = await getInnerTextWithXpath(frame,"//div[@id='unity-build-title']");
                     console.log(`Unity Build title is: ${CessnaWheelUnityBuildTitle}`);
                     expect.soft(CessnaWheelUnityBuildTitle.includes('Cessna Wheel')).toBeTruthy();
                     // View our website button checking
                     const ViewOurWebsiteButton = await elementCheck(page,testInfo,"(//a[normalize-space()='View our website'])[1]","ViewOurWebsiteButton","Educational");
                     expect.soft(ViewOurWebsiteButton).toBeTruthy();
                     // Follow Us on LinkedIn button checking
                     const FollowUsonLinkedInButton = await elementCheck(page,testInfo,"(//a[normalize-space()='Follow Us on LinkedIn'])[1]","FollowUsonLinkedInButton","Educational");
                     expect.soft(FollowUsonLinkedInButton).toBeTruthy();
                     // Load more posts Button checking
                     const LoadMorePostsButton = await elementCheck(page,testInfo,"(//button[normalize-space()='Load more posts'])[1]","LoadMorePostsButton","Educational");
                     expect.soft(LoadMorePostsButton).toBeTruthy();

                } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
                }
        }else{console.log(`❌ Educational Page test got Failed.`)
            expect.soft(false).toBeTruthy();
        }; 
});
// Checking Workforce Development Page
test('Workforce Development Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res2 = await hoverWithXpath(page,"xpath=(//a[normalize-space()='Solutions'])[1]");
                    expect.soft(res2).toBeTruthy();
                    await page.waitForTimeout(1000);
                    const res1 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Workforce Development'])[1]");
                    expect.soft(res1).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Workforce Development Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,800,200);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"WorkforceDevelopmentPage");
                    // Banner video checking
                    const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/solutions/workforce.mp4","WorkforcePageBannerVideo","Workforce",5000,true);
                    expect.soft(videoRes).toBeTruthy();
                    // header checking
                    const headerCoRes = await elementCoordinates(page,"(//h1[contains(normalize-space(),'Workforce Development ')])[1]",414.0625,266,"Header","Workforce Development");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Workforce Development ')])[1]","MainHeader","Workforce")
                    expect.soft(header).toBeTruthy();
                    // paragraph checking
                    const para = await elementCheck(page,testInfo,"(//p[contains(normalize-space(),'iXGenie empowers workforce development by providing immersive')])[1]","para","Workforce")
                    expect.soft(para).toBeTruthy();
                    // Schedule a Call button checking
                    const scheduleCallButton = await elementCheck(page,testInfo,"(//a[contains(normalize-space(),'Schedule a Call')])[1]","scheduleCallButton","Workforce")
                    expect.soft(scheduleCallButton).toBeTruthy();
                    if(scheduleCallButton){
                                const res = await hoverAndClickWithXpath(page,"(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                expect.soft(res).toBeTruthy();
                                await page.waitForTimeout(1000);
                                // Checking the Contact Us page is open or not
                                const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                                expect.soft(contactUsPageHeadr).toBeTruthy();
                          if(res){
                                // Going back to Workforce page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                          }
                        }
                      // Header2 checking
                     const header2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Our Proven']","header2","Workforce");
                     expect.soft(header2).toBeTruthy();
                     // Use Case1 number checking
                     const useCase1Number = await elementCheck(page,testInfo,"//div[normalize-space()='01']","useCase1Number","Workforce");
                     expect.soft(useCase1Number).toBeTruthy();
                     //Use Case1 header checking
                     const useCase1Header = await elementCheck(page,testInfo,"//div[normalize-space()='HVAC']","useCase1Header","Workforce");
                     expect.soft(useCase1Header).toBeTruthy();
                     //Use Case1 para checking
                     const useCase1Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Virtual and Augmented Reality (VR/AR) offer transformative solutions for HVAC workforce')]","useCase1Para","Workforce");
                     expect.soft(useCase1Para).toBeTruthy();
                     //Use Case1 green para checking
                     const useCase1GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'VR and AR enhance HVAC training with immersive simulations') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Workforce");
                     expect.soft(useCase1GreenPara).toBeTruthy(); 
                     // Use Case2 number checking
                     const useCase2Number = await elementCheck(page,testInfo,"//div[normalize-space()='02']","useCase2Number","Workforce");
                     expect.soft(useCase2Number).toBeTruthy();
                     //Use Case2 header checking
                     const useCase2Header = await elementCheck(page,testInfo,"//div[normalize-space()='Electrical']","useCase2Header","Workforce");
                     expect.soft(useCase2Header).toBeTruthy();
                     //Use Case2 para checking
                     const useCase2Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Virtual and Augmented Reality (VR/AR) are transforming electrician training')]","useCase2Para","Workforce");
                     expect.soft(useCase2Para).toBeTruthy();
                     //Use Case2 green para checking
                     const useCase2GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'VR and AR transform electrician training with immersive simulations') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Workforce");
                     expect.soft(useCase2GreenPara).toBeTruthy();
                     // Use Case3 number checking
                     const useCase3Number = await elementCheck(page,testInfo,"//div[normalize-space()='3' or normalize-space()='03']","useCase3Number","Workforce");
                     expect.soft(useCase3Number).toBeTruthy();
                     //Use Case3 header checking
                     const useCase3Header = await elementCheck(page,testInfo,"//div[normalize-space()='Plumbing']","useCase3Header","Workforce");
                     expect.soft(useCase3Header).toBeTruthy();
                     //Use Case3 para checking
                     const useCase3Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'In the plumbing industry, Virtual and Augmented Reality (VR/AR) are')]","useCase3Para","Workforce");
                     expect.soft(useCase3Para).toBeTruthy();
                     //Use Case3 green para checking
                     const useCase3GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'VR and AR are revolutionizing the plumbing industry by enhancing training') and contains(@class,'bg-xgreen')]","useCase3GreenPara","Workforce");
                     expect.soft(useCase3GreenPara).toBeTruthy();
                     // Our Recent Posts text checking
                     const OurRecentPostsText = await elementCheck(page,testInfo,"//p[normalize-space()='Our Recent Posts']","OurRecentPostsText","Workforce");
                     expect.soft(OurRecentPostsText).toBeTruthy();
                     // View our website button checking
                     const ViewOurWebsiteButton = await elementCheck(page,testInfo,"(//a[normalize-space()='View our website'])[1]","ViewOurWebsiteButton","Workforce");
                     expect.soft(ViewOurWebsiteButton).toBeTruthy();
                     // Follow Us on LinkedIn button checking
                     const FollowUsonLinkedInButton = await elementCheck(page,testInfo,"(//a[normalize-space()='Follow Us on LinkedIn'])[1]","FollowUsonLinkedInButton","Workforce");
                     expect.soft(FollowUsonLinkedInButton).toBeTruthy();
                     // Load more posts Button checking
                     const LoadMorePostsButton = await elementCheck(page,testInfo,"(//button[normalize-space()='Load more posts'])[1]","LoadMorePostsButton","Workforce");
                     expect.soft(LoadMorePostsButton).toBeTruthy();
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Workforce Development Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Industrial Page
test('Industrial Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res2 = await hoverWithXpath(page,"xpath=(//a[normalize-space()='Solutions'])[1]");
                    expect.soft(res2).toBeTruthy();
                    await page.waitForTimeout(1000);
                    const res1 =  await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Industrial'])[1]");
                    expect.soft(res1).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Industrial Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,800,200);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"IndustrialPage");
                    // Banner video checking
                    const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/solutions/industrial.mp4","IndustrialPageBannerVideo","Industrial",5000,true);
                    expect.soft(videoRes).toBeTruthy();
                    // header checking
                    const headerCoRes =  await elementCoordinates(page,"(//h1[contains(normalize-space(),'Industrial Training')])[1]",514.765625,266,"Header","Industrial");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Industrial Training')])[1]","MainHeader","Industrial")
                    expect.soft(header).toBeTruthy();
                    // paragraph checking
                    const para = await elementCheck(page,testInfo,"(//p[contains(normalize-space(),'iXGenie transforms industrial solutions through immersive virtual')])[1]","para","Industrial")
                    expect.soft(para).toBeTruthy();
                    // Schedule a Call button checking
                    const scheduleCallButton = await elementCheck(page,testInfo,"(//a[contains(normalize-space(),'Schedule a Call')])[1]","scheduleCallButton","Industrial")
                    expect.soft(scheduleCallButton).toBeTruthy();
                    if(scheduleCallButton){
                                const res = await hoverAndClickWithXpath(page,"(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                expect.soft(res).toBeTruthy();
                                await page.waitForTimeout(1000);

                                // Checking the Contact Us page is open or not
                                const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                                expect.soft(contactUsPageHeadr).toBeTruthy();
                        if(res){
                                // Going back to Industrial page
                                await page.goBack();
                                await page.waitForLoadState("load");
                                await page.waitForTimeout(1000);
                        }
                        }
                      // Header2 checking
                     const header2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Our Proven']","header2","Industrial");
                     expect.soft(header2).toBeTruthy();  
                     // Use Case1 number checking
                     const useCase1Number = await elementCheck(page,testInfo,"//div[normalize-space()='01']","useCase1Number","Industrial");
                     expect.soft(useCase1Number).toBeTruthy();
                     //Use Case1 header checking
                     const useCase1Header = await elementCheck(page,testInfo,"//div[normalize-space()='Asset Management']","useCase1Header","Industrial");
                     expect.soft(useCase1Header).toBeTruthy();
                     //Use Case1 para checking
                     const useCase1Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Extended Reality (XR) and digital twin technologies are reshaping')]","useCase1Para","Industrial");
                     expect.soft(useCase1Para).toBeTruthy();
                     //Use Case1 green para checking
                     const useCase1GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR and digital twins enhance maintenance by providing real-time') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Industrial");
                     expect.soft(useCase1GreenPara).toBeTruthy();
                     // Use Case2 number checking
                     const useCase2Number = await elementCheck(page,testInfo,"//div[normalize-space()='02']","useCase2Number","Industrial");
                     expect.soft(useCase2Number).toBeTruthy();
                     //Use Case2 header checking
                     const useCase2Header = await elementCheck(page,testInfo,"//div[normalize-space()='Training and Safety']","useCase2Header","Industrial");
                     expect.soft(useCase2Header).toBeTruthy();
                     //Use Case2 para checking
                     const useCase2Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR technologies, integrated with digital twin asset management')]","useCase2Para","Industrial");
                     expect.soft(useCase2Para).toBeTruthy();
                     //Use Case2 green para checking
                     const useCase2GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR and digital twins improve training and safety') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Industrial");
                     expect.soft(useCase2GreenPara).toBeTruthy();
                     // Use Case3 number checking
                     const useCase3Number = await elementCheck(page,testInfo,"//div[normalize-space()='03']","useCase3Number","Industrial");
                     expect.soft(useCase3Number).toBeTruthy();
                     //Use Case3 header checking
                     const useCase3Header = await elementCheck(page,testInfo,"//div[normalize-space()='Streamlining Operations']","useCase3Header","Industrial");
                     expect.soft(useCase3Header).toBeTruthy();
                     //Use Case3 para checking
                     const useCase3Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies streamlines operations by enhancing')]","useCase3Para","Industrial");
                     expect.soft(useCase3Para).toBeTruthy();
                     //Use Case3 green para checking
                     const useCase3GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies enhances operational efficiency') and contains(@class,'bg-xgreen')]","useCase3GreenPara","Industrial");
                     expect.soft(useCase3GreenPara).toBeTruthy();
                     // Our Recent Posts text checking
                     const OurRecentPostsText = await elementCheck(page,testInfo,"//p[normalize-space()='Our Recent Posts']","OurRecentPostsText","Industrial");
                     expect.soft(OurRecentPostsText).toBeTruthy();
                     // View our website button checking
                     const ViewOurWebsiteButton = await elementCheck(page,testInfo,"(//a[normalize-space()='View our website'])[1]","ViewOurWebsiteButton","Industrial");
                     expect.soft(ViewOurWebsiteButton).toBeTruthy();
                     // Follow Us on LinkedIn button checking
                     const FollowUsonLinkedInButton = await elementCheck(page,testInfo,"(//a[normalize-space()='Follow Us on LinkedIn'])[1]","FollowUsonLinkedInButton","Industrial");
                     expect.soft(FollowUsonLinkedInButton).toBeTruthy();
                     // Load more posts Button checking
                     const LoadMorePostsButton = await elementCheck(page,testInfo,"(//button[normalize-space()='Load more posts'])[1]","LoadMorePostsButton","Industrial");
                     expect.soft(LoadMorePostsButton).toBeTruthy();
            } catch (error) {
                    console.error(`⚠️ ${error}`);
            }
    }else{console.log(`❌ Industrial Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Healthcare Page
test('Healthcare Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res2 = await hoverWithXpath(page,"xpath=(//a[normalize-space()='Solutions'])[1]");
                    expect.soft(res2).toBeTruthy();
                    await page.waitForTimeout(1000);
                    const res1 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Healthcare'])[1]");
                    expect.soft(res1).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Healthcare Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,800,200);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"HealthcarePage");
                    // Banner video checking
                    const videoRes = await isvideoWithSrcPlaying(page,testInfo,"https://www.imaginxavr.com/uploads/solutions/healthcare.mp4","HealthcarePageBannerVideo","Healthcare",5000,true);
                    expect.soft(videoRes).toBeTruthy();
                    // header checking
                    const headerCoRes = await elementCoordinates(page,"(//h1[contains(normalize-space(),'Healthcare Training')])[1]",489.53125,266,"Header","Healthcare");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Healthcare Training')])[1]","MainHeader","Healthcare")
                    expect.soft(header).toBeTruthy();
                    // paragraph checking
                    const para = await elementCheck(page,testInfo,"(//p[contains(normalize-space(),'iXGenie revolutionizes education for K-12 and higher')])[1]","para","Healthcare")
                    expect.soft(para).toBeTruthy();
                    // Schedule a Call button checking
                    const scheduleCallButton = await elementCheck(page,testInfo,"(//a[contains(normalize-space(),'Schedule a Call')])[1]","scheduleCallButton","Healthcare")
                    expect.soft(scheduleCallButton).toBeTruthy();
                    if(scheduleCallButton){
                                // const scheduleCallButton = page.locator("(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                // await scheduleCallButton.waitFor({timeout:40000});
                                const res = await hoverAndClickWithXpath(page,"(//a[contains(normalize-space(),'Schedule a Call')])[1]");
                                expect.soft(res).toBeTruthy();
                                await page.waitForTimeout(1000);

                                // Checking the Contact Us page is open or not
                                const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
                                expect.soft(contactUsPageHeadr).toBeTruthy();
                                if(res){
                                        // Going back to Healthcare page
                                        await page.goBack();
                                        await page.waitForLoadState("load");
                                        await page.waitForTimeout(1000);
                                }  
                        }
                        // Header2 checking
                     const header2 = await elementCheck(page,testInfo,"//h2/span[normalize-space()='Our Proven']","header2","Healthcare");
                     expect.soft(header2).toBeTruthy();
                     // Use Case1 number checking
                     const useCase1Number = await elementCheck(page,testInfo,"//div[normalize-space()='01']","useCase1Number","Healthcare");
                     expect.soft(useCase1Number).toBeTruthy();
                     //Use Case1 header checking
                     const useCase1Header = await elementCheck(page,testInfo,"//div[normalize-space()='Nursing']","useCase1Header","Healthcare");
                     expect.soft(useCase1Header).toBeTruthy();
                     //Use Case1 para checking
                     const useCase1Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR technologies are revolutionizing nursing education by offering')]","useCase1Para","Healthcare");
                     expect.soft(useCase1Para).toBeTruthy();
                     //Use Case1 green para checking
                     const useCase1GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into nursing education enhances') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Healthcare");
                     expect.soft(useCase1GreenPara).toBeTruthy();
                     // Use Case2 number checking
                     const useCase2Number = await elementCheck(page,testInfo,"//div[normalize-space()='02']","useCase2Number","Healthcare");
                     expect.soft(useCase2Number).toBeTruthy();
                     //Use Case2 header checking
                     const useCase2Header = await elementCheck(page,testInfo,"//div[normalize-space()='Surgical Sciences']","useCase2Header","Healthcare");
                     expect.soft(useCase2Header).toBeTruthy();
                     //Use Case2 para checking
                     const useCase2Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Surgical training requires precision, and XR technologies')]","useCase2Para","Healthcare");
                     expect.soft(useCase2Para).toBeTruthy();
                     //Use Case2 green para checking
                     const useCase2GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into surgical education provides safer') and contains(@class,'bg-xgreen')]","useCase1GreenPara","Healthcare");
                     expect.soft(useCase2GreenPara).toBeTruthy();
                     // Use Case3 number checking
                     const useCase3Number = await elementCheck(page,testInfo,"//div[normalize-space()='03']","useCase3Number","Healthcare");
                     expect.soft(useCase3Number).toBeTruthy();
                     //Use Case3 header checking
                     const useCase3Header = await elementCheck(page,testInfo,"//div[normalize-space()='Pharmaceutical Training & Research']","useCase3Header","Healthcare");
                     expect.soft(useCase3Header).toBeTruthy();
                     //Use Case3 para checking
                     const useCase3Para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'XR technologies are transforming pharmaceutical education and research')]","useCase3Para","Healthcare");
                     expect.soft(useCase3Para).toBeTruthy();
                     //Use Case3 green para checking
                     const useCase3GreenPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Integrating XR technologies into pharmaceutical education and research') and contains(@class,'bg-xgreen')]","useCase3GreenPara","Healthcare");
                     expect.soft(useCase3GreenPara).toBeTruthy();
                     // Interactive 3D Container header checking
                     const interactive3DContainerHeader = await elementCheck(page,testInfo,"//h2/span[normalize-space()='3D Container']","interactive3DContainerHeader","HealthCare");
                     expect.soft(interactive3DContainerHeader).toBeTruthy();
                     // Interactive unity build container checking
                     const interactiveUnityContainer = await elementCheck(page,testInfo,"//h2[span[normalize-space()='3D Container']]/following-sibling::iframe","interactiveUnityContainer","Educational");
                     expect.soft(interactiveUnityContainer).toBeTruthy();
                     // Our Recent Posts text checking
                     const OurRecentPostsText = await elementCheck(page,testInfo,"//p[normalize-space()='Our Recent Posts']","OurRecentPostsText","Healthcare");
                     expect.soft(OurRecentPostsText).toBeTruthy();
                     // View our website button checking
                     const ViewOurWebsiteButton = await elementCheck(page,testInfo,"(//a[normalize-space()='View our website'])[1]","ViewOurWebsiteButton","Healthcare");
                     expect.soft(ViewOurWebsiteButton).toBeTruthy();
                     // Follow Us on LinkedIn button checking
                     const FollowUsonLinkedInButton = await elementCheck(page,testInfo,"(//a[normalize-space()='Follow Us on LinkedIn'])[1]","FollowUsonLinkedInButton","Healthcare");
                     expect.soft(FollowUsonLinkedInButton).toBeTruthy();
                     // Load more posts Button checking
                     const LoadMorePostsButton = await elementCheck(page,testInfo,"(//button[normalize-space()='Load more posts'])[1]","LoadMorePostsButton","Healthcare");
                     expect.soft(LoadMorePostsButton).toBeTruthy();
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Healthcare Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Case Studies Page
test('Case Studies Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res11 = await hoverWithXpath(page,"xpath=(//a[normalize-space()='Solutions'])[1]");
                    expect.soft(res11).toBeTruthy();
                    const res8 = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Case Studies'])[1]");
                    expect.soft(res8).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Case Studies Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"CaseStudiesPage");
                    // Case studies page header checking
                    const headerCoRes = await elementCoordinates(page,"//h1[contains(normalize-space(),'Case')]/span[normalize-space()='Studies']",938.453125,251,"Header","CaseStudies");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Case')]/span[normalize-space()='Studies']","header","CaseStudies");
                    expect.soft(header).toBeTruthy();
                    // Education videos checking
                    const educationVideos= page.locator("//div[@id='tab_1']/div/div[contains(@class,'post')]");
                    const educationVideosCount = await educationVideos.count();
                    console.log(`Education Videos count : ${educationVideosCount}`);
                    for(let i=0; i<educationVideosCount; i++){
                        const video = educationVideos.nth(i);
                        const videoName = await getInnerTextWithXpath(video,"xpath=/a/div[2]/h4");
                        console.log(`Video name : ${videoName}`);
                        const videoThumbNailSrc = await getAttributeWithXpath(video,"xpath=/a/div[1]/img","src");
                        console.log(`${videoName} thumbnail src : ${videoThumbNailSrc}`);
                        let videoThumbnailResult = imageChecking(page,testInfo,videoThumbNailSrc,videoName,"CaseStudies");
                        expect.soft(videoThumbnailResult).toBeTruthy();
                        const res7 = await hoverAndClickWithLocator(video);
                        expect.soft(res7).toBeTruthy();
                        if(res7){
                                const videoSrc = await getAttributeWithXpath(page,"//video/source","src");
                                console.log(`${videoName} src : ${videoSrc}`);
                                const videoResult = await isvideoWithSrcPlaying(page,testInfo,videoSrc,videoName,"CaseStudies",10000,false);
                                expect.soft(videoResult).toBeTruthy();
                                const res6 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                                expect.soft(res6).toBeTruthy();
                        }
                    }
                    // Industrial Training button checking
                    const industrialTraingButton = await elementCheck(page,testInfo,"//button[normalize-space()='Industrial Training']","industrialTraingButton","CaseStudies");
                    expect.soft(industrialTraingButton).toBeTruthy();
                    if(industrialTraingButton){
                        const res5 = await hoverAndClickWithXpath(page,"//button[normalize-space()='Industrial Training']");
                        expect.soft(res5).toBeTruthy();
                        await page.waitForTimeout(2000);
                        // Industrial Training videos checking
                        const IndustrialTrainingVideos= page.locator("//div[@id='tab_2']/div/div[contains(@class,'post')]");
                        const IndustrialTrainingVideosCount = await IndustrialTrainingVideos.count();
                        console.log(`Industrial Training Videos count : ${IndustrialTrainingVideosCount}`);
                        for(let j=0; j<IndustrialTrainingVideosCount; j++){
                                const video = IndustrialTrainingVideos.nth(j);
                                const videoName = await getInnerTextWithXpath(video,"xpath=/a/div[2]/h4");
                                console.log(`Video name : ${videoName}`);
                                const videoThumbNailSrc = await getAttributeWithXpath(video,"xpath=/a/div[1]/img","src");
                                console.log(`${videoName} thumbnail src : ${videoThumbNailSrc}`);
                                let videoThumbnailResult = imageChecking(page,testInfo,videoThumbNailSrc,videoName,"CaseStudies");
                                expect.soft(videoThumbnailResult).toBeTruthy();
                                const res4 = await hoverAndClickWithLocator(video);
                                expect.soft(res4).toBeTruthy();
                                if(res4){
                                        const videoSrc = await getAttributeWithXpath(page,"//video/source","src");
                                        console.log(`${videoName} src : ${videoSrc}`);
                                        const videoResult = await isvideoWithSrcPlaying(page,testInfo,videoSrc,videoName,"CaseStudies",10000,false);
                                        expect.soft(videoResult).toBeTruthy();
                                        const res2 = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                                        expect.soft(res2).toBeTruthy();
                                }  
                        }
                    }
                    // Virtual Tour button checking
                    const VirtualTourButton = await elementCheck(page,testInfo,"//button[normalize-space()='Virtual Tour']","VirtualTourButton","CaseStudies");
                    expect.soft(VirtualTourButton).toBeTruthy();
                    if(VirtualTourButton){
                        const res1 = await hoverAndClickWithXpath(page,"//button[normalize-space()='Virtual Tour']");
                        expect.soft(res1).toBeTruthy();
                        await page.waitForTimeout(2000);
                        // Virtual Tour videos checking
                        const VirtualTourVideos= page.locator("//div[@id='tab_3']/div/div[contains(@class,'post')]");
                        const VirtualTourVideosCount = await VirtualTourVideos.count();
                        console.log(`Virtual Tour Videos count : ${VirtualTourVideosCount}`);
                        for(let k=0; k<VirtualTourVideosCount; k++){
                                const video = await VirtualTourVideos.nth(k);
                                const videoName = await getInnerTextWithXpath(video,"xpath=/a/div[2]/h4");
                                console.log(`Video name : ${videoName}`);
                                const videoThumbNailSrc = await getAttributeWithXpath(video,"xpath=/a/div[1]/img","src");
                                console.log(`${videoName} thumbnail src : ${videoThumbNailSrc}`);
                                let videoThumbnailResult = imageChecking(page,testInfo,videoThumbNailSrc,videoName,"CaseStudies");
                                expect.soft(videoThumbnailResult).toBeTruthy();
                                const hoverClickLocatorRes = await hoverAndClickWithLocator(video);
                                expect.soft(hoverClickLocatorRes).toBeTruthy();
                                if(hoverClickLocatorRes){
                                        const videoSrc = await getAttributeWithXpath(page,"//video/source","src");
                                        console.log(`${videoName} src : ${videoSrc}`);
                                        const videoResult = await isvideoWithSrcPlaying(page,testInfo,videoSrc,videoName,"CaseStudies",10000,false);
                                        expect.soft(videoResult).toBeTruthy();
                                        const res = await hoverAndClickWithXpath(page,"//div[@class='grtvideo-popup-content']/span[@class='grtvideo-popup-close']");
                                        expect.soft(res).toBeTruthy();
                                }   
                        }
                    }  
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Case Studies Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Community Page
test('Community Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Community'])[1]");
                    expect.soft(res).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Community Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"CommunityPage");
                    // Header checking
                    const headerCoRes = await elementCoordinates(page,"//h1[contains(normalize-space(),'Get To Know')]/span[normalize-space()='imaginX']",1028.765625,164,"Header","Community");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Get To Know')]/span[normalize-space()='imaginX']","header","Community");
                    expect.soft(header).toBeTruthy();
                    // Main content checking
                    const para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'imaginX specializes in creating cutting-edge virtual reality')]","para","Community");
                    expect.soft(para).toBeTruthy();
                    // Poster checking
                    const poster = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/communityHero.png","poster","Community");
                    expect.soft(poster).toBeTruthy();
                    // Sub-header checking
                    const subHeaderText= await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Story')]","subHeaderText","Community");
                    expect.soft(subHeaderText).toBeTruthy(); 
                    // Our story content checking
                    const ourStoryContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'imaginX (iX), a member of the Kastech Software Solutions Group')]","ourStoryContent","Community");
                    expect.soft(ourStoryContent).toBeTruthy();
                    // Header2 text checking
                    const MissionValuesHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Mission & values')]","MissionValuesHeader","Community");
                    expect.soft(MissionValuesHeader).toBeTruthy();
                    // Mission image checking
                    const missionImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/mission.svg","missionImage","Community");
                    expect.soft(missionImage).toBeTruthy();
                    // Missing header text checking
                    const missionText = await elementCheck(page,testInfo,"//h3[normalize-space()='Mission']","missionText","Community")
                    expect.soft(missionText).toBeTruthy();
                    // Mission content checking
                    const missionContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'At imaginX, our mission is to revolutionize learning, training')]","missingContent","Community");
                    expect.soft(missionContent).toBeTruthy();
                    // Vision image checking
                    const VisionImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/vision.svg","VisionImage","Community");
                    expect.soft(VisionImage).toBeTruthy();
                    // Vision header text checking
                    const VisionText = await elementCheck(page,testInfo,"//h3[normalize-space()='Vision']","VisionText","Community")
                    expect.soft(VisionText).toBeTruthy();
                    // Vision content checking
                    const VisionContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Our vision is to lead the future of immersive technology')]","VisionContent","Community");
                    expect.soft(VisionContent).toBeTruthy();
                    // Collaboration image checking
                    const CollaborationImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/collaboration.svg","CollaborationImage","Community");
                    expect.soft(CollaborationImage).toBeTruthy();
                    // Collaboration header text checking
                    const CollaborationText = await elementCheck(page,testInfo,"//h3[normalize-space()='Collaboration']","CollaborationText","Community")
                    expect.soft(CollaborationText).toBeTruthy();
                    // Collaboration content checking
                    const CollaborationContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'We believe that great work is the result of collaboration between our team and our clients')]","CollaborationContent","Community");
                    expect.soft(CollaborationContent).toBeTruthy();
                    // VisInnovationion image checking
                    const InnovationImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/innovation.svg","InnovationImage","Community");
                    expect.soft(InnovationImage).toBeTruthy();
                    // Innovation header text checking
                    const InnovationText = await elementCheck(page,testInfo,"//h3[normalize-space()='Innovation']","InnovationText","Community")
                    expect.soft(InnovationText).toBeTruthy();
                    // Innovation content checking
                    const InnovationContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'At imaginX, we are committed to staying at the forefront of the ever-evolving digital space')]","InnovationContent","Community");
                    expect.soft(InnovationContent).toBeTruthy();
                    // Integrity image checking
                    const IntegrityImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/integrity.svg","IntegrityImage","Community");
                    expect.soft(IntegrityImage).toBeTruthy();
                    // Integrity header text checking
                    const IntegrityText = await elementCheck(page,testInfo,"//h3[normalize-space()='Integrity']","IntegrityText","Community")
                    expect.soft(IntegrityText).toBeTruthy();
                    // Integrity content checking
                    const IntegrityContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'We uphold the highest standards of integrity and professionalism')]","IntegrityContent","Community");
                    expect.soft(IntegrityContent).toBeTruthy();
                    // Result Driven image checking
                    const ResultDrivenImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/result_driven.svg","ResultDrivenImage","Community");
                    expect.soft(ResultDrivenImage).toBeTruthy();
                    // Result Driven header text checking
                    const ResultDrivenText = await elementCheck(page,testInfo,"//h3[normalize-space()='Result Driven']","ResultDrivenText","Community")
                    expect.soft(ResultDrivenText).toBeTruthy();
                    // Result Driven content checking
                    const ResultDrivenContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'We are dedicated to delivering tangible results that help our clients achieve their goals')]","ResultDrivenContent","Community");
                    expect.soft(ResultDrivenContent).toBeTruthy();
                    // Our team button checking
                    const ourTeamButton = await elementCheck(page,testInfo,"//p[normalize-space()='Our Team']","ourTeamButton","Community");
                    expect.soft(ourTeamButton).toBeTruthy();
                    // Our team header checking
                    const ourTeamHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'The People Behind')]/span[normalize-space()='imaginX']","ourTeamHeader","Community");
                    expect.soft(ourTeamHeader).toBeTruthy();
                    // Michael Matthews image checking
                    const MichaelMatthewsImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/mathews.png","MichaelMatthewsImage","Community");
                    expect.soft(MichaelMatthewsImage).toBeTruthy();
                    // Michael Matthews name checking
                    const MichaelMatthewsName = await elementCheck(page,testInfo,"//p[normalize-space()='Michael Matthews']","MichaelMatthewsName","Community");
                    expect.soft(MichaelMatthewsName).toBeTruthy();
                    // Michael Matthews Designation checking
                    const MichaelMatthewsDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Michael Matthews']/parent::div/div/p[normalize-space()='Chief Inspiration and Digital Advisor']","MichaelMatthewsDesignation","Community");
                    expect.soft(MichaelMatthewsDesignation).toBeTruthy();
                    // Michael Matthews linkedin icon checking
                    const MichaelMatthewsLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/mmathews1']/i","MichaelMatthewsLinkedinIcon","Community");
                    expect.soft(MichaelMatthewsLinkedinIcon).toBeTruthy();
                    // Girish Prabhu image checking
                    const GirishPrabhuImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/girish.png","GirishPrabhuImage","Community");
                    expect.soft(GirishPrabhuImage).toBeTruthy();
                    // Girish Prabhu name checking
                    const GirishPrabhuName = await elementCheck(page,testInfo,"//p[normalize-space()='Girish Prabhu']","GirishPrabhuName","Community");
                    expect.soft(GirishPrabhuName).toBeTruthy();
                    // Girish Prabhu Designation checking
                    const GirishPrabhuDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Girish Prabhu']/parent::div/div/p[normalize-space()='CEO']","GirishPrabhuDesignation","Community");
                    expect.soft(GirishPrabhuDesignation).toBeTruthy();
                    // Girish Prabhu linkedin icon checking
                    const GirishPrabhuLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/girishprab/']/i","GirishPrabhuLinkedinIcon","Community");
                    expect.soft(GirishPrabhuLinkedinIcon).toBeTruthy();
                    // Suresh Katamreddy image checking
                    const SureshKatamreddyImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/suresh.png","SureshKatamreddyImage","Community");
                    expect.soft(SureshKatamreddyImage).toBeTruthy();
                    // Suresh Katamreddy name checking
                    const SureshKatamreddyName = await elementCheck(page,testInfo,"//p[normalize-space()='Suresh Katamreddy']","SureshKatamreddyName","Community");
                    expect.soft(SureshKatamreddyName).toBeTruthy();
                    // Suresh Katamreddy Designation checking
                    const SureshKatamreddyDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Suresh Katamreddy']/parent::div/div/p[normalize-space()='Chief Operating Officer']","SureshKatamreddyDesignation","Community");
                    expect.soft(SureshKatamreddyDesignation).toBeTruthy();
                    // Suresh Katamreddy linkedin icon checking
                    const SureshKatamreddyLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/suresh-katamreddy-9a683546']/i","SureshKatamreddyLinkedinIcon","Community");
                    expect.soft(SureshKatamreddyLinkedinIcon).toBeTruthy();
                    // Fine Taufatofua image checking
                    const FineTaufatofuaImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/fine.png","FineTaufatofuaImage","Community");
                    expect.soft(FineTaufatofuaImage).toBeTruthy();
                    // Fine Taufatofua name checking
                    const FineTaufatofuaName = await elementCheck(page,testInfo,"//p[normalize-space()='Fine Taufatofua']","FineTaufatofuaName","Community");
                    expect.soft(FineTaufatofuaName).toBeTruthy();
                    // Fine Taufatofua Designation checking
                    const FineTaufatofuaDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Fine Taufatofua']/parent::div/div/p[normalize-space()='Director of Customer Success']","FineTaufatofuaDesignation","Community");
                    expect.soft(FineTaufatofuaDesignation).toBeTruthy();
                    // Fine Taufatofua linkedin icon checking
                    const FineTaufatofuaLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/finetaufatofua/']/i","FineTaufatofuaLinkedinIcon","Community");
                    expect.soft(FineTaufatofuaLinkedinIcon).toBeTruthy();
                    // Srilatha Ramamurthy image checking
                    const SrilathaRamamurthyImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/srilatha.png","SrilathaRamamurthyImage","Community");
                    expect.soft(SrilathaRamamurthyImage).toBeTruthy();
                    // Srilatha Ramamurthy name checking
                    const SrilathaRamamurthyName = await elementCheck(page,testInfo,"//p[normalize-space()='Srilatha Ramamurthy']","SrilathaRamamurthyName","Community");
                    expect.soft(SrilathaRamamurthyName).toBeTruthy();
                    // Srilatha Ramamurthy Designation checking
                    const SrilathaRamamurthyDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Srilatha Ramamurthy']/parent::div/div/p[normalize-space()='Project Manager']","SrilathaRamamurthyDesignation","Community");
                    expect.soft(SrilathaRamamurthyDesignation).toBeTruthy();
                    // Srilatha Ramamurthy linkedin icon checking
                    const SrilathaRamamurthyLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/srilatha-r-a8171a269']/i","SrilathaRamamurthyLinkedinIcon","Community");
                    expect.soft(SrilathaRamamurthyLinkedinIcon).toBeTruthy();
                    // Tyler Pitts image checking
                    const TylerPittsImage = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/team/tyler.png","TylerPittsImage","Community");
                    expect.soft(TylerPittsImage).toBeTruthy();
                    // Tyler Pitts name checking
                    const TylerPittsName = await elementCheck(page,testInfo,"//p[normalize-space()='Tyler Pitts']","TylerPittsName","Community");
                    expect.soft(TylerPittsName).toBeTruthy();
                    // Tyler Pitts Designation checking
                    const TylerPittsDesignation = await elementCheck(page,testInfo,"//p[normalize-space()='Tyler Pitts']/parent::div/div/p[normalize-space()='Lead Architect']","TylerPittsDesignation","Community");
                    expect.soft(TylerPittsDesignation).toBeTruthy();
                    // Tyler Pitts linkedin icon checking
                    const TylerPittsLinkedinIcon = await elementCheck(page,testInfo,"//a[@href='https://www.linkedin.com/in/srilatha-r-a8171a269']/i","TylerPittsLinkedinIcon","Community");
                    expect.soft(TylerPittsLinkedinIcon).toBeTruthy();
                    // Our blogs header checking
                    const ourBlogsHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Blogs')]","ourBlogsHeader","Community");
                    expect.soft(ourBlogsHeader).toBeTruthy();
                    // Our blogs content checking
                    const ourBlogsContent = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Stay informed with our latest insights, industry trends')]","ourBlogsContent","Community");
                    expect.soft(ourBlogsContent).toBeTruthy();
                    const blogs = await page.locator("//section[contains(@class,'ourBlogsSec')]/div[2]/div");
                    const blogsCount = await blogs.count();
                    console.log(`No of blogs: ${blogsCount}`);
                    for(let i=0; i<blogsCount;i++){
                        const  blog = await blogs.nth(i);
                        const blogImageSrc = await getAttributeWithXpath(blog,"xpath=/div[contains(@class,'Img')]/img","src");
                        if(blogImageSrc){
                                console.log(`${i}.Blog image src is: ${blogImageSrc}`)
                                const blogImage = await imageChecking(page,testInfo,blogImageSrc,"BlogImage","Community");
                                expect.soft(blogImage).toBeTruthy();
                                if(blogImage){
                                        console.log(`✅ ${i}.Blog image displayed`);
                                }else{console.log(`⚠️ ${i}.Blog image NOT displayed`)};
                        }else{console.log(`⚠️ Src is not available for ${i}.Blog`)};
                        const blogTitle = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/h3");
                        if(blogTitle && !blogTitle.startsWith("⚠️")){
                                console.log(`✅ ${i}.Blog title is: ${blogTitle}`);
                        }else{console.log(`⚠️ Title is not available for ${i}.blog`)};
                        const blogPara = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/p[contains(@class,'Para')]");
                        if(blogPara && !blogPara.startsWith("⚠️")){
                                console.log(`✅ ${i}.Blog content is: ${blogPara}`);
                        }else{console.log(`⚠️ Content is not available for ${i}.blog`)};
                        const blogReadMore = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                        if(blogReadMore && !blogReadMore.startsWith("⚠️")){
                                console.log(`${i}.Blog read more button is: ${blogReadMore}`);
                                const res = await hoverWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                                expect.soft(res).toBeTruthy();
                                await page.waitForTimeout(1000);
                                const res0 = await clickWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                                expect.soft(res0).toBeTruthy();
                                await page.waitForTimeout(1000);
                                const blogHeader = await getInnerTextWithXpath(page,"//h1[contains(@class,'Title')]");
                                if(blogHeader.includes(blogTitle)){
                                        expect.soft(true).toBeTruthy();
                                        console.log(`✅ ${i}.Blog read more button re-diecting to same blog`);
                                        await page.goBack();
                                        await page.waitForTimeout(1000);
                                }else{
                                        expect.soft(false).toBeTruthy();
                                        console.log(`⚠️ ${i}.Blog read more button NOT re-diecting to same blog. Re-directed Blog Header is ${blogHeader}`);
                                }
                        }else{console.log(`⚠️ Read more button is not available for ${i}.blog`)};
                    }
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Community Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking FAQ Page
test('FAQ Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    const res = await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='FAQ'])[1]");
                    expect.soft(res).toBeTruthy();
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ FAQ Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"FAQPage");
                    // Header checking
                    const headerCoRes = await elementCoordinates(page,"//span[@class='text-xgreen' and normalize-space()='Questions']",1070.625,164,"Header","FAQ");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//span[@class='text-xgreen' and normalize-space()='Questions']","header","FAQ");
                    expect.soft(header).toBeTruthy();
                    // para checking
                    const para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'At imaginX, we know you have questions about how our XR platform, iXGenie')]","para","FAQ");
                    expect.soft(para).toBeTruthy();
                    // Exspanding each question
                    const questions = await page.locator("//button[@onclick]/span");
                    console.log(`We have ${await questions.count()} questions in FAQ page.`)
                    for (let i=0;i<await questions.count();i++){
                        const exspandButton = await questions.nth(i);
                        const text = await getInnerTextWithXpath(exspandButton,"xpath=/parent::button");
                        console.log(`${await text}`);
                        const hoverAndClickRes = await hoverAndClickWithLocator(exspandButton);
                        expect.soft(hoverAndClickRes).toBeTruthy();
                        await page.waitForTimeout(1000);
                    }
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ FAQ Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking contact Us Page
test('Contact Us Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Contact Us'])[1]");
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Contact Us Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"ContactUsPage");
                    // Header checking
                    const headerCoRes = await elementCoordinates(page,"//h1[normalize-space()='Contact Us']",208,170,"Header","ContactUs");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//h1[normalize-space()='Contact Us']","Header","Contact Us");
                    expect.soft(header).toBeTruthy();
                    // First Name field checking
                    const firstNameField = await elementCheck(page,testInfo,"//input[@placeholder='First Name*']","FirstNameField","Contact Us");
                    expect.soft(firstNameField).toBeTruthy();
                    // Entering Name into First Name Field
                    const firstNameFieldEle = await page.locator("//input[@placeholder='First Name*']");
                    await firstNameFieldEle.waitFor({timeout:40000});
                    await firstNameFieldEle.fill("Jack");
                    // Last Name field checking
                    const lastNameField = await elementCheck(page,testInfo,"//input[@placeholder='Last Name*']","LastNameField","Contact Us");
                    expect.soft(lastNameField).toBeTruthy();
                    // Entering Name into Last Name Field
                    const lastNameFieldEle = await page.locator("//input[@placeholder='Last Name*']");
                    await lastNameFieldEle.waitFor({timeout:40000});
                    await lastNameFieldEle.fill("Sparrow");
                    // Country code drop-down checking
                    const countryCodeDropdown = await elementCheck(page,testInfo,"//span[contains(@id,'country_code')]","Country Code Drop-down","Contact Us");
                    expect.soft(countryCodeDropdown).toBeTruthy();
                    // Selecting country code
                    const countrySelectEle = await page.locator("//span[contains(@id,'country_code')]");
                    await countrySelectEle.waitFor({timeout:40000});
                    await countrySelectEle.click();
                    await page.waitForTimeout(1000);
                    // Filtering country code by typing
                    const filterFieldEle = await page.locator("//span[contains(@class,'select2-dropdown')]/span[1]/input");
                    await filterFieldEle.waitFor({timeout:40000});
                    await filterFieldEle.fill("91");
                    await page.waitForTimeout(1000);
                    await hoverAndClickWithXpath(page,"//span[contains(@class,'select2-dropdown')]/span[2]/ul/li[1]");
                    await page.waitForTimeout(1000);
                    // Phone number field checking
                    const phoneNumberField = await elementCheck(page,testInfo,"//input[@placeholder='Phone Number *']","PhoneNumberField","Contact Us");
                    expect.soft(phoneNumberField).toBeTruthy();
                    // Entering number into number Field
                    const phoneNumberFieldEle = await page.locator("//input[@placeholder='Phone Number *']");
                    await phoneNumberFieldEle.waitFor({timeout:40000});
                    await phoneNumberFieldEle.fill("1234567890");
                    // Email field checking
                    const emailField = await elementCheck(page,testInfo,"//input[@placeholder='Email*']","EmailField","Contact Us");
                    expect.soft(emailField).toBeTruthy();
                    // Entering email into email Field
                    const emailFieldEle = await page.locator("//input[@placeholder='Email*']");
                    await emailFieldEle.waitFor({timeout:40000});
                    await emailFieldEle.fill("jacksparrow@gmail.com");
                    // Message field checking
                    const messageField = await elementCheck(page,testInfo,"//textarea[@placeholder='Message']","MessageField","Contact Us");
                    expect.soft(messageField).toBeTruthy();
                    // Entering message into message Field
                    const messageFieldEle = await page.locator("//textarea[@placeholder='Message']");
                    await messageFieldEle.waitFor({timeout:40000});
                    await messageFieldEle.fill("Hello Everyone!! Happy to see you here.....");
                    // Send Message button checking
                    const sendMessageButton = await elementCheck(page,testInfo,"//button[@type='submit']","Send Message Button","Contact Us");
                    expect.soft(sendMessageButton).toBeTruthy();
                    const hoverRes = await hoverWithXpath(page,"//button[@type='submit']");
                    expect.soft(hoverRes);
                    await page.waitForTimeout(2000);
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Contact Us Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Blogs Page
test('Blogs Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Blogs'])[1]");
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Blogs Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"BlogsPage");
                    // Header checking
                    const headerCoRes = await elementCoordinates(page,"//span[contains(normalize-space(),'Our Latest Posts')]",464.359375,271,"Header","Blogs");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//span[contains(normalize-space(),'Our Latest Posts')]","Header","Blogs");
                    expect.soft(header).toBeTruthy();
                    // Checking all blogs
                    const blogs = await page.locator("//section/div[contains(@class,'postsContainer')]/div[contains(@class,'post')]");
                    const blogsCount = await blogs.count();
                    console.log(`No of blogs : ${blogsCount}`);
                    for(let i=0; i<blogsCount;i++){
                        const  blog = await blogs.nth(i);
                        const blogImageSrc = await getAttributeWithXpath(blog,"xpath=/div[contains(@class,'Img')]/img","src");
                        if(blogImageSrc){
                                console.log(`${i}.Blog image src is: ${blogImageSrc}`)
                                const blogImage = await imageChecking(page,testInfo,blogImageSrc,"BlogImage","Community");
                                expect.soft(blogImage).toBeTruthy();
                                if(blogImage){
                                        console.log(`✅ ${i}.Blog image displayed`);
                                }else{console.log(`⚠️ ${i}.Blog image NOT displayed`)};
                        }else{console.log(`⚠️ Src is not available for ${i}.Blog`)};
                        const blogTitle = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/h3");
                        if(blogTitle){
                                console.log(`✅ ${i}.Blog title is: ${blogTitle}`);
                        }else{console.log(`⚠️ Title is not available for ${i}.blog`)};
                        const blogPara = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/p[contains(@class,'Para')]");
                        if(blogPara){
                                console.log(`✅ ${i}.Blog content is: ${blogPara}`);
                        }else{console.log(`⚠️ Content is not available for ${i}.blog`)};
                        const blogReadMore = await getInnerTextWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                        if(blogReadMore){
                                console.log(`${i}.Blog read more button is: ${blogReadMore}`);
                                const res0 = await hoverWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                                expect.soft(res0).toBeTruthy();
                                await page.waitForTimeout(1000);
                                const res56 = await clickWithXpath(blog,"xpath=/div[contains(@class,'Content')]/a[normalize-space()='Read More']");
                                expect.soft(res56).toBeTruthy();
                                await page.waitForTimeout(1000);
                                if(res56){
                                        // scrolling to bottom of the page step by step
                                        await scrollToBottom(page,500,500);
                                        // scroll to top of the page
                                        await scrolltoTop(page);
                                        const blogHeader = await getInnerTextWithXpath(page,"//h1[contains(@class,'Title')]");
                                        if(blogHeader.includes(blogTitle)){
                                                expect.soft(true).toBeTruthy();
                                                console.log(`✅ ${i}.Blog read more button re-diecting to same blog`);
                                        }else{
                                                expect.soft(false).toBeTruthy();
                                                console.log(`⚠️ ${i}.Blog read more button NOT re-diecting to same blog. Re-directed Blog Header is ${blogHeader}`);
                                        }
                                        await page.goBack();
                                        await page.waitForTimeout(1000);
                                } 
                        }else{console.log(`⚠️ Read more button is not available for ${i}.blog`)};
                    }
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Blogs Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
// Checking Privacy Policy Page
test('Privacy Policy Page',async({page},testInfo)=>{
    if(await urlStatus(page)){
            try {
                    await hoverAndClickWithXpath(page,"xpath=(//a[normalize-space()='Privacy Policy'])[1]");
                    try {
                            await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
                    } catch (e) {
                            console.warn('⚠️ Privacy Policy Page took too long to load fully. Continuing...');
                    }
                    await page.waitForTimeout(2000);
                    // scrolling to bottom of the page step by step
                    await scrollToBottom(page,500,500);
                    // scroll to top of the page
                    await scrolltoTop(page);
                    // take screenshot
                    await takeScreenshot(page,"PrivacyPolicyPage");
                    // Header checking
                    const headerCoRes = await elementCoordinates(page,"//h1[normalize-space()='Privacy Policy']",440,170,"Header","PrivacyPolicy");
                    expect.soft(headerCoRes).toBeTruthy();
                    const header = await elementCheck(page,testInfo,"//h1[normalize-space()='Privacy Policy']","Header","Pivacy Policy");
                    expect.soft(header).toBeTruthy();
                    // Checkig all policy points
                    const policyPoints = await page.locator("//section/div/div[contains(@class,'mb-4')]");
                    console.log(`We have ${await policyPoints.count()} policy points.`);
                    for(let i=0;i<await policyPoints.count();i++){
                        const policyPoint = await policyPoints.nth(i);
                        const policyPointText = await getInnerTextWithXpath(policyPoint,"xpath=/h3");
                        console.log(`✅ ${policyPointText}`);
                        // await policyPoint.hover();
                        const hoverRes = await hoverWithLocator(policyPoint);
                        expect.soft(hoverRes).toBeTruthy();
                        await page.waitForTimeout(1000);
                    }
            } catch (error) {
                    console.error(`⚠️ ${error}`);
                    expect.soft(false).toBeTruthy();
            }
    }else{console.log(`❌ Privacy Policy Page test got Failed.`)
            expect.soft(false).toBeTruthy();
    }; 
});
