
import { STRIPE } from "../config/stripeSettings";


/**
 * Create the Stripe Checkout redirect html code for a given user
 *
 * @returns {String}
 */
export function stripeCheckoutRedirectHTML(order, items, public_key, cardFee) {

    const { customer } = order
    const total = items.reduce(
        (current, index) => current + index.price * index.quantity,
        0
    );

    const products = JSON.stringify(items)
    const data = JSON.stringify(customer)

    if (!order) {

        return;
    }

    return `
  <html>
  <head>
    
    <script src="https://js.stripe.com/v3/"></script>
  </head>
  <body>
  <!-- Load Stripe.js on your website. -->
  
  <div style="padding: 0 auto; position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%);">
    <img src="https://www.clearsmilealigner.com/wp-content/plugins/ias-fad-wp-plugin/img/preloader.gif" alt="loading" />
   
  </div>
  
  
  <script>

      ( function () {
         
          var stripe = Stripe('${public_key}');
         
          window.onload = function () {
           
              fetch('${STRIPE.DB_URL}', {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Allow-Control-Allow-Methods': 'GET, POST',
                      'Access-Control-Allow-Origin': '*'

                  },
                  body: JSON.stringify( {
                     
                      amount: "${order.totalAmount}",
                      items: ${products},
                      email: "${order.customer.email}",
                      phone: "${order.customer.phone}",
                      customer: ${data},
                      cardFee: "${cardFee}"
                  } ),

              } ).then( function ( response ) {
                  
                  return response.json();
              } ).then( function ( responseJson ) {
                  var sessionID = responseJson.session_id;

                  // Call stripe.redirectToCheckout() with the Session ID.
                  stripe.redirectToCheckout( {

                      // Make the id field from the Checkout Session creation API response
                      // available to this file, so you can provide it as argument here
                      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                      sessionId: sessionID
                  } ).then( function ( result ) {
                      console.log( result.error.message )
                      alert(result.error.message);
                    
                  } );
              } );
          };
      } )();
  </script>
</body>
  </html>
  `;
}
