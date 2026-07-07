# README - Task 6: Razorpay Payment Flow Freeze Fix

## Completed Changes
We fixed a critical usability bug where the checkout page remained frozen (in a loading/placing state) if a payment failed or was declined.

- **File**: [Checkout.jsx](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/client/src/pages/Checkout.jsx#L268-L277)

### 1. Root Cause
- When the payment checkout wizard initializes, the component sets the `placing` (loading overlay) state to `true` to block double-submissions.
- If a transaction succeeded, the `handler` callback was triggered, which eventually reset the state. If the user dismissed the modal before payment, `modal.ondismiss` reset the state.
- However, if the payment *failed* (e.g. card declined, incorrect OTP, network failure during transaction), Razorpay did not invoke `handler` or `ondismiss`. Instead, it emitted a native `payment.failed` event, leaving the loader overlay active indefinitely and freezing the page.

### 2. Resolution
- Registered the `payment.failed` event handler on the Razorpay client controller before opening the widget:
```javascript
rzp.on('payment.failed', function (response) {
  console.error('Razorpay payment failed:', response.error);
  dispatch(addToast({ 
    message: response.error.description || 'Payment failed. Please try again.', 
    type: 'error' 
  }));
  setPlacing(false); // Reset loading state
});
```
- This releases the page lock instantly, shows an informative warning toast detailing the failure reason, and allows the user to try checking out again without a page refresh.
