var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { API_KEY } from "./config.js";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;
const COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,currencies,flags";
const amountInp = document.getElementById("amount");
const fromSel = document.getElementById("fromCurrency");
const toSel = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const convForm = document.getElementById("converterForm");
const resMsg = document.querySelector(".result-message");
const errMsg = document.querySelector(".error-message");
const currencyMap = new Map();
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(COUNTRIES_URL);
            const countries = yield response.json();
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
                    const opt = new Option(`${code} - ${currencyMap.get(code).name}`, code);
                    select.add(opt);
                });
            });
            fromSel.value = "USD";
            toSel.value = "INR";
            updateFlagIcons();
        }
        catch (_a) {
            toggleStatus("Failed to load currency data. Check your connection.", true);
        }
    });
}
function updateFlagIcons() {
    var _a, _b;
    fromFlag.src = ((_a = currencyMap.get(fromSel.value)) === null || _a === void 0 ? void 0 : _a.flag) || "";
    toFlag.src = ((_b = currencyMap.get(toSel.value)) === null || _b === void 0 ? void 0 : _b.flag) || "";
}
function toggleStatus(message, isError = false) {
    resMsg.classList.toggle("hidden", isError || !message);
    errMsg.classList.toggle("hidden", !isError || !message);
    (isError ? errMsg : resMsg).textContent = message;
}
[fromSel, toSel].forEach(s => s.addEventListener("change", updateFlagIcons));
convForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const amount = parseFloat(amountInp.value);
    if (isNaN(amount) || amount <= 0) {
        return toggleStatus("Please enter a valid positive amount.", true);
    }
    const btn = convForm.querySelector("button");
    btn.textContent = "Converting...";
    toggleStatus("");
    try {
        const url = `${BASE_URL}/pair/${fromSel.value}/${toSel.value}/${amount}`;
        const res = yield fetch(url);
        const data = yield res.json();
        if (data.result !== "success")
            throw new Error();
        const formattedResult = data.conversion_result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        toggleStatus(`${amount.toLocaleString()} ${fromSel.value} = ${formattedResult} ${toSel.value}`);
    }
    catch (_a) {
        toggleStatus("Conversion failed. Using your private API key failed.", true);
    }
    finally {
        btn.textContent = "Convert";
    }
}));
initializeApp();
