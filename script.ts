import { API_KEY } from "./config.js";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;
const COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,currencies,flags";

// DOM Elements
const amountInp = document.getElementById("amount") as HTMLInputElement;
const fromSel = document.getElementById("fromCurrency") as HTMLSelectElement;
const toSel = document.getElementById("toCurrency") as HTMLSelectElement;
const fromFlag = document.getElementById("fromFlag") as HTMLImageElement;
const toFlag = document.getElementById("toFlag") as HTMLImageElement;
const convForm = document.getElementById("converterForm") as HTMLFormElement;
const resMsg = document.querySelector(".result-message") as HTMLElement;
const errMsg = document.querySelector(".error-message") as HTMLElement;

// TypeScript Interfaces
interface CountryData {
    flags: { png: string };
    currencies: { [code: string]: { name: string } };
}

interface CurrencyInfo {
    name: string;
    flag: string;
}

interface ExchangeRateResponse {
    result: string;
    conversion_result: number;
    conversion_rate: number;
}

// State management
const currencyMap = new Map<string, CurrencyInfo>();

/**
 * Initializes the app by fetching countries and populating dropdowns
 */
async function initializeApp(): Promise<void> {
    try {
        const response = await fetch(COUNTRIES_URL);
        const countries: CountryData[] = await response.json();

        countries.forEach(country => {
            const currencyKeys = country.currencies ? Object.keys(country.currencies) : [];
            if (currencyKeys.length > 0) {
                const code = currencyKeys[0];
                if (!currencyMap.has(code)) {
                    currencyMap.set(code, {
                        name: country.currencies[code].name,
                        flag: country.flags.png
                    });
                }
            }
        });

        const sortedCodes = Array.from(currencyMap.keys()).sort();
        [fromSel, toSel].forEach(select => {
            sortedCodes.forEach(code => {
                const opt = new Option(`${code} - ${currencyMap.get(code)!.name}`, code);
                select.add(opt);
            });
        });

        fromSel.value = "USD";
        toSel.value = "INR";
        updateFlagIcons();

    } catch {
        toggleStatus("Failed to load currency data. Check your connection.", true);
    }
}

function updateFlagIcons(): void {
    fromFlag.src = currencyMap.get(fromSel.value)?.flag || "";
    toFlag.src = currencyMap.get(toSel.value)?.flag || "";
}

function toggleStatus(message: string, isError = false): void {
    resMsg.classList.toggle("hidden", isError || !message);
    errMsg.classList.toggle("hidden", !isError || !message);
    (isError ? errMsg : resMsg).textContent = message;
}

// Event Listeners
[fromSel, toSel].forEach(s => s.addEventListener("change", updateFlagIcons));

convForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const amount = parseFloat(amountInp.value);

    if (isNaN(amount) || amount <= 0) {
        return toggleStatus("Please enter a valid positive amount.", true);
    }

    const btn = convForm.querySelector("button")!;
    btn.textContent = "Converting...";
    toggleStatus("");

    try {
        // Using the Pair Conversion endpoint with amount for direct result
        const url = `${BASE_URL}/pair/${fromSel.value}/${toSel.value}/${amount}`;
        const res = await fetch(url);
        const data: ExchangeRateResponse = await res.json();

        if (data.result !== "success") throw new Error();

        const formattedResult = data.conversion_result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        toggleStatus(`${amount.toLocaleString()} ${fromSel.value} = ${formattedResult} ${toSel.value}`);
    } catch {
        toggleStatus("Conversion failed. Using your private API key failed.", true);
    } finally {
        btn.textContent = "Convert";
    }
});

initializeApp();