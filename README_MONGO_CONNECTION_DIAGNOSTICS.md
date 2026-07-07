# README - MongoDB Connection Diagnostics & Resolutions

## Diagnostic Log
We ran a connection diagnostic on the server backend:
```bash
MongoDB Connection Warning: querySrv ECONNREFUSED _mongodb._tcp.cluster0.ufnijjc.mongodb.net
```

### Analysis
The error `querySrv ECONNREFUSED` indicates that Node.js was unable to perform a DNS SRV record lookup for the MongoDB Atlas cluster address, or the connection query was actively refused/blocked. This is a common network resolution issue typically caused by:
1. **DNS Server Restrictions**: Standard ISP or local router DNS servers often block or fail to resolve MongoDB SRV records (`mongodb+srv://`).
2. **Firewall / Port Blocks**: Corporate firewalls, VPNs, or proxy configurations blocking port `27017` (used by MongoDB).
3. **No Local fallback**: The system does not have a local MongoDB service running, meaning the server cannot fall back to a local database.

---

## Actionable Resolutions

### Option A: Configure Google/Cloudflare Public DNS (Recommended)
Switching your Windows DNS settings to use public resolvers will allow the SRV records to resolve successfully:
1. Open **Settings** -> **Network & Internet** -> **Status**.
2. Click **Properties** for your active connection (Wi-Fi or Ethernet).
3. Under **IP settings**, click **Edit** (IPv4 settings).
4. Change the settings to **Manual** and set:
   - **Preferred DNS**: `8.8.8.8` (Google Public DNS) or `1.1.1.1` (Cloudflare)
   - **Alternate DNS**: `8.8.4.4` or `1.0.0.1`
5. Save the settings and restart your backend server.

### Option B: Turn off Active VPNs / Proxies
If you are running an active VPN or custom network proxy, it may block traffic over port `27017`. Try disabling the VPN and restart the server.

### Option C: Set up a Local MongoDB Instance
To run the project completely offline:
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the local MongoDB service.
3. Modify your [`.env`](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/.env) file to use the local connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/formora_db
   ```
