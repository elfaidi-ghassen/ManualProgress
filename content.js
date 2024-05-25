
// The two checked/unchecked svgs used in the website
const checkedSVG = "<svg aria-labelledby='svg-inline--fa-title-vZXv4DbMsHuL' data-prefix='fas' data-icon='check-circle' class='svg-inline--fa fa-check-circle fa-fw float-left mt-1 text-success' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' aria-hidden='true'><title id='svg-inline--fa-title-vZXv4DbMsHuL'>Completed section</title><path fill='currentColor' d='M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z'></path></svg>"
const uncheckedSVG = "<svg aria-labelledby='svg-inline--fa-title-TJfHw59JlI2d' data-prefix='far' data-icon='check-circle' class='svg-inline--fa fa-check-circle fa-fw float-left mt-1 text-gray-400' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' aria-hidden='true'><title id='svg-inline--fa-title-TJfHw59JlI2d'>Incomplete section</title><path fill='currentColor' d='M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z'></path></svg>"
const svgSelector = "ol#courseHome-outline > li > div > div:first-child > div > div:first-child > svg";








let shouldObserve = true;
const observer = new MutationObserver((mutationsList) => {
    if (shouldObserve) {
        for (let mutation of mutationsList) {
            let nodesWereAdded = mutation.type === 'childList'
            let svgsWereModified = Boolean(mutation.target.querySelector(".pgn_collapsible.mb-2.collapsible-card-lg"))
            if ( nodesWereAdded && svgsWereModified) {
                shouldObserve = false
                chrome.storage.sync.get(["indexList"]).then((result) => {
                    let indexArray = result.indexList || [];
                    console.log(indexArray);
                    let svgs = document.querySelectorAll(svgSelector)
                    svgs.forEach(function (targetSVG, index) {
                            if (indexArray.includes(index)) {
                                targetSVG.innerHTML = checkedSVG
                                targetSVG.classList.add("checked");
                            } else {
                                targetSVG.innerHTML = uncheckedSVG
                                targetSVG.classList.remove("checked");
                            }
                    })
                });
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

















document.addEventListener('click', function (clickedElement) {
    let targetSVG = clickedElement.target.closest(svgSelector);
    const isTarget = Boolean(targetSVG)
    
    if (isTarget) {
        targetSVG.closest("li div").click()
        console.log(targetSVG.closest("li"));
        const isChecked = targetSVG.classList.contains("checked");
        if (isChecked) {
            targetSVG.innerHTML = uncheckedSVG
            targetSVG.classList.remove("checked");
            // remove its index from array
                chrome.storage.sync.get(["indexList"]).then((result) => {
                    let indexArray = result.indexList || [];

                    let liElement = targetSVG.closest("li")
                    let index = Array.from(liElement.parentNode.children).indexOf(liElement)
                    let svgIndex = indexArray.indexOf(index)
                    indexArray.splice(svgIndex, 1);
                    chrome.storage.sync.set({ indexList: indexArray }).then(() => {
                        console.log('indexList updated:', indexArray);
                    });
                });




        } else {
            targetSVG.innerHTML = checkedSVG
            targetSVG.classList.add("checked");
            chrome.storage.sync.get(["indexList"]).then((result) => {
                let indexArray = result.indexList || [];
                let liElement = targetSVG.closest("li")
                let index = Array.from(liElement.parentNode.children).indexOf(liElement)
                indexArray.push(index)
                chrome.storage.sync.set({ indexList: indexArray }).then(() => {
                    console.log('indexList updated:', indexArray);
                });
            });


        }
    
    }

})

