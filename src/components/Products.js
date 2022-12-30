import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { debounce } from "@mui/material";
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

const Products = () => {
  const [hidden, setHidden] = useState(() => {
    const hidden = true;
    return hidden;
  });
  const [empty, setEmpty] = useState(() => {
    const empty = false;
    return empty;
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    performAPICall();
  }, []);
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

  return (
    <div>
      <Header
        hasHiddenAuthButtons={false}
        children={
          <TextField
            className="search-desktop"
            size="medium"
            onChange={(event) => {
              debounceSearch(event, 500);
            }}
            fullWidth
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
      {/* Search view for mobiles */}
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
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
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
      <ProductCard product={data} />
      <Footer />
    </div>
  );
};

export default Products;
