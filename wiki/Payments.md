# Payment Abstraction

Handling payments securely on the client side is inherently dangerous. Exposing payment secrets or relying on client-side state for order fulfillment can lead to massive fraud.

Zuup Auth acts as a unified Razorpay gateway, abstracting the complexity of signature validation, order creation, and webhooks away from your individual client applications.

## How it Works

1. **Create Checkout Session:** Client apps request a checkout session from the Edge Proxy.
2. **Order Generation:** The Edge Proxy securely communicates with Razorpay APIs to generate the order.
3. **Checkout UI:** The frontend opens the Edge Proxy's hosted payment UI.
4. **Signature Verification:** Upon payment completion, Razorpay redirects back to the Edge Proxy, which cryptographically verifies the payment signature using the Razorpay Secret Key (which never leaves the edge).
5. **Webhook Fulfillment:** The Edge Proxy fires a secure webhook or RPC call directly to the database to mark the order as paid, ensuring zero client-side tampering.

## Integration Flow

### 1. Initialize Payment

Create a payment session from your backend by passing the order details and the exact database RPC webhook that should be fired upon successful payment:

```javascript
const response = await fetch("https://auth.zuup.dev/api/payments/create-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": process.env.GATEWAY_SECRET
  },
  body: JSON.stringify({
    amount: 1500,
    currency: "INR",
    site_name: "Example App",
    webhook_path: "/rest/v1/rpc/mark_ticket_paid",
    webhook_body: { user_id: "123", ticket_id: "VIP_999" }
  })
});

const { sessionUrl, sessionId } = await response.json();
```

### 2. Complete Payment

Open the returned `sessionUrl` in a popup or iframe on the frontend. 

While the popup is open, your frontend can optionally poll the session status to know exactly when to close the popup and show a success screen:

```http
GET https://auth.zuup.dev/api/payments/session/:sessionId
```

Once the status changes to `paid`, the Edge Proxy has already securely executed your `webhook_path` against the database.
