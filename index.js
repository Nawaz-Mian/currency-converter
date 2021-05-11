const axios = require('axios');

const  FIXER_API_KEY = '373bf878769100916dd4b5b4c9644272';
const FIXER_API_URL = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

const REST_COUNTRIES_API_URL = `https://restcountries.eu/rest/v2/currency`;

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const { data : { rates } } = await axios.get(FIXER_API_URL);
        const euro = 1 / rates[fromCurrency];
        const exchangeRate = euro * rates[toCurrency];
        return exchangeRate;
        
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }

}

const getCountries = async (currencyCode) => {
    try {
        const { data } = await axios.get(`${REST_COUNTRIES_API_URL}/${currencyCode}`);
        return data.map(({ name }) => name);
        
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
}

const convertCurrency = async (toCurrency, fromCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();
    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency,toCurrency),
        getCountries(toCurrency)
    ]);

    const convertedAmount = (amount * exchangeRate).toFixed(2);
    return (
        `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
        You can spend these in the following countries: ${countries}.`
    );
}

convertCurrency('AUD', 'USD', 10)
.then(response => console.log(response))
.catch(error => console.log(error));