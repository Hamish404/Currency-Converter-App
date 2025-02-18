import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.frankfurter.dev/v1/";
let currenciesList;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  
  try {
    const result = await axios.get(API_URL + "currencies")
    currenciesList = Object.keys(result.data);
    console.log(currenciesList);

    res.render("index.ejs", { 
      currency: currenciesList,
      convertedResult: null,
      toCurrency: null,
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

  const convertedResult = await convert(fromCurrency, toCurrency, amount);
  
  if (convertedResult !== null) {
    res.render("index.ejs", {
      convertedResult: convertedResult,
      currency: currenciesList,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    });
  } else {
    res.render("index.ejs", {
      error: "Error converting currency"
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
    return convertedAmount;
  } catch (error) {
    console.error("Error in convert:", error);
    return null;
  }

}
