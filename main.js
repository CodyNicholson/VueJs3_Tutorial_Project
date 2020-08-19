var eventBus = new Vue()



Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
            <div>
              <span class="tab" 
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = index"
              >{{ tab }}</span>
            </div>
            
            <div v-show="selectedTab === 'Review'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                      <p>{{ review.name }}</p>
                      <p>Rating:{{ review.rating }}</p>
                      <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            
            <div v-show="selectedTab === 'Make a Review'">
              <product-review />        
            </div>
        
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>

      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      </p>
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                this.errors = [];
                let productReview = {
                        name: this.name,
                        review: this.review,
                        rating: this.rating,
                        recommend: this.recommend
                    }
                    //this.$emit('review-submitted', productReview);
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                this.errors = [];
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommend) this.errors.push("Recommendation required.");
            }
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
});


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        
      <div class="product-image">
        <img :src="image" />
      </div>

      <div class="product-info">
          <h1>{{ product }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shipping: {{ shipping }}</p>

          <product-details :details="details"></product-details>

          <div class="color-box"
               v-for="(variant, index) in variants" 
               :key="variant.variantId"
               :style="{ backgroundColor: variant.variantColor }"
               @mouseover="updateProduct(index)"
               >
          </div>

          <p>Sizes:</p>
          <div v-for="size in sizes" :key="size.id">
              <p>{{ size.name }}</p>
          </div>

          <button v-on:click="addToCart" 
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
            >
          Add to cart
          </button>

          <button @click="removeFromCart" 
              >
            Remove from cart
            </button>

       </div>

       <product-tabs :reviews="reviews" />
       
       <a :href="link" target="_blank">Link to tutorial</a>
    
    </div>`,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: "These are socks",
            selectedVariant: 0,
            link: "https://www.vuemastery.com/courses/intro-to-vue-js",
            inventory: 1,
            onSale: true,
            details: ["80% Cotton", "20% Polyester", "Gender-neutral"],
            variants: [
                { variantId: 2234, variantColor: "green", variantImage: "./assets/vmSocks-green-onWhite.jpg", variantQuantity: 2 },
                { variantId: 2235, variantColor: "blue", variantImage: "./assets/vmSocks-blue-onWhite.jpg", variantQuantity: 3 }
            ],
            sizes: [
                { id: 0, name: "S" },
                { id: 1, name: "M" },
                { id: 2, name: "L" },
                { id: 3, name: "XL" },
                { id: 4, name: "XXL" }
            ],
            classObject: {
                active: true,
                'text-danger': true
            },
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return "$9.99"
            }
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for (var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    console.log(this.cart);
                    break;
                }
            }
        }
    }
});