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
  const { searchParams } = new URL(request.url)
  let type = searchParams.get('type')
  let infoType = searchParams.get('request')
  const tokenSupply = await getTokenSupply()
  const tokenSupplyFormatted = tokenSupply / 1e18

  if (type && type === 'cmc') {
    if (infoType && infoType === 'circulating') {
      const foundationBalance = await getAccountBalance(FOUNDATION_ADDRESS)
      const advisorReserveBalance = await getAccountBalance(
        ADVISOR_RESERVE_ADDRESS,
      )
      const vestingBalance = await getAccountBalance(VESTING_ADDRESS)
      const ecosystemBalance = await getAccountBalance(ECOSYSTEM_ADDRESS)

      const circulatingSupply =
        tokenSupplyFormatted -
        foundationBalance / 1e18 -
        advisorReserveBalance / 1e18 -
        vestingBalance / 1e18 -
        ecosystemBalance / 1e18

      return new Response(circulatingSupply)
    }

    return new Response(tokenSupplyFormatted)
  }

  const responseData = {
    tokenSupply,
    tokenSupplyFormatted,
    decimals: 18,
  }
  return new Response(JSON.stringify(responseData), JSON_HEADERS)
}

async function getTokenSupply() {
  const tokenSupplyRequestUrl = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_TOKEN}`
  const response = await fetch(tokenSupplyRequestUrl)
  const data = await response.json()
  return data.result
}

async function getAccountBalance(account) {
  const tokenAccountRequestUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${CONTRACT_ADDRESS}&address=${account}&tag=latest&apikey=${ETHERSCAN_API_TOKEN}`
  const response = await fetch(tokenAccountRequestUrl)
  const data = await response.json()
  return data.result
}
