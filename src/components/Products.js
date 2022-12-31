import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { debounce } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [storage, setStorage] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [hidden, setHidden] = useState(() => {
    const hidden = true;
    return hidden;
  });
  const [empty, setEmpty] = useState(() => {
    const empty = false;
    return empty;
  });
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setHidden(false);
    axios
      .get(config.endpoint + "/products")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setHidden(true);
      })
      .catch((error) => setHidden(true));
  };

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    axios
      .get(config.endpoint + "/products/search?value=" + text)
      .then((response) => {
        if (response.data.length === 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
        setData(response.data);
      })
      .catch((error) => {
        //console.log(error);
        setEmpty(true);
        setData([]);
        // enqueueSnackbar(error.data.message, {
        //   variant: "error",
        //   persist: false,
        // });
      });
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   *
   */
  const handleSearchDebounce = React.useRef(
    debounce(async (value) => {
      await performSearch(value);
    }, 500)
  ).current;
  const debounceSearch = async (event, debounceTimeout) => {
    handleSearchDebounce(event.target.value);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    console.log(token);
    if (!token) return;
    try {
      const response = await axios.get(config.endpoint + "/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItem(response.data);
      console.log(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(token, items, products, productId, qty, options);
    if (options === true) {
      if (storage === false) {
        enqueueSnackbar("Login to add an item to the Cart", {
          variant: "warning",
        });
        return;
      }
      if (isItemInCart(items, productId) === true) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
        return;
      }
      axios
        .post(
          config.endpoint + "/cart",
          {
            productId: productId,
            qty: qty,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setCartItem(response.data);
          return response;
        });
    } else {
      axios
        .post(
          config.endpoint + "/cart",
          {
            productId: productId,
            qty: qty,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setCartItem(response.data);
          return response;
        });
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      performAPICall();
      if (data) {
        setStorage(true);
        fetchCart(token);
      }
    };
    onLoadHandler();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header
        hasHiddenAuthButtons={false}
        children={
          <TextField
            className="search-desktop"
            size="medium"
            fullWidth
            onChange={(event) => {
              debounceSearch(event, 500);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
          />
        }
      ></Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid conatiner spacing={2}>
        <Grid item xs={12} md={9}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          {!hidden && (
            <div className="progress">
              <CircularProgress></CircularProgress>
              <p>Loading Products...</p>
            </div>
          )}
          {empty && (
            <div className="progress">
              <SentimentDissatisfied></SentimentDissatisfied>
              <br></br>
              <p>No products found</p>
            </div>
          )}
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {data.map((product) => (
              <Grid item xs={6} md={3} key={product._id}>
                <ProductCard
                  product={product}
                  handleAddToCart={() =>
                    addToCart(
                      localStorage.getItem("token"),
                      cartItem,
                      data,
                      product._id,
                      1,
                      true
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {storage && (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart products={data} items={cartItem} handleQuantity={addToCart} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
