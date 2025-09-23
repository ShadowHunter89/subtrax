// ExternalApis.ts
// Unified wrappers for open-source APIs relevant to subscription management
// APIs: Alpha Vantage (finance), Finnhub (finance), MarketStack (finance), VATLayer (VAT validation), ReqRes (test data)

const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
const MARKETSTACK_KEY = process.env.REACT_APP_MARKETSTACK_KEY;
const VATLAYER_KEY = process.env.REACT_APP_VATLAYER_KEY;

export const AlphaVantageAPI = {
  // Get stock price
  async getStockPrice(symbol: string) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    const res = await fetch(url);
    return res.json();
  },
};

export const FinnhubAPI = {
  // Get company profile
  async getCompanyProfile(symbol: string) {
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    return res.json();
  },
};

export const MarketStackAPI = {
  // Get historical stock data
  async getHistorical(symbol: string) {
    const url = `https://api.marketstack.com/v1/eod?access_key=${MARKETSTACK_KEY}&symbols=${symbol}`;
    const res = await fetch(url);
    return res.json();
  },
};

export const VATLayerAPI = {
  // Validate VAT number
  async validateVAT(vatNumber: string) {
    const url = `https://api.vatlayer.com/validate?access_key=${VATLAYER_KEY}&vat_number=${vatNumber}`;
    const res = await fetch(url);
    return res.json();
  },
};

export const ReqResAPI = {
  // Get test users
  async getUsers() {
    const url = 'https://reqres.in/api/users';
    const res = await fetch(url);
    return res.json();
  },
};

// Add more APIs as needed for payments, analytics, etc.
