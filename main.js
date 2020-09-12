const app = Vue.createApp({
    data() {
        return {
            premium: true,
            cart: []
        }
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    console.log("Remove: " + this.cart[i]);
                    this.cart.splice(i, 1);
                    console.log(this.cart);
                }
            }
        }
    }
});