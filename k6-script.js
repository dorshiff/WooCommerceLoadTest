import { sleep, group } from 'k6'
import http from 'k6/http'

// See https://k6.io/docs/using-k6/options
export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    // http_req_duration: ['p(95)<2500'], // 95% requests should be below 2s
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:de:frankfurt': { loadZone: 'amazon:de:frankfurt', percent: 100 },
        // 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
  },
}

export default function main() {
  const numberOfProducts = 20000;                  // Change according to the amount of products you have.
  const baseUrl = 'https://scale-2gb.codix.co/';   // Change you base URL

  let baseProductUrl = baseUrl + 'product/test-product-';
  let categories = [
    baseUrl + 'product-category/animals/',
    baseUrl + 'product-category/cinema/',
    baseUrl + 'product-category/food/',
    baseUrl + 'product-category/humans/',
    baseUrl + 'product-category/landscape/',
    baseUrl + 'product-category/sport/',
  ];

  let categoryUrl = categories[Math.floor(Math.random() * categories.length)];

  let response;

  group(
    "Homepage",
    function () {
      response = http.get(baseUrl);
      sleep(1);
    }
  );

  group(
    "Random Category",
    function () {
      response = http.get(categoryUrl);
      sleep(1);
    }
  )

  group(
    "Visit Product Page",
    function () {
      let randomProduct = Math.floor(Math.random() * (numberOfProducts - 1)) + 1;
      response = http.get(baseProductUrl + randomProduct + '/');
      sleep(1);
    }
  )
}
