var hostName = window.location.hostname;
var path = window.location.pathname;
var webistranoHostName = "deployment.infoedge.com";
var iconnectHostName = "iconnect.infoedge.com";
var gitlabHostName = "gitlab.infoedge.com";

// document.title = "Varun";

if (hostName === webistranoHostName) {
  initWebistrano();
}
else if (hostName === iconnectHostName) {
  initIconnect();
}
else if (hostName === gitlabHostName) {
  initGitlab();
}

function initWebistrano() {
  
  var staging_new_deployment_regex = /\/projects\/.+\/stages\/.+\/deployments\/new.*/;
  var assets_refresh_project_deployment_regex = /\/projects\/374\/stages/;
  var csm_deployment_regex = /\/projects\/109\/stages/;
  var csm_staging_deployment_regex = /\/projects\/109\/stages\/213/;

  generateDeployShortcut();
  placeDeselectCheckbox();
  generateFillDefaultsLink();

  function placeDeselectCheckbox() {
    if (!staging_new_deployment_regex.test(path)) {
      return;
    }

    function getUnselectPosition(container) {
      var unselectPosTop = ((container.offsetHeight / 2) - 10) + 'px';
      var unselectPosLeft = ((container.offsetWidth / 2) + 20) + 'px';
  
      return {
        left: unselectPosLeft,
        top: unselectPosTop
      }
    }
  
    function onUnselectClick() {
      var hostsListContainer = document.getElementById("excluded_hosts_form");
      hostsListContainer.querySelectorAll('table tbody tr').forEach(function (node) {
        if (node.classList.contains("enabled_host")) {
          node.click();
        }
      })
    }

    var hostsListContainer = document.getElementById("excluded_hosts_form");
    if(!hostsListContainer) {
      return;
    }

    hostsListContainer.style.position = "relative";
    var pos = getUnselectPosition(hostsListContainer);
    var unselect = document.getElementById('unselect_hosts');
    if (!unselect) {
      var unselect = document.createElement('span');
      unselect.style.textDecoration = "underline";
      unselect.style.color = "blue";
      unselect.style.cursor = "pointer";
      unselect.innerText = "Deselect All";
      unselect.id = "unselect_hosts";
      unselect.style.position = "absolute";
      unselect.style.top = pos.top;
      unselect.style.left = pos.left;
      hostsListContainer.append(unselect);
      unselect.addEventListener('click', onUnselectClick);
    }

    else {
      unselect.style.position = "absolute";
      unselect.style.top = pos.top;
      unselect.style.left = pos.left;
    }
  }

  function generateFillDefaultsLink() {
    if(!staging_new_deployment_regex.test(path)) return;
    if(!assets_refresh_project_deployment_regex.test(path) && !csm_deployment_regex.test(path)) {
      return;
    }

    var identifiedLocation = document.querySelector(".content h2");
    var fillDefaultLink = document.createElement("span");
    fillDefaultLink.style.textDecoration = "underline";
    fillDefaultLink.style.color = "#38ae67";
    fillDefaultLink.style.cursor = "pointer";
    fillDefaultLink.style.fontSize = "16px";
    fillDefaultLink.style.marginLeft = "8px";
    fillDefaultLink.innerText = "Fill Defaults"
    fillDefaultLink.onclick = function() {
      document.querySelector("[name='deployment[task]'").value = "deploy:php";
      document.querySelectorAll("[name^='deployment[prompt_config][ac'").forEach((tb) => tb.value = "0");
      
      if(assets_refresh_project_deployment_regex.test(path) || csm_staging_deployment_regex.test(path)) {
        document.querySelector("[name='deployment[prompt_config][jira:changerequestid]'").value = "NA";
        document.querySelector("[name='deployment[description]'").value = "NA";
        
        if(assets_refresh_project_deployment_regex.test(path)) {
          document.querySelector("[name='deployment[prompt_config][tag]'").value = "0";
        }
        else {
          document.querySelector("[name='deployment[prompt_config][tag]'").focus();
        }
      }
    }
    identifiedLocation.append(fillDefaultLink);
  }

  function generateDeployShortcut() {
    var styleEle = document.createElement("style");
    var styles = "#projects_open_content > .menu_link + div > .menu_link:hover .infoedge-deploy-link {display: inline;}";
    styles += ".infoedge-deploy-link {display: none}";
    if (styleEle.styleSheet){
      styleEle.styleSheet.cssText = styles; 
    }
    else {
      styleEle.appendChild(document.createTextNode(styles)); 
    }

    document.getElementsByTagName("head")[0].appendChild(styleEle);
    var stagesLinks = document.querySelectorAll("#projects_open_content > .menu_link + div > .menu_link");

    stagesLinks.forEach(stage => {
      stage.classList.add("infoedge-stage-link");

      var deployLink = document.createElement('a');
      deployLink.classList.add("infoedge-deploy-link")
      deployLink.innerText = "[Deploy]";
      deployLink.style.paddingLeft = "10px";
      deployLink.href = stage.href + "/deployments/new?task=deploy";
      deployLink.onclick = function(e) {
        window.location.href = e.target.href;
        e.stopPropagation();
        e.preventDefault();
      }
      stage.querySelector(".menu_link_title").append(deployLink);
    });
  }
}


function initIconnect() {
  // check if Attendance & Leave Section is loaded

  var mainFrame = document.querySelector("frame[name='main']");
  attachMainFrameLoadListener();

  function attachMainFrameLoadListener() {
    mainFrame.onload = function () {
      handleIfAttendanceAndLeaveView();

    }
  }



  function handleIfAttendanceAndLeaveView() {
    var navMenu = window.top.frames.band.document.getElementById("menutitle").querySelector("span.navmenu");

    if (!navMenu || navMenu.innerText.trim() !== "Attendance & Leave") {
      return;
    }

    var form1 = window.top.frames.main.document.getElementById("form1");
    if (!form1) return;

    var table = form1.querySelector('table');
    if (!table) return;


    var regularizationNode = table.querySelector("tr td");
    if (!regularizationNode || regularizationNode.innerText.trim() !== "Attendance Regularization - Pending") return;

    createFillRegularizationLink();

    function createFillRegularizationLink() {
      var mainDoc = window.top.frames.main.document;
      if (mainDoc.querySelectorAll('[name^="DrAttendance1"]').length == 0) return;

      var attendanceFillingElement = document.createElement('span');
      attendanceFillingElement.style.textDecoration = "underline";
      attendanceFillingElement.style.cursor = "pointer";
      attendanceFillingElement.style.color = "green";
      attendanceFillingElement.style.fontWeight = "bold";
      attendanceFillingElement.style.marginLeft = "5px";
      attendanceFillingElement.innerText = "Fill Defaults";
      attendanceFillingElement.onclick = function () {
        selectPresentA();
        selectPresentB();
        selectPresentC();
      }

      regularizationNode.append(attendanceFillingElement);
      var mainDoc = window.top.frames.main.document;

      function selectPresentA() {
        let elmsA = mainDoc.querySelectorAll('[name^="DrAttendance1"]');
        for (let i = 0; i < elmsA.length; i++) {
          elmsA[i].value = 1;
        }
      };

      function selectPresentB() {
        let elmsB = mainDoc.querySelectorAll('[name^="DrAttendance2"]');
        for (let i = 0; i < elmsB.length; i++) {
          elmsB[i].value = 1;
        }
      };

      function selectPresentC() {
        let elmsC = mainDoc.querySelectorAll('[name^="DrReason"]');
        for (let i = 0; i < elmsC.length; i++) {
          elmsC[i].value = 11;
        }
      };
    }
  }
}

function initGitlab() {

  var openMergeRequestsPathRegex = /.+\/merge_requests\/\d+(\/(diffs|commits).*)?$/;
  var rmsFEDRepoRegex = /(static5|static4)\/(124.*)/

  initMergeRequestsActions();

  function initMergeRequestsActions() {
    var pathName = window.location.pathname;
    if (!openMergeRequestsPathRegex.test(pathName)) return;
    if(!rmsFEDRepoRegex.test(pathName)) return;

    // check if merge request is opened
    var statusBox = document.querySelector(".status-box");
    if (!statusBox) return;
    var status = statusBox.innerText.trim();
    if (status !== "Open") {
      return;
    }

    var mergeRequestMessageBox = document.querySelector("textarea[name='commit_message']");
    if (!mergeRequestMessageBox) {
      return;
    }

    var mergeRequestMessage = mergeRequestMessageBox.value;
    var originalCommitMessage = mergeRequestMessage;

    var stagingBuildRegex = /-stage\.(bug|major|minor)/;
    var prodBuildRegex = /-prod\.(bug|major|minor)/;

    var stagingBuild = false;
    var productionBuild = false;

    if (stagingBuildRegex.test(mergeRequestMessage)) {
      stagingBuild = true;
    }
    else if (prodBuildRegex.test(mergeRequestMessage)) {
      productionBuild = true;
    }

    var actionBtnsContainer = document.querySelector(".accept-action");

    if (!actionBtnsContainer) return;

    actionBtnsContainer.style.display = "flex";
    actionBtnsContainer.style.alignItems  = "center";

    var mergeRequestBtn = actionBtnsContainer.querySelector(".accept_merge_request");
    mergeRequestBtn.style.display = "none";


    var fakeMergeRequestButton = document.createElement('button');
    fakeMergeRequestButton.className = "btn btn-success btn-grouped";
    fakeMergeRequestButton.innerText = "Accept Merge Request";
    fakeMergeRequestButton.type = "button";
    fakeMergeRequestButton.onclick = function () {

      var buildType = document.querySelector("[name='infoedge-build-type']:checked").value;
      var versionType = buildType !== "default" ? document.querySelector("[name='infoedge-build-version-type']:checked").value : null;
      updateCommitMessage(buildType, versionType);
      mergeRequestBtn.click();
    }

    actionBtnsContainer.append(fakeMergeRequestButton);

    createBuildTypeBox();
    attachBuildTypeChangeEvent();

    function createBuildTypeBox() {
      
      var normalBuildButtonLabel = document.createElement("label")
      normalBuildButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-type' style='margin-right: 2px' value='default' /> Default";
      normalBuildButtonLabel.style.marginRight = "5px";

      var stagingButtonLabel = document.createElement("label")
      stagingButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-type' style='margin-right: 2px' value='staging' /> Staging";
      stagingButtonLabel.style.marginRight = "5px";

      var prodButtonLabel = document.createElement("label")
      prodButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-type' style='margin-right: 2px' value='prod' /> Prod";

      var buildTypeContainer = document.createElement('span');
      buildTypeContainer.append(normalBuildButtonLabel);
      buildTypeContainer.append(stagingButtonLabel);
      buildTypeContainer.append(prodButtonLabel);

      actionBtnsContainer.append(buildTypeContainer);

      if(stagingBuild) {
        document.querySelector("[name='infoedge-build-type'][value='staging'").checked = true;
        toggleVersionType(true);
        
        //check major/minor/bug
        var versionType = mergeRequestMessage.match(stagingBuildRegex)[1];
        preselectVersionType(versionType);
      }
      else if(productionBuild) {
        document.querySelector("[name='infoedge-build-type'][value='prod'").checked = true;
        toggleVersionType(true);
        var versionType = mergeRequestMessage.match(prodBuildRegex)[1];
        preselectVersionType(versionType);
      }
      else {
        document.querySelector("[name='infoedge-build-type'][value='default'").checked = true;
      }
    }

    function createVersionTypeBox() {
      var bugButtonLabel = document.createElement("label")
      bugButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-version-type' style='margin-right: 2px' value='bug' checked /> Bug";
      bugButtonLabel.style.marginRight = "5px";

      var minorButtonLabel = document.createElement("label")
      minorButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-version-type' style='margin-right: 2px' value='minor' /> Minor";
      minorButtonLabel.style.marginRight = "5px";

      var majorButtonLabel = document.createElement("label")
      majorButtonLabel.innerHTML = "<input type='radio' name='infoedge-build-version-type' style='margin-right: 2px' value='major' /> Major";

      var versionTypeContainer = document.createElement('span');
      versionTypeContainer.id = "build-version-type";
      versionTypeContainer.append(bugButtonLabel);
      versionTypeContainer.append(minorButtonLabel);
      versionTypeContainer.append(majorButtonLabel);

      var pipe = document.createElement('span');
      pipe.id="build-separator";
      pipe.innerText = "|";
      pipe.style.color = "#999";
      pipe.style.marginLeft = "8px";
      pipe.style.marginRight = "8px";
      pipe.style.marginTop = "-4px";

      actionBtnsContainer.append(pipe);
      actionBtnsContainer.append(versionTypeContainer);
    }

    function preselectVersionType(versionType) {
      //check major/minor/bug
      var versionType = mergeRequestMessage.match(stagingBuildRegex)[1];
      if(versionType === "bug") {
        document.querySelector("[name='infoedge-build-version-type'][value='bug'").checked = true;
      }
      else if(versionType === "minor") {
        document.querySelector("[name='infoedge-build-version-type'][value='minor'").checked = true;
      }
      else if(versionType === "major") {
        document.querySelector("[name='infoedge-build-version-type'][value='major'").checked = true;
      }
    }

    function toggleVersionType(show) {
      if(show) {
        createVersionTypeBox();
      }
      else {
        var versionTypeCont = document.getElementById("build-version-type");
        if(versionTypeCont) {
          versionTypeCont.remove();
          document.getElementById("build-separator").remove();
        }
      }
    }

    function onBuildTypeChange(e) {
      var current = document.querySelector("[name='infoedge-build-type']:checked").value;

      toggleVersionType(false);
      if(current !== "default") {
        toggleVersionType(true);
      }
    }

    function attachBuildTypeChangeEvent() {
      document.querySelectorAll("[name='infoedge-build-type']").forEach(radio => {
        radio.addEventListener("change", onBuildTypeChange);
      });
    }

    function updateCommitMessage(buildType, buildVersion) {
      var commitMessage = originalCommitMessage;
      commitMessage = commitMessage.replaceAll("-stage.bug", "");
      commitMessage = commitMessage.replaceAll("-stage.minor", "");
      commitMessage = commitMessage.replaceAll("-stage.major", "");
      commitMessage = commitMessage.replaceAll("-prod.bug", "");
      commitMessage = commitMessage.replaceAll("-prod.minor", "");
      commitMessage = commitMessage.replaceAll("-prod.major", "");
      commitMessage = commitMessage.replaceAll("\n\n\n", "\n");

      if(buildType === "default") {
        mergeRequestMessageBox.value = commitMessage;
        return;
      }

      if(buildType === "staging") {
        mergeRequestMessageBox.value = commitMessage + " -stage." + buildVersion;
      }

      else if(buildType === "prod") {
        mergeRequestMessageBox.value = commitMessage + " -prod." + buildVersion;
      }
    }
  }
}

