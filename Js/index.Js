alert("Praise the LORD")

let mylinks = document.querySelectorAll(".mylinks");
let container = document.querySelector(".page_containers");

mylinks.forEach(link => {
    link.addEventListener("click", function(e)  {
        let Text_link = this.innerText;

        if(!container.classList.contains("onScroll")) {
            container.classList.add("onScroll")
        }

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


    let notification_wrapper = document.querySelector(".dash_butts_wrapper");
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
                if(div){
                    div.remove();
                }
                Container.classList.add("onScroll")
            })
        return div;
    }

    function btnClicks(){
        let Tran_btn = Container.querySelectorAll(".Tran_btn");
        Tran_btn.forEach(element => {
            element.addEventListener("click", () =>{

                let template = CreateTemplates();
                Container.appendChild(template);

                let tran_Modal = template.querySelector("#transactionModal");

                if(Container.contains(template)){
                    Container.classList.remove("onScroll")
                }else{
                    Container.classList.add("onScroll")
                }

                openTransaction(element.dataset.type, Container)

                if(element.dataset.type === "buy" || element.dataset.type === "sell"){

                    collect(Container);
                    tran_Modal.classList.add("transaction_H_inc");
                    console.log(tran_Modal);
                }else{
                    tran_Modal.classList.remove("transaction_H_inc");
                    // template.querySelector("#transactionModal").classList.remove("transaction_H_inc");
                }

            })
        })
    }

    btnClicks()


    async function collect(container) {

        const cont = container.querySelector("#formFields");
        const sell_buy = cont.querySelector(".selectOption");

        const coins_wrapper = sell_buy.querySelector(".coins");
        const logo = sell_buy.querySelector("img");
        const symbol = sell_buy.querySelector(".select_coin_symbol");

        const form = container.querySelector("#transactionForm");

        const AllCoins = await coinList();

        // =========================
        // REMOVE OLD INPUTS
        // =========================
        form.querySelectorAll("input[name='coin'], input[name='price']")
            .forEach(el => el.remove());

        // =========================
        // CREATE HIDDEN INPUTS
        // =========================
        let coinInput = document.createElement("input");
        coinInput.type = "hidden";
        coinInput.name = "coin";

        let priceInput = document.createElement("input");
        priceInput.type = "hidden";
        priceInput.name = "price";

        form.appendChild(coinInput);
        form.appendChild(priceInput);

        // =========================
        // SET DROPDOWN
        // =========================
        coins_wrapper.innerHTML = "";

        AllCoins.forEach(coin => {
            let option = document.createElement("option");
            option.value = coin.id;
            option.textContent = coin.name;
            coins_wrapper.appendChild(option);
        });

        let first = AllCoins[0];

        logo.src = first.image;
        symbol.textContent = `(${first.symbol.toUpperCase()})`;

        coinInput.value = first.id;
        priceInput.value = first.current_price;

        // =========================
        // GET SELL INPUT (VISIBLE BUT DISABLED UX)
        // =========================
        const quantityInput = form.querySelector("input[name='quantity']");

        // 💡 make it controlled (you said "disabled input")
        if (quantityInput) {
            quantityInput.readOnly = false;
            quantityInput.value = "1";// or false if you still want typing
             // default starter value
        }


        // =========================
        // AUTO PRICE DISPLAY (ON OPEN)
        // =========================
        let priceDisplay = document.createElement("div");
        priceDisplay.className = "live_price";
        priceDisplay.style.marginTop = "8px";
        priceDisplay.innerHTML = `Current ${(first.symbol.toUpperCase())} Price: <b>${Number(first.current_price).toLocaleString()}</b> USD`;

        let my_cont = form.querySelector(".sell_buy_same");
        my_cont.insertAdjacentElement("beforebegin", priceDisplay);


        coins_wrapper.addEventListener("change", () => {

            const selected = AllCoins.find(c => c.id === coins_wrapper.value);
            if (!selected) return;

            logo.src = selected.image;
            symbol.textContent = `(${selected.symbol.toUpperCase()})`;

            coinInput.value = selected.id;
            priceInput.value = selected.current_price;

            // update price instantly

            priceDisplay.innerHTML = `Current ${(selected.symbol.toUpperCase())} Price: <b>${Number(selected.current_price).toLocaleString()}</b> USD`;
        });
    }

    async function openTransaction(type, container) {
        const formFields = container.querySelector("#formFields");
        const form = container.querySelector("#transactionForm");

        const title = container.querySelector("#modalTitle");
        const form_btn_wrapper = container.querySelector(".form_btn_wrapper");

        form.dataset.type = type;

        // reset UI
        formFields.innerHTML = "";

        if (type === 'buy' || type === 'sell') {
            formFields.style.height = "75%";
            form_btn_wrapper.style.height = "25%";
            let btn = form_btn_wrapper.querySelectorAll("button");

            btn.forEach(btn => {
                btn.style.height = "40px";
            })

        }

        const config = {
            deposit: {
                title: "Deposit Funds",
                fields: `
                <input class="inpt_Same" type="number" name="amount" placeholder="Amount (USD)" required />
            `
            },
            withdraw: {
                title: "Withdraw Funds",
                fields: `
                <input class="inpt_Same" type="number" name="amount" placeholder="Amount (USD)" required />
            `
            },
            buy: {
                title: "Buy Crypto",
                fields: `
                <div class="sell_buy_same sell_buy_same2 selectOption">
                    <span class="select_coin_logo">
                        <img src="" alt="">
                    </span>
                    <h3 class="select_coin_symbol"></h3>
                    <select class="coins"></select>
                </div>

             <div class="quantity_wrapper">
                   <input class="input_small" type="number" name="quantity" placeholder="Coin Quantity" required />
                </div>
            `
            },
            sell: {
                title: "Sell Crypto",
                fields: `
                <div class="sell_buy_same sell_buy_same2 selectOption">
                    <span class="select_coin_logo">
                        <img src="" alt="">
                    </span>
                    <h3 class="select_coin_symbol"></h3>
                    <select class="coins"></select>
                </div>
                <div class="quantity_wrapper">
                   <input class="input_small" type="number" name="quantity" placeholder="Coin Quantity" required />
                </div>
            `
            }
        };


        title.textContent = config[type].title;
        formFields.innerHTML = config[type].fields;

        // ========== BUY/SELL COIN SETUP ==========
        let coinInput, priceInput, coins_wrapper, logo, symbol, AllCoins, CALC_cont, my_Price, Input_Timer, amount;

        if (type === "buy" || type === "sell") {

            const sell_cont = formFields.querySelector(".selectOption");
            let quantity_wrapper = formFields.querySelector(".quantity_wrapper");
            console.log(quantity_wrapper)
            const quantityInput = quantity_wrapper.querySelector("input[name='quantity']");
            if (quantityInput) {
                quantityInput.value = 1;
            }
            coins_wrapper = sell_cont.querySelector(".coins");
            logo = sell_cont.querySelector("img");
            symbol = sell_cont.querySelector(".select_coin_symbol");

            AllCoins = await coinList();

            CALC_cont = document.createElement("div");
            CALC_cont.className = "Calc_";


            // hidden inputs
            coinInput = document.createElement("input");
            coinInput.type = "hidden";
            coinInput.name = "coin";

            priceInput = document.createElement("input");
            priceInput.type = "hidden";
            priceInput.name = "price";


            form.appendChild(coinInput);
            form.appendChild(priceInput);
            console.log(priceInput);
            console.log(coinInput);
            quantity_wrapper.appendChild(CALC_cont);

            // fill dropdown
            AllCoins.forEach(coin => {
                let option = document.createElement("option");
                option.textContent = coin.name;
                option.value = coin.id;
                coins_wrapper.appendChild(option);
            });

            // default coin
            let first = AllCoins[0];

            logo.src = first.image;
            symbol.textContent = `(${first.symbol.toUpperCase()})`;

            coinInput.value = first.id;

            my_Price = `${Number(quantityInput.value) * Number(first.current_price)}`

            priceInput.value = quantityInput.value;

            console.log(priceInput.value);
            console.log(coinInput.value);
            console.log(quantityInput.value);
            CALC_cont.innerHTML = `${quantityInput.value} (${first.symbol.toUpperCase()}) = <p class="col_price">$${my_Price.toLocaleString()}</p>`;

            coins_wrapper.addEventListener("change", () => {

                const selected = AllCoins.find(
                    c => c.id === coins_wrapper.value
                );

                if (!selected) return;

                logo.src = selected.image;
                symbol.textContent = `(${selected.symbol.toUpperCase()})`;

                coinInput.value = selected.id;
                updateCalculation()

            });


            quantityInput.addEventListener('input', (e) => {
                clearTimeout(Input_Timer)

                Input_Timer = setTimeout(() => {
                        updateCalculation()
                }, 500)
            })

            function updateCalculation() {

                const selectedCoin = AllCoins.find(
                    c => c.id === coins_wrapper.value
                );

                if (!selectedCoin) return;

                let quantity = Number(quantityInput.value || 1);

                let totalPrice =
                    quantity * Number(selectedCoin.current_price);

                priceInput.value = quantity;

                CALC_cont.innerHTML =
                    `${quantity} ${selectedCoin.symbol.toUpperCase()} = <p class="col_price">$${totalPrice.toLocaleString()}</p>`;
            }
        }

        // ========== FORM SUBMIT ==========
        form.onsubmit = async (e) => {
            e.preventDefault();

            const action = form.dataset.type;

            const endpoints = {
                deposit: "http://127.0.0.1:8000/api/deposit/",
                withdraw: "http://127.0.0.1:8000/api/withdraw/",
                buy: "http://127.0.0.1:8000/api/buy/",
                sell: "http://127.0.0.1:8000/api/sell/"
            };

            const formData = new FormData(form);
            let template = Container.querySelector(".modalbox");
            const amount_inpt = formFields.querySelector("input[name='amount']");
            let modelTimer;

            try{
                const response = await fetch(endpoints[action], {
                    method: "POST",
                    body: formData
                });

                let data = await response.json();

                if (data.success) {
                    alert("PRAISE THE LORD❕Transaction Done Successfully! ✅✅✅");
                    let removebtn = template.querySelector(".del_modal");
                    console.log(data)
                    if(amount_inpt){
                        amount_inpt.value = '';
                    }
                    clearTimeout(modelTimer);

                    modelTimer = setTimeout(() =>{
                        template.remove()
                        Container.classList.add("onScroll")
                    }, 800)


                    await Wallet();
                } else {
                    alert(data.error);
                }

            }catch(error){
                console.error(error);
            }

        };
    }


    async function Wallet() {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/wallet_data/"
            );

            const data = await response.json();

            if (!data.success) {
                console.log(data.error);
                document.querySelector(".balance").textContent = "$0";
                document.querySelector(".Income_wrapper h3").textContent = "$0";
                document.querySelector(".Expenses_wrapper h3").textContent = "$0";
                return;
            }

            document.querySelector(".balance").textContent =
                `$${Number(data.balance).toLocaleString()}`;

            document.querySelector(".Income_wrapper h3").textContent =
                `$${Number(data.income).toLocaleString()}`;

            document.querySelector(".Expenses_wrapper h3").textContent =
                `$${Number(data.expenses).toLocaleString()}`;

            console.log(data)
        } catch (err) {
            console.error(err);
        }
    }


    Wallet()


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
    let chart_wrapper = document.querySelector(".chart-wrapper")
    const endPoint = {
        1: {
            type: "Daily",
        },
        7: {
            type: "Weekly",
        },
        30: {
            type: "Monthly",
        },
        365: {
            type: "Yearly",
        }
    }

    async function fetchChartData() {
        const res = await fetch(
            `http://127.0.0.1:8000/api/chart_data2/${currentCoin}/${currentDays}/`
        );

        const data = await res.json();

        // console.log("Response:", data);
        if (data.error == "Rate_limit_exceeded") {
            alert(`Hi there! Your ${data.error}`);

            if (chart_wrapper) {
                chart_wrapper.classList.add("chart-wrapper_error")
                let div = document.createElement("div");
                    div.classList.add("chart_wrapper_error_div");
                    div.innerHTML = `Chart temporarily unavailable.`

                chart_wrapper.appendChild(div);
            }


            return null;
        }

        if (!data.prices) {
            alert(`${currentCoin} has no ${endPoint[currentDays].type} Chart Available`)

            let buttons = document.querySelectorAll("[data-days]");

            buttons.forEach(button => {
                  if (button.dataset.days === currentDays) {
                       button.disabled = true;
                  }
            })

            return {
                labels: [],
                prices: []
            }

        }

        if(chart_wrapper.classList.contains("chart-wrapper_error")) {
            chart_wrapper.classList.remove("chart-wrapper_error")
        }

        if(chart_wrapper){
            let div = chart_wrapper.querySelectorAll(".chart_wrapper_error_div");

            div.forEach(d =>{
                if (chart_wrapper.contains(d)) {
                    d.remove()
                }
            })

        }

        //
        // const firstTimeStamp = data.prices[0][0]
        // const oldestDate = new Date(firstTimeStamp);
        //
        // alert(oldestDate);
        //
        // console.log(oldestDate);

        console.log("Coin:", currentCoin);
        console.log("Prices count:", data.prices?.length);
        console.log("First:", data.prices?.[0]);
        console.log("Last:", data.prices?.[data.prices.length - 1]);

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




    async function loadCoins(){
        let select = document.querySelector(".chart-coins");
        let url = "http://127.0.0.1:8000/api/list/";
        let response = await fetch(url);
        let data = await response.json();

        data.forEach(coin => {
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
                let currency_result = document.querySelector(".currency_result");
                if (currency_result)currency_result.innerHTML = 'PRAISE THE LORD';

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



  async function convert_Currencies(amount, from, to) {
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
          maximumFractionDigits: 2
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

    async function Popular_Trending() {
        let [popular, trending] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/popular"),
            fetch("http://127.0.0.1:8000/api/trending"),
        ])

        let popular_data = await popular.json()
        let trending_data = await trending.json()

        return{
            popularCoins: popular_data,
            trending_data: trending_data
        }
    }

    let coinsHeaderName = document.querySelector(".pop_header_name h1");



    let pop_trends_Btn = document.querySelectorAll(".pops_trends_btn");
    let mycontainer = document.querySelector(".main_pop_trend_container");

    for(let x = 0; x < pop_trends_Btn.length; x++){
        pop_trends_Btn[x].addEventListener("click", async (e) => {
            e.preventDefault();
            let text = e.target.innerText.toLowerCase().trim();
            pop_trends_Btn.forEach((item => item.classList.remove("active")))
            pop_trends_Btn[x].classList.add("active");




            Popular_Trending().then(data =>{
                if(text === "trending"){
                    mycontainer.innerHTML = ``
                    let normalizedTrendingCoins = data.trending_data.coins.map(normalizeTrending);

                    let myTrendings = normalizedTrendingCoins.filter(coin =>
                        coin.name !== "Bitcoin" &&
                        coin.name !== "Solana" &&
                        coin.name !== "Hyperliquid" &&
                        coin.name !== "Ethereum"
                    ).slice(0, 13)



                    myTrendings.forEach(async (coin, i) => {
                        mycontainer.appendChild(await displayPopular_trends_(coin, text.toString()));
                    })
                    coinsHeaderName.innerHTML = `Top ${myTrendings.length} ${text} Coins`

                }else{

                    mycontainer.innerHTML = ``
                    coinsHeaderName.innerHTML = `Top ${data.popularCoins.length} ${text} Coins`
                    data.popularCoins.forEach(async (element) => {
                        mycontainer.appendChild(await displayPopular_trends_(element, text.toString()));
                    })
                }
            })
        })
    }



    function createSparkline(data, width = 120, height = 40, type) {

        if (type === "trending") {
            mycontainer.classList.add("griding");

            if(mycontainer.classList.contains("flexDisplay")){

                mycontainer.classList.remove("flexDisplay");

            }

            let img = document.createElement("img");
            img.src = data;
            img.alt = "sparkline";
            img.className = "sparkline";
            return img;
        }

        if(!data){
            coinsHeaderName.innerHTML = `Failed to (LOAD Coins)`;

            if(mycontainer.classList.contains("griding")){
                mycontainer.classList.remove("griding");
            }
            mycontainer.classList.add("flexDisplay");

            mycontainer.innerHTML = `Error While fetching Coins, Please try again!`;
            return;
        }

        if(mycontainer.classList.contains("flexDisplay")){

            mycontainer.classList.remove("flexDisplay");

        }
        const min = Math.min(...data);
        const max = Math.max(...data);

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;

            const y =
                height -
                ((value - min) / (max - min || 1)) * height;

            return `${x},${y}`;
        }).join(" ");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", "currentColor");
        polyline.setAttribute("stroke-width", "1");
        polyline.setAttribute("points", points);

        svg.appendChild(polyline);

        return svg;
    }


   function displayPopular_trends_(coin, type) {

        let div = document.createElement("div");
        div.className = "grids_coins";

        let spark_data = type === "popular"
            ? coin?.sparkline_in_7d?.price
            : coin?.sparkline

        const sparkline = createSparkline(
            spark_data,
            120,
            40,
            type
        );
        let price_change = type === "trending" ? parseInt(coin.price_change_percentage_24h) : parseInt(coin.price_change_percentage_24h);

        div.innerHTML = `
        <div class="coin_header">
            <img src="${coin.image}" alt="${coin.name}">
            <div>
                <h3>${coin.name}</h3>
                <span>${coin.symbol.toUpperCase()}</span>
            </div>
        </div>

        <div class="coin_chart ${coin.price_change_percentage_24h > 0 ? 'upchart' : 'downchart'}"></div>

        <div class="coin_price">
           $${coin.current_price.toFixed(2)}
        </div>

        <div class="coin_change ${coin.price_change_percentage_24h >= 0 ? 'upchart' : 'downchart'}">
            ${price_change.toFixed(2)}%
        </div>
    `;

        div.querySelector(".coin_chart").appendChild(sparkline);

        return div;
    }


    function normalizeTrending(trendingCoin) {

        const coin = trendingCoin.item;

        return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.small,
            current_price: coin.data.price,
            sparkline: coin.data.sparkline,
            price_change_percentage_24h: coin.data.price_change_percentage_24h.btc,
        };

    }


    const notificationIcons = {

        BUY: [
            "🟢",
            "📈",
            "💹",
            "🪙"
        ],

        SELL: [
            "🔴",
            "📉",
            "💸",
            "💰"
        ],

        DEPOSIT: [
            "💵",
            "🏦",
            "💳",
            "📥"
        ],

        WITHDRAW: [
            "💸",
            "📤",
            "🏧",
            "💰"
        ],

        CURRENCY_CONVERTER: [
            "💱",
            "🔄",
            "🌍",
            "💹"
        ],

        ALERT: [
            "🚨",
            "🔔",
            "⚠️",
            "📢"
        ],

        SYSTEM: [
            "⚙️",
            "🛠️",
            "📡",
            "🔷"
        ],

        MESSAGE: [
            "💬",
            "📩",
            "✉️",
            "📨"
        ],

        PROFIT: [
            "🚀",
            "📈",
            "💰",
            "🔥"
        ],

        LOSS: [
            "📉",
            "⚠️",
            "🔻",
            "😬"
        ],

        SECURITY: [
            "🔒",
            "🛡️",
            "🔐",
            "🚨"
        ],

        VERIFIED: [
            "✅",
            "✔️",
            "🎉",
            "🏅"
        ]
    };


    async function getNotifications() {
        await fetch("http://127.0.0.1:8000/api/notification/", {
            method: "GET",
            headers: {"content-type": "application/json"},
        }).then(res => res.json()).then(data => {
                console.log(data);
            let displaying = displayNotification(data);
            const container = notification_wrapper.querySelector(".myMain_Notification_body");
           container.appendChild(displaying);
        }).catch(err => {
            console.log(err)
        })
    }

    function displayNotification(data) {
        let mainDiv = document.createElement("main");
            mainDiv.className = "main_Notifications_Container";

            for(let i = 0; i < data.length; i++) {
                console.log(data[i].created_at)

                let data_icon = getNotificationsIcon(data[i].type);

                let div = document.createElement("div");
                div.className = "Each_notifications_container";

                div.innerHTML = `
                    <div class="notification">
                        <nav class="icons">
                            <span class="icon_span">${data_icon}</span>
                        </nav>
                        <div class="notification_title_message_wrapper">
                             <header class="notification_header">
                                   <h2>${data[i].title}</h2>
                                   <small>${timeAgo(data[i].created_at)}</small>
                            </header>
                            
                            <main class="notification_message_wrapper">
                                <p>${data[i].message}</p>
                            </main>
                        </div>
                  </div>
                `

                mainDiv.appendChild(div);
            }

            return mainDiv;
    }

    function getNotificationsIcon(type){

        let icons = notificationIcons[type] || "🛫";

        return icons[
                Math.floor(Math.random() * icons.length)
            ];
    }

    let notification_button = document.querySelector(".not");

    if(notification_button){
        notification_button.addEventListener("click", async function() {

            main_Notification_Container(this);


        })
    }

    async function main_Notification_Container(ele){
        let mydiv = document.querySelector(".myMain_Notification_wrapper")

        if(mydiv){

            setTimeout(() => {

                mydiv.classList.add("hide");

                mydiv.addEventListener("animationend", () => {
                    notification_wrapper.removeChild(mydiv);
                });

            }, 50);

            if(ele){
                ele.classList.remove("active");
            }
            return;
        }

        let div = document.createElement("div");
        div.className = "myMain_Notification_wrapper";
        div.innerHTML = `
            <header class="myMain_Notification_header">
                <nav class="notification_head">
                    <h2 class="notification_header_Text">🔔 All Notifications</h2>
                </nav>
                <button class="clear_notification_BTN">clear</button>
            </header>   
            <main class="myMain_Notification_body"></main>   
        `


        notification_wrapper.appendChild(div);

        if(ele){
            ele.classList.add("active");
        }
        await getNotifications();
    }


    function timeAgo(dateString) {

        const date = new Date(dateString);
        const now = new Date();

        const seconds = Math.floor(
            (now - date) / 1000
        );

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        if (seconds < 10) {
            return "Just now";
        }

        if (seconds < intervals.minute) {
            return `${seconds}s ago`;
        }

        if (seconds < intervals.hour) {
            const minutes = Math.floor(
                seconds / intervals.minute
            );

            return `${minutes}min ago`;
        }

        if (seconds < intervals.day) {
            const hours = Math.floor(
                seconds / intervals.hour
            );

            return `${hours}hour ago`;
        }

        if (seconds < intervals.week) {
            const days = Math.floor(
                seconds / intervals.day
            );

            return days === 1
                ? "Yesterday"
                : `${days}days ago`;
        }

        if (seconds < intervals.month) {
            const weeks = Math.floor(
                seconds / intervals.week
            );

            return `${weeks}weeks ago`;
        }

        if (seconds < intervals.year) {
            const months = Math.floor(
                seconds / intervals.month
            );

            return `${months}month ago`;
        }

        const years = Math.floor(
            seconds / intervals.year
        );

        return `${years}year ago`;
    }








    (async function init() {
        document.querySelectorAll("[data-days]")[0].click()
        updateChart();
        pop_trends_Btn[0].click();
    })();










}


