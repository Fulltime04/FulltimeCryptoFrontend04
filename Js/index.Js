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



async function dashboard() {



    let Container = document.querySelector(".page_containers");
    let headingText = Container.querySelector("#welcome_text h2");
    let SubheadingText = Container.querySelector("#welcome_text p");


    const welcomeMessages = [
        {
            title: "Welcome to Fulltime Crypto",
            subtitle: "Your trusted destination for cryptocurrency prices, market analytics, and blockchain insights."
        },
        {
            title: "Track the Global Crypto Market",
            subtitle: "Monitor thousands of digital assets with real-time price updates and market statistics."
        },
        {
            title: "Analyze Market Performance",
            subtitle: "View historical trends, market capitalization, trading volume, and price movements with ease."
        },
        {
            title: "Stay Informed Every Day",
            subtitle: "Get the latest cryptocurrency news, project updates, from the blockchain industry."
        },
        {
            title: "Build Your Watchlist",
            subtitle: "Keep an eye on your favorite cryptocurrencies and never miss significant market opportunities."
        }
    ];





    let index = 0;
    headingText.textContent = welcomeMessages[0].title;
    SubheadingText.textContent = welcomeMessages[0].subtitle;

    index++
    function textAnimation(){
        SubheadingText.classList.remove("animate");
        void SubheadingText.offsetWidth;


        setTimeout( () =>{
            SubheadingText.textContent = welcomeMessages[index].subtitle;
            headingText.textContent = welcomeMessages[index].title;
            SubheadingText.classList.add("animate");

            index++

            if(index >= welcomeMessages.length){
                index = 0;
            }

        }, 50);


    }

    setInterval(textAnimation, 4000);


    async function coinList(){
        let url = "http://127.0.0.1:8000/api/list/"
        let response = await fetch(url);
        const result = await response.json();

        return result;
    }



    function CreateTemplates() {
        let div = document.createElement("div");
        div.classList.add("modalbox");

            div.innerHTML = `
                <button class="del_modal"><i class="fas fa-xmark"></i></button>
                <div id="transactionModal" class="modal hidden">
                    
                      <div class="modal-content">
                            <h2 id="modalTitle"></h2>

                        <form id="transactionForm">
                            <div id="formFields"></div>
                        
                        <div class="form_btn_wrapper">
                             <button type="submit">Confirm</button>
                            <button type="button" id="closeModal">Cancel</button>
                        </div>
                        </form>
                    </div>
             </div>
`

        let del_modal = div.querySelector(".del_modal");
            del_modal.addEventListener("click", function(){
                div.remove();
            })
        return div;
    }

    function btnClicks(){
        let Tran_btn = Container.querySelectorAll(".Tran_btn");
        Tran_btn.forEach(element => {
            element.addEventListener("click", () =>{
                let template = CreateTemplates()
                Container.appendChild(template)
                openTransaction(element.dataset.type, Container)

                if(element.dataset.type === "buy" || element.dataset.type === "sell"){
                    collect()
                }

            })
        })
    }

    btnClicks()

    async function collect() {

        let cont = Container.querySelector("#formFields");
        let sell_buy = cont.querySelector(".selectOption");

        sell_buy.innerHTML = `
        <span class="select_coin_logo">
            <img src="" alt="">
        </span>

        <h3 class="select_coin_symbol"></h3>

        <select class="coins"></select>
    `;

        const coins_wrapper = sell_buy.querySelector(".coins");
        const logo = sell_buy.querySelector(".select_coin_logo img");
        const symbol = sell_buy.querySelector(".select_coin_symbol");

        const AllCoins = await coinList();

        AllCoins.forEach(coin => {
            let option = document.createElement("option");

            option.textContent = coin.name;
            option.value = coin.id;

            coins_wrapper.appendChild(option);
        });

        let firstCoin = AllCoins[0];

        logo.src = firstCoin.image;
        symbol.textContent = `(${firstCoin.symbol.toUpperCase()})`;

        coins_wrapper.addEventListener("change", () => {

            const selectedCoin = AllCoins.find(
                coin => coin.id === coins_wrapper.value
            );

            if (!selectedCoin) return;

            logo.src = selectedCoin.image;

            symbol.textContent =
                `(${selectedCoin.symbol.toUpperCase()})`;

        });
    }


    function openTransaction(type, container) {
        const formFields = container.querySelector("#formFields");

        let form_btn_wrapper = container.querySelector(".form_btn_wrapper");
        const form = container.querySelector("#transactionForm");
        const title = container.querySelector("#modalTitle");

        formFields.innerHTML = "";
        form.dataset.type = type;

        if (type === 'buy' || type === 'sell') {
            formFields.style.height = "60%";
            form_btn_wrapper.style.height = "40%"
        }

        const config = {
            deposit: {
                title: "Deposit Funds",
                fields: `<input class="inpt_Same" type="number" name="amount" placeholder="Amount (USD)" required />`
            },
            withdraw: {
                title: "Withdraw Funds",
                fields: `<input class="inpt_Same" type="number" name="amount" placeholder="Amount (USD)" required />`
            },
            buy: {
                title: "Buy Crypto",
                fields: `
        <div class="sell_buy_same selectOption">
         
        </div>
        <input class="sell_buy_same2 sell_buy_same inpt2_same" type="number" name="amount" placeholder="USD Amount" required />
      `
            },
            sell: {
                title: "Sell Crypto",
                fields: `
        <div class="sell_buy_same selectOption">
            
        </div>
        <input class="sell_buy_same2 sell_buy_same inpt2_same" type="number" name="amount" placeholder="USD Amount" required />
      `
            }
        };

        title.textContent = config[type].title;
        formFields.innerHTML = config[type].fields;


        form.onsubmit = e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
        };
    }



    async function exhangeCoins(){
        let fromto_select = document.querySelectorAll(".fromto_select");
        let mycoins = await coinList();

        fromto_select.forEach(element => {
            mycoins.forEach(coin => {
                let opt = document.createElement("option");
                opt.textContent = coin.name;
                opt.value = coin.name;
                element.appendChild(opt);
            });
        })

        fromto_select.forEach((coin,index) => {
            coin.value = mycoins[index].name;
        })

    }

    exhangeCoins();


    const ctx = document.getElementById("overallChart").getContext("2d");
    let currentCoin = "bitcoin";
    let currentName = "Bitcoin (BTC)";
    let currentDays;

    let chart;

    async function fetchChartData() {
        const res = await fetch(
            `http://127.0.0.1:8000/api/chart_data2/${currentCoin}/${currentDays}/`
        );

        const data = await res.json();

        console.log("Response:", data);

        if (!data.prices) {
            throw new Error("prices not found in response");
        }

        const labels = data.prices.map(p =>
            new Date(p[0]).toLocaleDateString()
        );

        const prices = data.prices.map(p => p[1]);

        return { labels, prices };
    }



// Initialize or update Chart.js chart
    async function updateChart() {
        const { labels, prices } = await fetchChartData();

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = prices;

            chart.data.datasets[0].label = `${currentName} / Price (USD)`;
            chart.options.scales.y.title.text = `${currentName} / Price (USD)`;
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${currentName} / Price (USD)`,
                        data: prices,
                        borderColor: "#fff",
                        backgroundColor: "rgb(255 255 255 / 0.25)",
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: `${currentName} / Price (USD)`
                            },
                            beginAtZero: false
                        }
                    }
                }
            });
        }
    }

    // coinSelect.addEventListener("change", e => {
    //     currentCoin = e.target.value;
    //     updateChart();
    // });

    document.querySelectorAll("[data-days]").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!btn.dataset.days) return;
            document.querySelectorAll("[data-days]").forEach(day => {day.classList.remove("active");});
            currentDays = btn.dataset.days;
            btn.classList.add("active");
            updateChart();
        });
    });


    (async function init() {
        document.querySelectorAll("[data-days]")[0].click()
        updateChart();
    })();

    async function loadCoins(){
        let select = document.querySelector(".chart-coins");
        let url = "http://127.0.0.1:8000/api/list/";
        let response = await fetch(url);
        let data = await response.json();

        data.slice(0,20).forEach(coin => {
            select.innerHTML += `
            <option value="${coin.id}">
                ${coin.name} (${coin.symbol.toUpperCase()})
            </option>
        `;
        })

        select.addEventListener("change", () => {
            currentCoin = select.value;

            currentName = select.options[select.selectedIndex].text;
            updateChart();
        })
    }

    await loadCoins();


    async function Exchange(){
        let currency_container = document.querySelectorAll(".currency_selection_symbols")
        let url = "http://127.0.0.1:8000/api/exchange/";
        let response = await fetch(url);
        let data = await response.json();

        currency_container.forEach(container => {
            container.innerHTML = ``
            for (let x in data){
                // console.log(data[x]);
                container.innerHTML += `
                    <option>${data[x].data}</option>
                `
            }

        });
        let imgContainer = document.querySelectorAll(".currency_img_container");
        currency_container.forEach((container, index) => {
            let imgContainer = document.querySelectorAll(".currency_img_container");

            container.addEventListener("change", () => {
                let amount = document.querySelector(".currency_amount");
                if(amount)amount.value = "";

                let imgUrl = data.filter(i => i.data === container.value);
                imgContainer[index].innerHTML = `
                    <img src="${imgUrl[0].flagUrl}">
                `
            });

        })
        let imgUrl2 = data.filter(i => i.data === currency_container[0].value);
        imgContainer[0].innerHTML = `
            <img src="${imgUrl2[0].flagUrl}">
        `

        currency_container[1].value = "NGN"
        let imgUrl3 = data.filter(i => i.data === currency_container[1].value);
        imgContainer[1].innerHTML = `
            <img src="${imgUrl3[0].flagUrl}">
        `



    }
    Exchange();

    async function conversion(){
        let amount = document.querySelector(".currency_amount").value;
        let from = document.querySelector("#currency_from").value;
        let to = document.querySelector("#currency_to").value;

        if (!amount)return alert("Please enter amount");

        amount = parseInt(amount);
        from = from.toString();
        to = to.toString();

        convert_Currencies(amount, from, to);
    }
    document.querySelector(".currency_btn").addEventListener("click", async () => {
        await conversion();
    })



  async function convert_Currencies(amount, from, to){
        let url = "http://127.0.0.1:8000/api/convert";
        let response = await fetch(`${url}?amount=${amount}&from_Currency=${from}&to_Currency=${to}`);
        let data = await response.json();

        let currency_result = document.querySelector(".currency_result");

      let formattedResult = Number(data.result).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      });

      let formattedRate = Number(data.rates).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
      });

      if (currency_result) return currency_result.innerHTML = `
    <div class="conversion_result">
        <strong>${amount.toLocaleString()} ${from}</strong>
        <br>
        <span style="color: gold;">${formattedResult} ${to}</span>
        <br>
        <small>Rate: 1 ${from} = ${formattedRate} ${to}</small>
    </div>
`;

    }









}


