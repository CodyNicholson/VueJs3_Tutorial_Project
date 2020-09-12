app.component('product-display', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
     <div class="product-display">
          
      <div class="product-container">
        <div class="product-image">
          <img :src="image" />
        </div>
        <div class="product-info">

          <h1>{{ productName }}</h1>

          <p v-if="inStock">In Stock: {{ amountInStock }}</p>
          <p v-else>Out of Stock</p>

          <p>Shipping: {{ shipping }}</p>

          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
          
          <div class="display-flex">
            <p class="color-text">Colors:</p>
            <div class="color-circle"
                v-for="(variant, index) in variants" 
                :key="variant.id"
                :style="{ backgroundColor: variant.color }"
                @mouseover="updateProduct(index)" 
            />
          </div>

          <div class="display-flex">
            <button class="button" v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >
            Add to cart
            </button>
            <button class="button" v-on:click="removeFromCart" 
                :disabled="!displayRemoveFromCart"
                :class="{ disabledButton: !displayRemoveFromCart }"
                >
            Remove from cart
            </button>
          </div>

        </div>
      </div>
      <review-list :reviews="reviews"></review-list>
      <review-form @review-submitted="addReview" ></review-form>
    </div>`,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{
                    id: 2234,
                    color: 'green',
                    image: './assets/images/socks_green.jpg',
                    quantity: 10,
                    quantityInCart: 0
                },
                {
                    id: 2235,
                    color: 'blue',
                    image: './assets/images/socks_blue.jpg',
                    quantity: 1,
                    quantityInCart: 0
                }
            ],
            reviews: [],
            tabs: ['review-form', 'review-list'],
            activeTab: 'review-form'
        }
    },
    methods: {
        addToCart() {
            if (this.variants[this.selectedVariant].quantity >= this.variants[this.selectedVariant].quantityInCart) {
                this.variants[this.selectedVariant].quantityInCart += 1;
                this.$emit('add-to-cart', this.variants[this.selectedVariant].id);
            }
        },
        removeFromCart() {
            if (this.variants[this.selectedVariant].quantityInCart > 0) {
                this.variants[this.selectedVariant].quantityInCart -= 1;
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].id);
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(review) {
            this.reviews.push(review);
        }
    },
    computed: {
        productName() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].image;
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity > this.variants[this.selectedVariant].quantityInCart;
        },
        amountInStock() {
            return this.variants[this.selectedVariant].quantity - this.variants[this.selectedVariant].quantityInCart;
        },
        displayRemoveFromCart() {
            return this.variants[this.selectedVariant].quantityInCart > 0;
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            }
            return 2.99;
        }
    }
});