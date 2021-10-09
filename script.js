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

document.addEventListener("DOMContentLoaded", () => {
    fetch("./static_db.json").then(async (response) => {
        let imageDataList = await response.json();
        imageDataList = imageDataList.sort((a, b) => b.publishDate - a.publishDate);
        for(const image of imageDataList.slice(0, 50)) {
            console.log(image);
            var imageData = new SpottedImage(image.fileName, image.publishDate, image.detectedText);
            document.querySelector(".search-results-list").append(imageData.createListEntry());
        }
    });
});