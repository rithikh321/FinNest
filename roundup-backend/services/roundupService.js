const db = require("../config/db");

function calculateRoundup(amount) {
  return +(Math.ceil(amount / 10) * 10 - amount).toFixed(2);
}

function processWallet(upiAccount, roundupAmount, fundsList) {
  const newWallet = +(upiAccount.wallet_balance + roundupAmount).toFixed(2);

  if (newWallet >= 100) {
    // threshold hit — find best fund
    const preferredFund = fundsList.find(f => f.id === upiAccount.preferred_fund_id)
      || fundsList[0];

    const units = +(100 / preferredFund.nav).toFixed(6);
    const leftover = +(newWallet - 100).toFixed(2);

    return {
      shouldInvest: true,
      newWalletBalance: leftover,
      investedAmount: 100,
      units,
      fund: preferredFund,
    };
  }

  return {
    shouldInvest: false,
    newWalletBalance: newWallet,
  };
}

module.exports = { calculateRoundup, processWallet };
