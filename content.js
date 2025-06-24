// // coding_problem_info_difficulty__NrZ8u
// Target the node that is always present (like body or main container)
const targetNode = document.body; // or a specific container if known

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const target = document.querySelector(".coding_problem_info_difficulty__NrZ8u");

      if (target && !document.getElementById("myCustomButton")) {
        addButton();
      }
    }
  }
});
// Configure what to watch for
const config = {
  childList: true,       // Watch for added/removed children
  subtree: true          // Watch entire subtree, not just direct children
};

// Start observing
observer.observe(targetNode, config);
window.addEventListener("load",()=>{
      console.log("content.js loaded");

      if (typeof chrome !== "undefined" && chrome.storage) {
      console.log("chrome.storage is available");
      } else {
      console.log("chrome or chrome.storage is NOT available");
      }
if(!document.getElementById("myCustomButton"))
        addButton();
        console.log("hello");   
}
);
function storageGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result[key]);
    });
  });
}
async function loadProblemList(newEle) {
  try {
    const currProblemList = await storageGet("problem_list") || [];
    console.log("Loaded list:", currProblemList);
    console.log(newEle);  
    
    // Example: Add a new problem and save back
  if(currProblemList)  {
      let flag = 0;
      currProblemList.forEach(element => {
          if(element.id===newEle.id) {
            console.log("Problem already exists");
            flag = 1;
            return ;
          }
       });
       if(flag) return ;
    }
    currProblemList.push(newEle);
    await storageSet({ problem_list: currProblemList });
    console.log("Updated list saved.");
    
  } catch (err) {
    console.error("Storage error:", err);
  }
}



function storageSet(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}

function addButton(){
      const targetEle = document.getElementsByClassName("coding_problem_info_difficulty__NrZ8u")[0];
      const newBtn = document.createElement("img");
      newBtn.src=chrome.runtime.getURL("assets/bookmark.png");
      newBtn.id = "myCustomButton";
      newBtn.addEventListener("click",function(){
            console.log(this);
            const probID = getIDofProblem();
            const probURL = location.href;
            const probName = document.getElementsByClassName("coding_problem_info_heading__G9ueL")[0].textContent;
            const newEle = getJSObj(probID,probName,probURL);
            console.log(newEle);
            loadProblemList(newEle);
      });
      targetEle.insertAdjacentElement("afterbegin",newBtn);
      console.log(targetEle);
}
function getIDofProblem(){
      const url = location.href;
      const match = url.match(/problems\/([^\/\?#]+)/);
      const probID = match[1].split('-').pop();
      return parseInt(probID,10);
      // console.log(probID);
}
function getJSObj(id,name,url){
      const newEle = {
            id: id,
            name: name,
            url : url
      };
      return newEle;
}
// console.log("Hello");