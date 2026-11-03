/* All numbers used by the charts. Statista series come from data/statista.json
   (export of 13 Oct 2026); everything else is typed in from the sources listed at the bottom. */
window.DATA = {
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],

  // Statista, retail value incl. taxes, at home + out of home, $bn
  value: {
    Whisky:  [86.32, 76.92, 79.97, 82.41, 85.91, 87.25, 89.35, 91.48, 93.72, 96.18, 98.70, 101.43],
    Brandy:  [56.95, 51.45, 53.81, 55.27, 58.35, 60.40, 62.28, 64.24, 66.27, 68.47, 70.71, 73.07],
    Vodka:   [46.27, 39.70, 42.06, 43.85, 46.89, 47.65, 48.25, 49.01, 49.86, 50.87, 51.93, 53.13],
    Tequila: [13.68, 13.65, 19.96, 25.54, 34.62, 34.99, 37.63, 39.83, 41.90, 43.87, 45.75, 47.57],
    Rum:     [15.64, 13.67, 14.37, 15.08, 15.90, 16.45, 17.04, 17.61, 18.17, 18.78, 19.36, 19.98],
    Gin:     [14.00, 12.41, 13.03, 13.75, 14.84, 14.94, 15.27, 15.61, 15.96, 16.35, 16.74, 17.18],
    Soju:    [6.32, 6.39, 6.13, 6.66, 7.09, 7.39, 7.63, 7.86, 8.09, 8.32, 8.54, 8.76]
  },
  // Statista, bn litres
  volume: {
    Whisky:  [6.45, 6.18, 6.05, 5.80, 5.90, 5.81, 5.78, 5.75, 5.72, 5.69, 5.66, 5.64],
    Brandy:  [3.06, 2.92, 2.86, 2.74, 2.74, 2.73, 2.73, 2.73, 2.73, 2.73, 2.74, 2.75],
    Vodka:   [2.39, 2.25, 2.24, 2.14, 2.10, 2.03, 2.00, 1.98, 1.96, 1.94, 1.93, 1.92],
    Tequila: [0.35, 0.37, 0.52, 0.64, 0.79, 0.76, 0.80, 0.83, 0.85, 0.87, 0.88, 0.90],
    Rum:     [1.00, 0.95, 0.94, 0.91, 0.91, 0.91, 0.91, 0.92, 0.92, 0.92, 0.92, 0.92],
    Gin:     [0.83, 0.80, 0.79, 0.77, 0.78, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77],
    Soju:    [1.18, 1.14, 1.05, 1.06, 1.07, 1.06, 1.06, 1.06, 1.05, 1.05, 1.05, 1.04]
  },
  valueTotal:   [239.2, 214.2, 229.3, 242.6, 263.6, 269.1, 277.4, 285.6, 294.0, 302.8, 311.7, 321.1],
  volumeTotal:  [15.26, 14.61, 14.45, 14.06, 14.29, 14.07, 14.05, 14.04, 14.00, 13.97, 13.95, 13.94],
  litresPerPerson: [2.04, 1.94, 1.90, 1.83, 1.85, 1.81, 1.79, 1.78, 1.76, 1.74, 1.72, 1.71],
  pricePerLitre:   [15.7, 14.7, 15.9, 17.3, 18.4, 19.1, 19.7, 20.3, 21.0, 21.7, 22.3, 23.0],
  allSpiritsValue: [484.1, 452.7, 481.3, 506.9, 531.0, 535.2, 544.6, 554.4, 564.9, 576.5, 588.5, 601.4],
  liqueursOtherValue: [244.9, 238.5, 252.0, 264.3, 267.4, 266.1, 267.1, 268.8, 270.9, 273.7, 276.7, 280.3],
  // share of the seven categories' value sold in bars, restaurants and hotels (%)
  outOfHomeShare: [33.3, 24.3, 24.2, 26.3, 27.3, 27.2, 26.8, 26.5, 26.3, 26.2, 26.0, 25.9],
  // online share of at-home (shop) sales, all spirits (%), Statista "online revenue share"
  online: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
            share: [2.5, 2.9, 3.7, 4.7, 4.6, 5.0, 5.4, 6.1, 6.8, 7.3, 7.9, 8.4, 8.9] },

  // Statista, at-home revenue of all spirits by country, 2025
  countries: [
    ["China", 140.4, 3.3, 0.2], ["United States", 60.3, 6.3, 2.9], ["Japan", 40.8, 0.9, 1.6],
    ["India", 30.1, 1.7, 3.9], ["Mexico", 12.4, 18.7, 5.5], ["Philippines", 10.9, 8.0, 5.7],
    ["Thailand", 10.2, -1.2, 0.5], ["United Kingdom", 8.6, 6.0, 1.8], ["Canada", 8.0, 11.2, 4.7],
    ["Germany", 7.8, 3.9, 1.7], ["France", 7.8, 5.6, 3.0], ["Brazil", 7.0, -2.7, -0.5],
    ["South Korea", 4.5, 2.5, 1.6]
  ],

  // Gallup, % of US adults who say they drink
  gallup: [[1939, 58], [1958, 55], [1978, 71], [2023, 62], [2024, 58], [2025, 54]],

  // IWSR, global price per litre vs inflation, %
  priceVsCpi: { years: ["2022", "2023", "2024", "2025"], price: [-1, 3, 2, 1], cpi: [8, 6, 5, 4] },

  // Author's estimates, share of the $277bn market (see Method)
  shares: [
    ["Diageo", 11.2], ["Pernod Ricard", 7.7], ["Bacardi", 4.3], ["Suntory Global Spirits", 4.0],
    ["Brown-Forman", 2.8], ["Campari Group", 2.5], ["Moët Hennessy", 2.0], ["Rémy Cointreau", 0.8],
    ["Private label", 8.0], ["Others", 56.7]
  ],
  // latest fiscal year: organic growth %, operating margin %
  groups: [
    ["Diageo", -2.0, 28.9], ["Pernod Ricard", -3.9, 25.8], ["Brown-Forman", 0.0, 25.5],
    ["Campari Group", 2.4, 20.9], ["Rémy Cointreau", 0.2, 17.7]
  ],
  // The Spirits Business, Brand Champions 2026, m nine-litre cases, 2025
  brands: [
    ["Jinro", "Soju", 94.5], ["−196", "Suntory canned cocktail", 34.6], ["Royal Stag", "Indian whisky", 32.6],
    ["McDowell's", "Indian whisky", 31.9], ["Fenjiu", "Baijiu", 28.7], ["Chum Churum", "Soju", 28.0],
    ["High Noon", "RTD", 24.0], ["Smirnoff", "Vodka", 23.4], ["Tanduay", "Rum", 23.2],
    ["Officer's Choice", "Indian whisky", 20.7]
  ],
  // Circana, six EU markets, year to Sep 2025, value change %
  privateLabelEU: [["Alcohol, total", -1.4], ["Brands", -1.1], ["Private label", -2.7], ["Spirits", -3.0], ["RTDs", 8.2]],

  // agave price, MXN per kg
  agave: [["2022 peak", 33.5, "32–35"], ["Feb 2024", 5, "5"], ["Feb 2025", 8, "8"]],
  // UK malting barley, £ per tonne at port
  barley: [["Feb 2025", 200], ["Feb 2026", 157]],

  // Attest, US Gen Z (18–27), Feb 2025 vs Feb 2026, %
  genz: { labels: ["Don't drink", "Drink mostly at home", "Drink mostly in bars or clubs", "Drink RTDs"],
          y2025: [17, 42, 45, 31], y2026: [24, 64, 23, 42] },
  // GLP-1 users vs before treatment, %
  glp1: [
    ["UK: days a week with a drink", -29], ["UK: weekly units", -16], ["UK: alcohol spend at home", -22],
    ["UK: spend per visit to a bar or restaurant", -30], ["US: household alcohol spend (vs non-users)", -7],
    ["US: household beer spend (vs non-users)", -13.5]
  ],
  // NielsenIQ, US hemp-THC drinks, 52 weeks to 27 Jun 2026, $m
  thc: [["Liquor stores", 132], ["Convenience stores", 55], ["Food and grocery", 49]],

  // IWSR, change in 2025, %
  premium: [
    ["Premium-and-above RTDs (value)", 21], ["Japanese whisky, travel retail (volume)", 37],
    ["US ultra-premium tequila", 7], ["Scotch, premium tier", 1], ["Premium spirits excl. national spirits", -1],
    ["US super-premium tequila", -6], ["Scotch, value tier", -9], ["Status spirits above $100 (value)", -10],
    ["Cognac, travel retail (volume)", -11], ["Status cognac (value)", -17]
  ],
  // IWSR, volume change 2025–2035, %
  outlook10y: [["Wine", -14], ["Spirits", -2], ["Beer", -1], ["RTDs", 17]],
  // IWSR travel retail value growth 2025 by region, %
  travelRetail: [["Europe", 11], ["Africa & Middle East", 11], ["Americas", 7], ["Asia-Pacific", 2]],

  // baijiu
  baijiuSize: [["NBS producer revenue × 1.6", 134], ["Statista, China at-home spirits", 140], ["CAIA output value × 1.6", 177]],
  baijiuMakers: [["Moutai (2025)", 168.8], ["Wuliangye (2024)", 89.2], ["Shanxi Fenjiu (2024)", 36.0],
                 ["Luzhou Laojiao (2024)", 31.2], ["Yanghe (2024)", 28.9], ["Gujing (2024)", 23.6]],
  baijiuOutput: [["2016", 13.6], ["2024", 4.1]]
};
