import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
const API_URL = "https://api.frankfurter.dev/v1/";
const defaultFrom = 'USD';
const defaultTo = 'AUD';
let currenciesCode;
let currenciesName;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  
  try {
    const result = await axios.get(API_URL + "currencies")
    currenciesCode = Object.keys(result.data);
    currenciesName = Object.values(result.data);

    res.render("index.ejs", { 
      currencyCode: currenciesCode,
      currencyName: currenciesName,
      convertedResult: null,
      amount: null,
      fromCurrency: defaultFrom,
      toCurrency: defaultTo,
      error: null  
    });

  } catch (error) {
    res.status(500).send("Error fetching currencies");
  }

})

app.post("/convert", async (req, res) => {
  const response = req.body;
  const fromCurrency = response['from-currency'];
  const toCurrency = response['to-currency'];
  const amount = Number(response['amount']);

  let convertedResult = await convert(fromCurrency, toCurrency, amount);

  if (convertedResult !== null) {

    if (convertedResult == 0.00) {
      convertedResult = null;
    }

    res.render("index.ejs", {
      convertedResult: convertedResult,
      currencyCode: currenciesCode,
      currencyName: currenciesName,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      amount: amount,
      error: "Please enter an amount"
    });

  } else {

    res.render("index.ejs", {
      error: "Error converting currency",
      currencyCode: currenciesCode,
      currencyName: currenciesName,
      convertedResult: null,
      fromCurrency: null,
      toCurrency: null,
      amount: null
    })

  }

});

app.listen(port, () => {
  console.log('Listening on port', port);
})

async function convert(from, to, amount) {

  try {
    const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
    const data = await resp.json();
    const convertedAmount = (amount * data.rates[to]).toFixed(2);
    const formattedConvertedAmount = formatNumber(convertedAmount);
    return formattedConvertedAmount;
  } catch (error) {
    console.error("Error in convert:", error);
    return null;
  }

  function formatNumber(numberString) {
    const [integerPart, decimalPart] = numberString.split('.');
  
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  }

}
