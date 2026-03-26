const funds = [
  { name: "Nifty 50 Index Fund", category: "Equity", nav: 45.32, return_1y: 14.2, return_3y: 38.4, return_5y: 58.1, risk_level: "Medium", fund_house: "HDFC Mutual Fund" },
  { name: "Sensex Index Fund", category: "Equity", nav: 38.90, return_1y: 13.8, return_3y: 36.9, return_5y: 55.4, risk_level: "Medium", fund_house: "SBI Mutual Fund" },
  { name: "Nifty Next 50 Fund", category: "Equity", nav: 62.14, return_1y: 18.4, return_3y: 52.1, return_5y: 78.3, risk_level: "High", fund_house: "Nippon India" },
  { name: "Mid Cap Momentum Fund", category: "Equity", nav: 89.40, return_1y: 24.6, return_3y: 71.3, return_5y: 102.4, risk_level: "High", fund_house: "Axis Mutual Fund" },
  { name: "Small Cap Discovery Fund", category: "Equity", nav: 34.78, return_1y: 31.2, return_3y: 89.4, return_5y: 134.2, risk_level: "High", fund_house: "Quant Mutual Fund" },
  { name: "Flexi Cap Growth Fund", category: "Equity", nav: 72.60, return_1y: 19.8, return_3y: 55.7, return_5y: 82.6, risk_level: "Medium", fund_house: "Parag Parikh" },
  { name: "Large Cap Bluechip Fund", category: "Equity", nav: 51.20, return_1y: 12.4, return_3y: 33.8, return_5y: 51.2, risk_level: "Low", fund_house: "ICICI Prudential" },
  { name: "Focused Equity Fund", category: "Equity", nav: 94.30, return_1y: 22.1, return_3y: 61.2, return_5y: 91.8, risk_level: "High", fund_house: "Mirae Asset" },
  { name: "Dividend Yield Fund", category: "Equity", nav: 28.45, return_1y: 11.6, return_3y: 31.4, return_5y: 47.8, risk_level: "Low", fund_house: "UTI Mutual Fund" },
  { name: "ESG Sustainable Fund", category: "Equity", nav: 41.80, return_1y: 16.3, return_3y: 44.8, return_5y: 67.2, risk_level: "Medium", fund_house: "Kotak Mutual Fund" },
  { name: "IT & Tech Sector Fund", category: "Sector", nav: 118.90, return_1y: 28.4, return_3y: 82.1, return_5y: 121.4, risk_level: "High", fund_house: "Franklin Templeton" },
  { name: "Banking & Finance Fund", category: "Sector", nav: 67.20, return_1y: 17.2, return_3y: 47.6, return_5y: 71.3, risk_level: "Medium", fund_house: "Nippon India" },
  { name: "Healthcare & Pharma Fund", category: "Sector", nav: 82.50, return_1y: 21.4, return_3y: 59.3, return_5y: 88.6, risk_level: "High", fund_house: "DSP Mutual Fund" },
  { name: "Infrastructure Fund", category: "Sector", nav: 54.10, return_1y: 19.6, return_3y: 54.2, return_5y: 80.4, risk_level: "Medium", fund_house: "LIC Mutual Fund" },
  { name: "Consumption Growth Fund", category: "Sector", nav: 48.70, return_1y: 15.8, return_3y: 43.1, return_5y: 64.8, risk_level: "Medium", fund_house: "Tata Mutual Fund" },
  { name: "Tax Saver ELSS Fund", category: "ELSS", nav: 78.90, return_1y: 18.6, return_3y: 52.4, return_5y: 78.6, risk_level: "High", fund_house: "Axis Mutual Fund" },
  { name: "Long Term ELSS Growth", category: "ELSS", nav: 91.40, return_1y: 20.2, return_3y: 57.8, return_5y: 86.4, risk_level: "High", fund_house: "Mirae Asset" },
  { name: "Short Term Bond Fund", category: "Debt", nav: 24.30, return_1y: 6.3, return_3y: 19.1, return_5y: 32.4, risk_level: "Low", fund_house: "HDFC Mutual Fund" },
  { name: "Liquid Plus Fund", category: "Debt", nav: 1012.50, return_1y: 7.1, return_3y: 22.3, return_5y: 37.8, risk_level: "Low", fund_house: "SBI Mutual Fund" },
  { name: "Corporate Bond Fund", category: "Debt", nav: 31.60, return_1y: 8.4, return_3y: 26.2, return_5y: 44.1, risk_level: "Low", fund_house: "ICICI Prudential" },
  { name: "Dynamic Bond Fund", category: "Debt", nav: 19.80, return_1y: 9.2, return_3y: 28.6, return_5y: 48.2, risk_level: "Medium", fund_house: "Kotak Mutual Fund" },
  { name: "Overnight Safety Fund", category: "Debt", nav: 1008.40, return_1y: 6.8, return_3y: 21.0, return_5y: 35.4, risk_level: "Low", fund_house: "UTI Mutual Fund" },
  { name: "Gilt Fund Govt Securities", category: "Debt", nav: 42.10, return_1y: 7.6, return_3y: 23.4, return_5y: 39.6, risk_level: "Low", fund_house: "DSP Mutual Fund" },
  { name: "Aggressive Hybrid Fund", category: "Hybrid", nav: 63.50, return_1y: 16.4, return_3y: 45.2, return_5y: 67.8, risk_level: "Medium", fund_house: "Franklin Templeton" },
  { name: "Balanced Advantage Fund", category: "Hybrid", nav: 55.20, return_1y: 13.2, return_3y: 36.6, return_5y: 54.9, risk_level: "Low", fund_house: "Tata Mutual Fund" }
];

module.exports = funds;
