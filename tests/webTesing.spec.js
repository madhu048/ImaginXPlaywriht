import {test,expect} from '@playwright/test';

const links = {imaginX:"https://www.imaginxavr.com/",
               CrystaStructure:"https://uh.imaginxavr.com/crystal-structure//",
               WaveDiffraction:"https://uh.imaginxavr.com/wave-diffraction/",
               CystalBining:"https://uh.imaginxavr.com/crystal-binding/",
               CrystalVibrations:"https://uh.imaginxavr.com/crystal-vibrations/ ",
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
               PCR:"https://uh.imaginxavr.com/pcr/",
               UniversityOfHouston:"https://uh.imaginxavr.com/uh-web/",
               UHAdminLogin:"https://uh.imaginxavr.com/avr_ix_uh/admin/",
               UHLms:"https://uh.imaginxavr.com/uh-lms/",
               UHWebTest:"https://uh.imaginxavr.com/uh-web-test/",
               UHWebDev:"https://uh.imaginxavr.com/uh-web-dev/",
               UHUserHeartManual:"https://uh.imaginxavr.com/user-heart-manual/",
               UHUserManual:"https://uh.imaginxavr.com/user-manual/",
               CellDevision:"https://experience.imaginxavr.com/cell-division/",
               DNA:"https://experience.imaginxavr.com/dna-stem/",
               Electricity:"https://experience.imaginxavr.com/electricity-stem/",
               Lipids:"https://experience.imaginxavr.com/lipids-stem-core/",
               LipidsDemolink:"https://experience.imaginxavr.com/lipids-stem/",
               NursingIVinsertion:"https://experience.imaginxavr.com/nursing-IV-insertion/",
               NursingFywareLoginPanel:"https://experience.imaginxavr.com/nursing-fyware/admin",
               NursingSimulations:"https://experience.imaginxavr.com/nursing-simulation/",
               ClientVideos:"https://experience.imaginxavr.com/ClientVideos/",
               IXProductCatalogue:"https://experience.imaginxavr.com/product-catalogue/",
               ixWeb:"https://experience.imaginxavr.com/ix-web/",
               Best:"http://experience.imaginxavr.com/best/",
               Bestv2:"http://experience.imaginxavr.com/best_v2/",
               Heart:"https://experience.imaginxavr.com/explore_human_heart/",
               HeartLimited:"https://experience.imaginxavr.com/human-heart-limited-version/",
               HeartLabelsAssessment:"https://experience.imaginxavr.com/stem-heart-labels-assess/",
               HeartPartsAssessment:"https://experience.imaginxavr.com/stem-heart-parts-assess/",
               Pimav1Unityweb:"http://experience.imaginxavr.com/pima_v1/",
               PimaLoginPanel:"https://experience.imaginxavr.com/pima/",
               PimaModels:"https://experience.imaginxavr.com/pima_28_3/",
               AnatomyCourseWeb:"https://experience.imaginxavr.com/anatomy_course/",
               HumanAnatomyUnityWeb:"http://experience.imaginxavr.com/human_anatomy/",
               AviationCourseWeb:"http://experience.imaginxavr.com/aviation_course/",
               CessnaWheelUnityWeb:"http://experience.imaginxavr.com/cessna_wheel/",
               EngineeringCourseWeb:"http://experience.imaginxavr.com/engineering_course/",
               JetEngineUnityWeb:"http://experience.imaginxavr.com/jet_engine/",
               Harizon:"http://experience.imaginxavr.com/horizon/",
               HarizonWebgl:"https://experience.imaginxavr.com/horizon_webgl/",
               HarizonChemistry:"http://experience.imaginxavr.com/horizon_chemistry/",
               HarizonChemistryWebgl:"https://experience.imaginxavr.com/horizon_chemistry_webgl/",
               ixTestUnityWeb:"http://experience.imaginxavr.com/ix_test/",
               NathanHaleAppWeb:"http://nhs.imaginxavr.com/web/",
               AiWeb:"https://experience.imaginxavr.com/ai-web/",
               AvrAdmin:"https://experience.imaginxavr.com/avr/admin",
               Cessna210:"https://experience.imaginxavr.com/cessna-210/",
               ControlValve:"https://experience.imaginxavr.com/control_valve/",
               D93:"https://experience.imaginxavr.com/D93_D93/",
               D932:"https://experience.imaginxavr.com/D932/",
               ImaginXDashboard:"https://experience.imaginxavr.com/dashboard/",
               DigitalTwin:"https://experience.imaginxavr.com/digital-twin/",
               DrawingLoader:"https://experience.imaginxavr.com/drawing-loader/",
               EarthStem:"https://experience.imaginxavr.com/earth-stem/",
               FigmaRespesentation:"https://experience.imaginxavr.com/figmarepresentation/",
               FigmaRespesentationMobile:"https://experience.imaginxavr.com/figmarepresentation-mobile/",
               HammerDemo:"https://experience.imaginxavr.com/hammer-demo/",
               HCCweb:"https://experience.imaginxavr.com/hcc/",
               HeartMultiplayer:"https://experience.imaginxavr.com/heart-multiplayer/",
               IBMfaqWeb:"https://experience.imaginxavr.com/ibm-faq/",
               IBMTerms:"https://experience.imaginxavr.com/ibm-terms/",
               ImaginxCoursePackage:"https://experience.imaginxavr.com/imaginx/",
               IndustrialTraingHub:"https://experience.imaginxavr.com/industrial-traininghub/",
               IXAdmin:"https://experience.imaginxavr.com/ix/admin/",
               IXlinksLogin:"https://experience.imaginxavr.com/ix-links/",
               IXProdTest:"https://experience.imaginxavr.com/ix-prod-test/",
               IXStemHeart:"https://experience.imaginxavr.com/ix-stem-heart/",
               Lonestar:"https://experience.imaginxavr.com/lonestar/",
               MachineryDemo:"https://experience.imaginxavr.com/machinery-demo/",
               MagnetoSlick:"https://experience.imaginxavr.com/magneto-slick/",
               mRNAEvaluatoin:"https://experience.imaginxavr.com/mrna-assessment/",
               OklahomaLoginPanel:"https://experience.imaginxavr.com/oklahoma_oklahoma/",
               Oklahoma2LoginPanel:"https://experience.imaginxavr.com/oklahoma2/",
               Opsu:"https://experience.imaginxavr.com/opsu/",
               Refinery:"https://experience.imaginxavr.com/refinery/",
               ReidentialHouse:"https://experience.imaginxavr.com/residential-house/",
               SapPocLoginpanel:"https://experience.imaginxavr.com/sap_poc/",
               SaudiPoc:"https://experience.imaginxavr.com/saudi_poc/",
               UtahAppWeb:"https://utahforgevirtualtour.imaginxavr.com/",
               UtahAnalyticsAppWeb:"https://utahforgevirtualtour.imaginxavr.com/utah_backend/dashboard",
               UtahClientBackEndLinkWeb:"https://utahforgevirtualtour.imaginxavr.com/utah_backend/",
               UtahClientBackEndLinkWebSharedWithClient:"https://experience.imaginxavr.com/utah_backend/",
               TDWTappingMachince:"https://tdw.imaginxavr.com/tappingmachine/",
               TDWFlt:"https://tdw.imaginxavr.com/flt/",
               TDWManualPDF:"https://tdw.imaginxavr.com/manual/",
               TDWManualMock:"https://tdw.imaginxavr.com/manual_mock/",
               TDWAppUnity:"https://tdw.imaginxavr.com/webgl/",
               TDWAnalyticsWeb:"https://tdw.imaginxavr.com/analytics/admin",
               TDWAppUnityCrV1:"https://tdw.imaginxavr.com/cr-v1/",
               TDWFltTrainingHub:"https://tdw.imaginxavr.com/flt-traininghub/",
               TDWFltTrainingHubLoginPanel:"https://tdw.imaginxavr.com/flt-traininghub/login",
               TDWAppUnityOptimized:"https://tdw.imaginxavr.com/optimized/",
               TDWTour:"https://tdw.imaginxavr.com/tour/",
               TDWAppUnityTourTest:"https://tdw.imaginxavr.com/tour-test/",
               TDWVirtualTour:"https://tdw.imaginxavr.com/virtual-tour/",
               TDWVirtualTourV2:"https://tdw.imaginxavr.com/virtual-tour-v2/",
               GTCAppWeb:"https://gtc.imaginxavr.com/gtc-lms/",
               GTCIntenal:"https://experience.imaginxavr.com/gtc-internal/",
               GTCReports:"https://experience.imaginxavr.com/gtc-reports/",
               CanvasAppWeb:"https://canvas.imaginxavr.com/",
               ImaginXMasterCatologue:"https://experience.imaginxavr.com/mastercatalogue/admin/login",
               StemUHBackEndAdmin:"https://experience.imaginxavr.com/stem-uh/admin",
               StemExperienceBackEndAdmin:"https://experience.imaginxavr.com/stem/dashboard",
               ClientVideosCaseStudies:"https://experience.imaginxavr.com/case-studies/",
               ClientVideosCaseStudiesLoginPanel:"https://experience.imaginxavr.com/case-studies/login",
               Simulations:"https://experience.imaginxavr.com/simulations/",
               SimulationsLoginPanel:"https://experience.imaginxavr.com/simulations/login",
               IXSimulationsWeb:"https://experience.imaginxavr.com/ix-simulations/",
               IXSimulationsWebLoginPanel:"https://experience.imaginxavr.com/ix-simulations/login",
               BMCC:"https://experience.imaginxavr.com/generic/",
               BMCCLoginPanel:"https://experience.imaginxavr.com/generic/admin/login",
               HoshizakiamericaAppweb:"https://experience.imaginxavr.com/hoshizakiamerica/",
               HoshizakiamericaAppwebLoginPanel:"https://experience.imaginxavr.com/hoshizakiamerica/login",
               XRSolutionsBasedOnADUCurriculumWeb:"https://experience.imaginxavr.com/adu/",
               XRSolutionsBasedOnADUCurriculumWebLoginPanel:"https://experience.imaginxavr.com/adu/admin",
               ADUAviationDemo:"https://experience.imaginxavr.com/adu-aviation-demo/", 
               ADUMedicalDemo:"https://experience.imaginxavr.com/adu-medical-demo/",
               AAONTrainingHub:"https://experience.imaginxavr.com/aaon-training-hub/",
               AAONTrainingHubLoginPanel:"https://experience.imaginxavr.com/aaon-training-hub/login",
               HVACTrainingHubWeb:"https://experience.imaginxavr.com/hvac-training-hub/",
               HVACTrainingHubWebLoginPanel:"https://experience.imaginxavr.com/hvac-training-hub/login",
               TraneTrainingHub:"https://experience.imaginxavr.com/trane-traininghub/",
               TraneTrainingHubLoginPanel:"https://experience.imaginxavr.com/trane-traininghub/login",
               ImaginXLoginPanel:"https://www.imaginxavr.com/admin/",
               NHSAdminPanelweb:"http://nhs.imaginxavr.com/avr/admin/",
               NHSHumanHeartUnity:"http://nhs.imaginxavr.com/explore_human_heart/",
               NHSAppUnityV2:"http://nhs.imaginxavr.com/nhs-v2/",
               NHSAppWebUnity2:"http://nhs.imaginxavr.com/web2/",
               NHSLogin:"https://experience.imaginxavr.com/nhs/",
               GeneLnkedObsityLimited:"https://experience.imaginxavr.com/genelinkedobesity-limited/",
               GeneRegulationLimited:"https://experience.imaginxavr.com/generegulation-limited/",
               mRNALimited:"https://experience.imaginxavr.com/mrna-limited/",
               LabSafetyLimited:"https://experience.imaginxavr.com/labsafety-limited/",
               EnzymeKineticsLimited:"https://experience.imaginxavr.com/enzyme-kinetics-limited/",
               NextGeneSequencingLimited:"https://experience.imaginxavr.com/next-gen-sequencing-limited/",
               HeartLimited2:"https://experience.imaginxavr.com/human-heart-limited-version/",
               TDWFltLimited:"https://experience.imaginxavr.com/ix-flt-limited/",
               StemLimitedAppsWebsite:"https://experience.imaginxavr.com/stem-limited-versions/",
            }

async function urlStatus(page,url){
    try {
        const response = await page.goto(url);
        try {
                    await page.waitForLoadState('load', { timeout: 30000 }); // try for 30s
            } catch (e) {
                    console.error(`⚠️ ${url} got skipped becoz its taking long time(Morethan 30 sec) to load.`);
                    return false;
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