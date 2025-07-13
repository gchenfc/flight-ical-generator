# ✈️ Flight iCalendar Generator

Create an `.ics` calendar file for any commercial flight!  
Auto-fetches live flight data from Amadeus and builds a downloadable event file you can import into Google Calendar, Outlook, Apple Calendar, and more.

[🔗 Try it now on GitHub Pages!](https://gchenfc.github.io/flight-ical-generator/)

---

## 🌟 Features

- 🔍 Lookup flights by flight number and date
- 🗓️ Generates `.ics` files with:
  - Departure & arrival times
  - Aircraft info
  - Confirmation number
  - Additional notes
  - FlightAware tracking link ✈️
- ⏱️ Correctly handles **time zones** and displays **local times** at each airport
- 📥 One-click `.ics` file download
- 📧 Optional: share via email
- ⚡ Powered by a secure Cloudflare Worker proxy

---

## 🧠 How It Works

- Frontend is built in **vanilla JS + HTML**
- Uses [Amadeus Self-Service API](https://developers.amadeus.com/) for real-time flight schedule data
- Secure proxy on [Cloudflare Workers](https://workers.cloudflare.com/) stores API credentials
- Generates [RFC 5545–compliant](https://datatracker.ietf.org/doc/html/rfc5545) `.ics` files on the fly

---

## 🚀 Setup (Dev)

1. **Clone the repo**
   ```bash
   git clone https://github.com/gchenfc/flight-ical-generator.git
   cd flight-ical-generator
   ```

2.	**Set up a local dev API key**  
  Create a flight-api.js file (or use the proxy version) and add:  
    
    ```
    const clientId = 'your_key';
    const clientSecret = 'your_secret';
    ```


3.	**Launch locally**  
  Open index.html in your browser and test away.

⸻

🌍 Deploying with GitHub Pages
  1.  Push your project to GitHub
  2.  Go to Settings → Pages
  3.  Set source to main branch, root (/)
  4.  Access your app at:
https://gchenfc.github.io/flight-ical-generator/

⸻

🛡️ API Security (Important!)

🔒 API credentials are never exposed in the frontend.

✅ All API calls are routed through a Cloudflare Worker, which:
  *	Stores the client_id and client_secret securely via wrangler secret put
  *	Authenticates with Amadeus and returns a valid access_token
  *	Allows CORS access for your frontend

See /amadeus-proxy if you’re using a separate repo for the worker.

⸻

🧪 Example Output

```plaintext
SUMMARY:Flight BF714: ORY to SFO
LOCATION:ORY to SFO
DESCRIPTION:Flight: BF714
From: ORY at 2025-07-19T11:30 (Sat Jul 19 2025 11:30 local time)
To: SFO at 2025-07-19T13:50 (Sat Jul 19 2025 13:50 local time)
Operated by: TX
Aircraft Type: A359
Duration: PT11H20M
Confirmation Number: ABC123
Additional Info: Window seat, vegetarian meal
FlightAware: https://flightaware.com/live/flight/FBU714
```

⸻

💡 Ideas for Future Features
  *  📲 Add calendar sync via Google API
  *  ✈️ Multi-leg flight support
  *  📍 Interactive map of the route
  *  🛬 Airport terminal/gate integration

⸻

🤝 Acknowledgments
  *  Amadeus Self-Service API
  *  FlightAware
  *  Cloudflare Workers
  *  And you ✨ for checking it out!

⸻

🪧 License

MIT License – do whatever you want.
Just don’t store your secret keys in public repos 🙃

⸻
