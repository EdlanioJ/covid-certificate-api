export type CaseApiResponse = {
  updated: number;
  country: string;
  countryInfo: {
    iso2: string;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
};

// {
// 	"updated": 1642151929369,
// 	"country": "Angola",
// 	"countryInfo": {
// 		"_id": 24,
// 		"iso2": "AO",
// 		"iso3": "AGO",
// 		"lat": -12.5,
// 		"long": 18.5,
// 		"flag": "https://disease.sh/assets/img/flags/ao.png"
// 	},
// 	"cases": 92581,
// 	"todayCases": 674,
// 	"deaths": 1847,
// 	"todayDeaths": 5,
// 	"recovered": 82281,
// 	"todayRecovered": 1240,
// 	"active": 8453,
// 	"critical": 14,
// 	"casesPerOneMillion": 2689,
// 	"deathsPerOneMillion": 54,
// 	"tests": 1325094,
// 	"testsPerOneMillion": 38487,
// 	"population": 34429695,
// 	"continent": "Africa",
// 	"oneCasePerPeople": 372,
// 	"oneDeathPerPeople": 18641,
// 	"oneTestPerPeople": 26,
// 	"activePerOneMillion": 245.51,
// 	"recoveredPerOneMillion": 2389.83,
// 	"criticalPerOneMillion": 0.41
// }
