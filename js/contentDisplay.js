let tabSelectors = document.getElementsByClassName("main-tab-selector");
let tabs = document.getElementsByClassName("main-tab");

function setTab(tabName){
    for (let tabSelector of tabSelectors) {
        tabSelector.removeAttribute("aria-current");
    }

    for (let tab of tabs) {
        tab.style.display="none";
    }
    
    document.getElementById(tabName + "TabSelector").ariaCurrent = "page";
    document.getElementById(tabName + "Tab").style.display = "";
}

function setVideoStatus(status) {
    switch(status) {
        case "finished":
            document.getElementById("videoUploaderSection").style.display = "none";
            document.getElementById("videoFrameRateSection").style.display = "none";
            document.getElementById("videoFinishedSection").style.display = "";
            console.log("video finished")
            break;

        case "uploaded":
            document.getElementById("videoUploaderSection").style.display = "none";
            document.getElementById("videoFrameRateSection").style.display = "";
            console.log("video uploaded")
            break;

        case "uploading":
            document.getElementById("videoUploadStatus").style.display = "";
            break;

        default:
            console.log("???")
    }

}

setTab("upload")