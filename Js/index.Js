alert("Praise the LORD")

let mylinks = document.querySelectorAll(".mylinks");
let container = document.querySelector(".page_containers");

mylinks.forEach(link => {
    link.addEventListener("click", function(e)  {
        let Text_link = this.innerText;


        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/templates/${Text_link}.html`, true);
        xhr.addEventListener("readystatechange",() =>{
            if(xhr.readyState === 4 && xhr.status === 200) {
                container.innerHTML = xhr.responseText;

                switch (Text_link) {
                    case "Dashboard":
                        dashboard();
                        break;

                    case "WatchList":
                        watchList();
                        break;

                    case "Markets":
                        markets();
                        break;

                    case "News":
                        news();
                        break;

                    case "Settings":
                        settings();
                        break;
                }
            }
        })

        xhr.send();
    })
})



function dashboard() {
    alert("Dashboard loaded");
}

function watchList() {
    alert("WatchList loaded");
}

function markets() {
    alert("Markets loaded");
}

function news() {
    alert("News loaded");

    const newsContainer = document.querySelector(".news-container");

    if (!newsContainer) return;

    // News code here
}

function settings() {
    alert("Settings loaded");
}



window.onload = function() {
    mylinks[0].click();
}