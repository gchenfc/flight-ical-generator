const AmadeusAPI = (() => {
  const AMADEUS_PROXY_URL = 'https://amadeus-proxy.amadeus-proxy.workers.dev/token';

  let accessToken = null;
  let tokenExpiresAt = 0;
  async function authenticate() {
    const res = await fetch(AMADEUS_PROXY_URL);
    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return accessToken;
  }

  async function getFlightSchedule({ carrierCode, flightNumber, date }) {
    const token = await authenticate();

    const url = new URL('https://test.api.amadeus.com/v2/schedule/flights');
    url.searchParams.set('carrierCode', carrierCode);
    url.searchParams.set('flightNumber', flightNumber);
    url.searchParams.set('scheduledDepartureDate', date);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error: ${res.status} ${errText}`);
    }

    return await res.json();
  }

  return {
    getFlightSchedule
  };
})();