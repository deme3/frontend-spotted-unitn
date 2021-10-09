const IMAGES_PATH = "./images/";

class SpottedImage {
    get fileURL() {
        return IMAGES_PATH + this.fileName;
    }

    constructor(fileName, publishDate, detectedText) {
        this.fileName = fileName;
        this.publishDate = new Date(publishDate);
        this.detectedText = detectedText.replace(/\n/g, " ");
    }

    /*
<li>
    <div class="spotted-image" style="background-image: url('.%2Fimages%2F207187245_543581306863415_3982576560177247712_n.jpg%3F_nc_ht%3Dinstagram.fbzo1-2.fna.fbcdn.net%26_nc_cat%3D111%26_nc_ohc%3DUlxN96yLIo4AX8wTLFM%26edm%3DAPU89FABAAAA%26ccb%3D7-4%26oh%3D6762605f382c730f5a9bb63e095b2109%26oe%3D6167FBAA%26_nc_sid%3D86f79a.jpg')"></div>
    <div class="spotted-contents">
        <div class="spotted-date">21/10/2021 18:37:42</div>
        <div class="spotted-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur dolores repudiandae sapiente voluptatem eaque! Inventore, ab. Quos voluptas sit, et at ratione deserunt molestiae architecto eveniet maiores hic aperiam nesciunt. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, ipsam molestiae, rem impedit aliquam eaque doloremque ad non temporibus esse, minima cum officiis? Inventore repellat adipisci rem laudantium totam dolores. lore</div>
    </div>
</li>
    */
    createListEntry() {
        let listEntry = document.createElement("li");
        let entryImage = document.createElement("div");
        entryImage.classList.add("spotted-image");
        entryImage.style.backgroundImage = `url("${encodeURIComponent(this.fileURL)}")`;
        
        let entryContents = document.createElement("div");
        entryContents.classList.add("spotted-contents");

        let entryContentsDate = document.createElement("div");
        entryContentsDate.classList.add("spotted-date");
        entryContentsDate.innerText = this.publishDate.toLocaleDateString() + " " + this.publishDate.toLocaleTimeString();

        let entryContentsText = document.createElement("div");
        entryContentsText.classList.add("spotted-text");
        entryContentsText.innerText = this.detectedText;
        
        entryContents.append(entryContentsDate, entryContentsText);
        listEntry.append(entryImage, entryContents);
        return listEntry;
    }
}

let imageDataList;
let searchTerms = "";
let elementsPerPage = 25;
let currentPage = 0;
let sortingOrder = "desc";

let currentPageDropdown,
    elementsPerPageDropdown,
    sortingOrderDropdown,
    searchEngineTextbox,
    searchResultsList;
function filterByText(inputArray, searchTerms) {
    if(searchTerms.trim() === "") return inputArray;
    return inputArray.filter(x => searchTerms.some(x.detectedText));
}

function updateList() {
    // empty list
    searchResultsList.innerHTML = "";

    // clone array
    let tempList = [...imageDataList];
    tempList = filterByText(tempList, searchTerms);
    tempList = tempList.sort(
        (a, b) =>
            (b.publishDate - a.publishDate) * (sortingOrder == "desc" ? 1 : -1));
    for(const image of tempList.slice(currentPage * elementsPerPage, (currentPage * elementsPerPage) + elementsPerPage)) {
        var imageData = new SpottedImage(image.fileName, image.publishDate, image.detectedText);
        searchResultsList.append(imageData.createListEntry());
    }
}

function updatePageSelect() {
    if(typeof currentPageDropdown === "undefined") return;
    currentPageDropdown.innerHTML = "";
    currentPageDropdown.value = 0;

    var x = 0;
    for(; x < Math.ceil(imageDataList.length / elementsPerPage); x++) {
        let pageOption = document.createElement("option");
        pageOption.value = x;
        pageOption.innerText = (x + 1).toString();
        currentPageDropdown.append(pageOption);
    }
    if(currentPage > x) {
        currentPage = x-1;
        currentPageDropdown.value = x-1;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentPageDropdown = document.getElementById("page-select");
    elementsPerPageDropdown = document.getElementById("page-elements");
    sortingOrderDropdown = document.getElementById("page-order");
    searchEngineTextbox = document.getElementById("sengine-textbox");
    searchResultsList = document.querySelector(".search-results-list");
    fetch("./static_db.json").then(async (response) => {
        imageDataList = await response.json();
        imageDataList = imageDataList.sort((a, b) => b.publishDate - a.publishDate);
        
        updatePageSelect();
        updateList();
    });

    elementsPerPageDropdown.addEventListener("change", function() {
        elementsPerPage = parseInt(this.value);
        updatePageSelect();
        updateList();
    });

    currentPageDropdown.addEventListener("change", function() {
        currentPage = parseInt(this.value);
        updateList();
    });

    sortingOrderDropdown.addEventListener("change", function() {
        sortingOrder = this.value;
        updateList();
    });
});