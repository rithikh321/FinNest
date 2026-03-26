// Makes NAV look dynamic without any external API
// Each fund fluctuates on its own unique sine wave

function getDynamicNAV(baseNAV, fundId) {
  const seed = Date.now() / 10000;
  const fluctuation = Math.sin(seed + fundId * 1.3) * 0.003;
  return +(baseNAV * (1 + fluctuation)).toFixed(2);
}

function getDynamicChange(fundId) {
  const seed = Date.now() / 10000;
  const change = Math.sin(seed + fundId * 1.3) * 0.3;
  return +change.toFixed(2);
}

module.exports = { getDynamicNAV, getDynamicChange };
