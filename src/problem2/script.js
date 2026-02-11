const PRICE_API = "https://interview.switcheo.com/prices.json";
const ICON_ROOT = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

let prices = {};

// Initialize application
async function start() {
    try {
        const response = await fetch(PRICE_API);
        const data = await response.json();
        
        // Clean data: get latest price for each token
        data.forEach(obj => {
            prices[obj.currency] = obj.price;
        });

        populateDropdowns();
        updateUI();
    } catch (err) {
        document.getElementById('rate-text').innerText = "Error loading prices.";
    }
}

function populateDropdowns() {
    const inputSel = document.getElementById('input-token');
    const outputSel = document.getElementById('output-token');
    const tokens = Object.keys(prices).sort();

    tokens.forEach(t => {
        inputSel.add(new Option(t, t));
        outputSel.add(new Option(t, t));
    });

    // Defaults
    inputSel.value = "ETH";
    outputSel.value = "USDC";
}

function updateUI() {
    const fromToken = document.getElementById('input-token').value;
    const toToken = document.getElementById('output-token').value;
    const amount = parseFloat(document.getElementById('input-amount').value);
    
    // Update Icons
    document.getElementById('input-icon').src = `${ICON_ROOT}${fromToken}.svg`;
    document.getElementById('output-icon').src = `${ICON_ROOT}${toToken}.svg`;

    // Handle Calculation
    if (amount > 0 && prices[fromToken] && prices[toToken]) {
        const rate = prices[fromToken] / prices[toToken];
        document.getElementById('output-amount').value = (amount * rate).toFixed(6);
        document.getElementById('rate-text').innerText = `1 ${fromToken} ≈ ${rate.toFixed(6)} ${toToken}`;
        document.getElementById('confirm-button').disabled = false;
    } else {
        document.getElementById('output-amount').value = "";
        document.getElementById('confirm-button').disabled = true;
    }
}

// Event Listeners
document.getElementById('input-amount').addEventListener('input', updateUI);
document.getElementById('input-token').addEventListener('change', updateUI);
document.getElementById('output-token').addEventListener('change', updateUI);

document.getElementById('switch-button').addEventListener('click', () => {
    const i = document.getElementById('input-token');
    const o = document.getElementById('output-token');
    [i.value, o.value] = [o.value, i.value];
    updateUI();
});

start();
