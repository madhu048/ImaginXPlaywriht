import {test,expect} from '@playwright/test';

const links = {imaginX:"https://www.imaginxavr.com/",
               CrystalStructure:"https://uh.imaginxavr.com/crystal-structure/",
               WaveDiffraction:"https://uh.imaginxavr.com/wave-diffraction/",
               CrystalBindingAndElastic:"https://uh.imaginxavr.com/crystal-binding/",
               CrystalVibrations:"https://uh.imaginxavr.com/crystal-vibrations/",
               ThermalProperties:"https://uh.imaginxavr.com/thermalproperties/",
               FreeElectronFermiGas:"https://uh.imaginxavr.com/fermigas/",
               EnergyBands:"https://uh.imaginxavr.com/energyband/",
               SemiconductorCrystals:"https://uh.imaginxavr.com/semi-conductor-crystals/",
               FermiSurfacesAndMetals:"https://uh.imaginxavr.com/fermi-surfaces-and-metals/",
               LabSafety:"https://uh.imaginxavr.com/labsafety/",
               EnzymeKinetics:"https://uh.imaginxavr.com/enzyme-kinetics/",
               GeneObesity:"https://uh.imaginxavr.com/geneobesity/",
               GeneRegulation:"https://uh.imaginxavr.com/generegulation/",
               mRNA:"https://uh.imaginxavr.com/mRNA/",
               NextGeneSequencing:"https://uh.imaginxavr.com/next-generation-sequencing/",
               PCR:"https://uh.imaginxavr.com/next-generation-sequencing/",
               UniversityOfHouston:"https://uh.imaginxavr.com/uh-web/",
               CellDevision:"https://experience.imaginxavr.com/cell-division/",
               DNA:"https://experience.imaginxavr.com/dna-stem/",
               Electricity:"https://experience.imaginxavr.com/electricity-stem/",
               Lipids:"https://experience.imaginxavr.com/lipids-stem-core/",
               LipidsDemolink:"https://experience.imaginxavr.com/lipids-stem/",
               NursingIVinsertion:"https://experience.imaginxavr.com/nursing-IV-insertion/",
               ClientVideos:"https://experience.imaginxavr.com/ClientVideos/",
               ixWeb:"https://experience.imaginxavr.com/ix-web/",
               Best:"http://experience.imaginxavr.com/best/",
               Bestv2:"http://experience.imaginxavr.com/best_v2/",
               Heart:"https://experience.imaginxavr.com/explore_human_heart/",
               HeartLimited:"https://experience.imaginxavr.com/human-heart-limited-version/",
               Pimav1Unityweb:"http://experience.imaginxavr.com/pima_v1/",
               AnatomyCourseWeb:"https://experience.imaginxavr.com/anatomy_course/",
               HumanAnatomyUnityWeb:"http://experience.imaginxavr.com/human_anatomy/",
               AviationCourseWeb:"http://experience.imaginxavr.com/aviation_course/",
               CessnaWheelUnityWeb:"http://experience.imaginxavr.com/cessna_wheel/",
               EngineeringCourseWeb:"http://experience.imaginxavr.com/engineering_course/",
               JetEngineUnityWeb:"http://experience.imaginxavr.com/jet_engine/",
               HorizonWeb:"http://experience.imaginxavr.com/horizon/",
               HorizonUnityWeb:"https://experience.imaginxavr.com/horizon_webgl/",
               HorizonChemistryWeb:"http://experience.imaginxavr.com/horizon_chemistry/",
               ixTestUnityWeb:"http://experience.imaginxavr.com/ix_test/",
               NathanHaleAppWeb:"http://nhs.imaginxavr.com/web/",
               UtahAppWeb:"https://utahforgevirtualtour.imaginxavr.com/",
               UtahAnalyticsAppWeb:"https://utahforgevirtualtour.imaginxavr.com/utah_backend/dashboard",
               UtahClientBackEndLinkWeb:"https://utahforgevirtualtour.imaginxavr.com/utah_backend/",
               UtahClientBackEndLinkWebSharedWithClient:"https://experience.imaginxavr.com/utah_backend/",
               TDWAppWeb:"http://experience.imaginxavr.com/tdw_webgl/",
               TDWAnalyticsWeb:"https://experience.imaginxavr.com/tdw-analytics/admin",
            }

async function urlStatus(page,url){
    try {
        const response = await page.goto(url);
        try {
                    await page.waitForLoadState('load', { timeout: 20000 }); // try for 20s
            } catch (e) {
                    console.warn(`⚠️ ${url} took too long to load fully. Continuing...`);
            }
        await page.waitForTimeout(2000);
        let statusCode = await response.status();
        if(statusCode < 400){
            expect.soft(statusCode).toBeLessThan(400);
            console.log(`✅ ${await statusCode}-${url} is loading fine.`);
            return true;
        }else{
            expect.soft(false).toBeTruthy();
            console.error(`⚠️ ${statusCode}-There is a isssue with url: ${url}`)
            return false;
        }
    } catch (error) {
        console.error(`❌ There is issue with Url: ${url}: ${error}`);
        console.error(`➡️ Error Message: ${error.message}`);
        console.error(`➡️ Error Stack: ${error.stack}`);
        expect.soft(false).toBeTruthy();
        return false;
    }
}            

test("Testing All Web Links",async ({page},testInfo)=>{
    const keys = Object.keys(links);
    console.log(`Total links: ${keys.length}`);
    for(let i=0;i < keys.length;i++){
        const key = keys[i];
        const value = links[keys[i]];
        console.log(`${key}: ${value}.`);
        await urlStatus(page,value);
        const screenshotPath = `screenshots/${key}.png`;
        await page.screenshot({path:screenshotPath,fullPage:true});
        // This one will attach the every screenshot manually to the html report from screenshot folder
        await testInfo.attach(`${key}`,{path:screenshotPath,contentType:'image/png'})
    }
});