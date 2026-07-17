# Identity Verification (KYC)

Zuup Auth integrates natively with **Meri Pehchaan (DigiLocker)** to perform Indian Government identity verification directly at the edge. 

It handles the redirect flow, extracts verified details, stores them securely in the database, and returns a verified status to your frontend.

## The KYC Flow

To verify a user's real-world identity using DigiLocker:

### 1. Create a KYC Session

From your backend application, request a new KYC session from the auth gateway:

```javascript
const response = await fetch("https://auth.zuup.dev/api/kyc/create-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    redirect_uri: "https://example.com/kyc-success",
    client_name: "Example App"
  })
});

const { session_id } = await response.json();
```

### 2. Open the Verification UI

Open the verification UI in a popup window on your frontend so the user can complete the DigiLocker flow without leaving your application:

```javascript
window.open(
  `https://auth.zuup.dev/kyc?session_id=${session_id}`,
  'Zuup_KYC',
  'width=500,height=750'
);
```

### 3. Data Extraction and Storage

Once the user authenticates with Meri Pehchaan, the Edge Proxy automatically extracts the following verified claims from the Government ID Token:
- Verified Name
- Date of Birth
- Gender
- Address / Care Of
- Masked Aadhaar Number
- PAN Number (if available)

The Edge Proxy securely connects to the database using its internal Service Role Key and upserts this data into the `kyc_verifications` table, attaching it to the user's ID.

### 4. Check KYC Status

You can poll the status endpoint to check if a user is verified:

```http
GET https://auth.zuup.dev/api/kyc/status/:userId
```

> [!NOTE]
> For security reasons, the target `:userId` must match the `userId` in the Authorization JWT making the request. You can only check your own KYC status unless the request is made by an Admin.
