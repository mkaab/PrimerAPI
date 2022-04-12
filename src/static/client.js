window.addEventListener("load", onLoaded);

async function onLoaded() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientTokenResponse = await fetch("/client-token", {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });
  const { clientToken } = await clientTokenResponse.json();

  const primer = new Primer({
    credentials: {
      clientToken, // Your server generated client token
    },
  });

  // Use `.checkout()` to initialize and render the UI
  await primer.checkout({
    // Specify the selector of the container element
    container: "#checkout-container",
    successScreen: false,
    allowedPaymentMethods: window.allowedPaymentMethods, 
    allowedCardNetworks: ['visa', 'mastercard', 'american-express'],
    countryCode: 'SG',
    orderDetails: {
      totalAmount: '100.00', // required if no items are provided
      shippingAmount: '5.00',
      totalTaxAmount: '5.00',
      currencyCode: 'SGD',
      items: [ // required if no totalAmount is specified
        {
          name: 'product-1',
          quantity: 1,
          taxCode: '20010',
          unitAmount: '40.00',
          discountAmount: 0,
        },
        {
          name: 'product-2',
          quantity: 2,
          taxCode: '20010',
          unitAmount: '25.00',
          discountAmount: 0,
        },
      ],
    },
    applePay: {
      container: '#pay-with-apple-button',
      buttonType: 'buy',
      buttonStyle: 'black'
    },

    /**
     * When a payment method is chosen and the customer clicks 'Pay',
     * the payment method is tokenized and you'll receive a token in the
     * `onTokenizeSuccess` callback which you can send to your server
     * to authorize a transaction.
     */
    async onTokenizeSuccess(paymentMethod) {
      const body = {
        ...paymentMethod,
        bagId: urlParams.get('bag_id'),
        session: window.kaddraSession,
        tenantId: window.kaddraTenantid,
      }
      // Send the payment method token to your server
      const authorize = await fetch("/authorize", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const response = await authorize.json();
      console.log('[TEST] response: ', response);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(response));
      }  
    },

    // Other customization options
    transitions: {
      duration: 700,
    },
  });

  const payButton = document.getElementById('primer-checkout-submit-button');
  if (payButton && window.payButtonColor) {
    payButton.style.backgroundColor = window.payButtonColor;
  }
}
