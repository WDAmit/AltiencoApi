const { DVS } = require('@dtone/dvs');

const dvs1 = new DVS({
  apiKey: '6d156f2b-7e3d-474e-9a52-5a61409418fc',
  apiSecret: 'c80206ab-a1a3-470a-a4e1-52eb96d7ddc4',
  baseUrl: 'https://preprod-dvs-api.dtone.com/v1/'
});

async function countries() {
  const params = { page: 1, perPage: 10 }
  return await dvs1.discovery.countries.get({ params });
}

async function operators() {
  const params = { page: 1, per_page: 10 }
  return await dvs1.discovery.operators.get({ params });
}

async function services() {
  const params = { page: 1, perPage: 1 }
  return await dvs1.discovery.services.get({ params });
}

async function products(params) {
  //const params = { type: 'FIXED_VALUE_RECHARGE', service_id: 1, country_iso_code: 'IND', operator_id: 368, benefit_types: 'TALKTIME', page: 1, per_page: 10 }
  return await dvs1.discovery.products.get({ params });
}

module.exports = {
  countries: countries,
  services: services,
  products: products,
  operators: operators
}