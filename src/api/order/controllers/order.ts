

/**
 * order controller
 */
const stripe = require("stripe")(process.env.STRIPE_KEY);
import { factories } from '@strapi/strapi'


/* export default factories.createCoreController('api::order.order'); */

export default factories.createCoreController('api::order.order', ({strapi}) =>({
    async create(ctx) {

        const {products} = ctx.request.body;
        console.log(products)

        try {
            const lineItems = await Promise.all(
                products.map(async (product) => {

                    const results = await strapi.service("api::product.product").find({
                        filters: { documentId: product.documentId }
                    });


                   if (!results || !results.results || results.results.length === 0) {
                        throw new Error(`Producto con DocumentID ${product.documentId} no fue encontrado.`);
                    }

                    const item = results.results[0];

                    return {
                        price_data:{
                            currency: "eur",
                            product_data:{
                                name:item.product_name
                            },
                            unit_amount: Math.round(item.price * 100)
                        },
                        quantity: product.quantity || 1
                    }
                })
            );

            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: {allowed_countries: ["ES"]},
                payment_method_types: ["card"],
                mode: "payment",
                success_url: process.env.CLIENT_URL + "/success",
                cancel_url: process.env.CLIENT_URL  + "/successError",
                line_items: lineItems
            });

            await strapi.service("api::order.order").create({data:{products, stripeId: session.id}});

            return { stripeSession: session};

        } catch (error) {
           // 💡 MEJORA CRUCIAL DEL CATCH
            console.error("--- ERROR EN EL CONTROLADOR DE ÓRDENES ---");
            // 4. Muestra el error COMPLETO en la terminal de Strapi
            console.error(error); 
            console.error("--------------------------------------------");
            
            ctx.response.status = 500;
            // 5. Devuelve un JSON válido al frontend con el mensaje de error
            return { error: error.message };
        }
    }
}))