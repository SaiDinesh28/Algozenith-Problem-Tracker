// Handles your frontend UI logic.
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
async function deleteProblem(event) {
  console.log("Deleting problem with id:", event.target.closest("section").id);
  const delete_id = event.target.closest("section").id;
  const problemList = await storageGet("problem_list");
  const newProbList = problemList.filter(ele => ele.id!=delete_id);
  console.log("problem list is ",problemList);
  await storageSet({ problem_list: newProbList});
  console.log("Updated list saved.");
  loadProblemList();
}
function createProblemSection(element){
  // element.url, element.name, element.id
    const newEle = document.createElement("section");
    newEle.id = element.id;
    newEle.innerHTML = `
    <div class="problem-entry">
      <div class="problem-left">
        <h3>${element.name}</h3>
      </div>
      <div class="problem-right">
        <img src="assets/play.png" alt="run-btn" class="icon run-icon">
        <img src="assets/del.png" alt="delete-btn" class="icon delete-icon">
      </div>
    </div>
`;
    newEle.getElementsByClassName("run-icon")[0].addEventListener("click", () => {
        console.log('got clicked on url ',element.url);
        window.open(element.url, "_blank");
    });
    newEle.getElementsByClassName("delete-icon")[0].addEventListener("click",deleteProblem);
    return newEle;
}

async function loadProblemList() {
  try {
    let currProblemList = await storageGet("problem_list");
   
    console.log("Loaded list:", currProblemList);
    
    // Example: Add a new problem and save back
    const problemSection = document.getElementById("problem-list");
    if(!currProblemList.length) problemSection.innerHTML="<h1>No Bookmarks</h1>";
    else{
        problemSection.innerHTML="";
        currProblemList.forEach(element => {
            const newProb = createProblemSection(element);
            // newProb.getElementsByClassName(".run-icon")[0].addEventListener("click", () => {
            //     window.open(element.url, "_blank");
            // });
            // newProb.getElementsByClassName(".delete-icon")[0].addEventListener("click", async () => {
            //     const index = currProblemList.findIndex(prob => prob.id === element.id);
            //     if (index !== -1) {
            //         currProblemList.splice(index, 1);
            //         await chrome.storage.local.set({ problem_list: currProblemList });
            //         newProb.remove();
            //     }
            // });
            problemSection.append(newProb);
        });
    }
    
  } catch (err) {
    console.error("Storage error:", err);
  }
}

loadProblemList();