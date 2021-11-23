const JSON_HEADERS = {
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const tokenSupply = await getTokenSupply()

  const responseData = {
    tokenSupply,
    tokenSupplyFormatted: tokenSupply / 1e18,
    decimals: 18,
  }
  return new Response(JSON.stringify(responseData), JSON_HEADERS)
}

async function getTokenSupply() {
  const tokenSupplyRequestUrl = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${CONTRACT_ADDRESS}&apikey=${API_KEY}`
  const response = await fetch(tokenSupplyRequestUrl)
  const data = await response.json()
  return data.result
}
