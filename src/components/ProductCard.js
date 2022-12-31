import { AddShoppingCartOutlined } from "@mui/icons-material";
import { CardActionArea } from "@mui/material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          style={{ height: "300px" }}
          component="img"
          image={product.image}
        />
        <CardContent>
          <Typography variant="h5">{product.name}</Typography>
          <Typography variant="subtitle1">${product.cost}</Typography>
          <Rating name="read-only" value={product.rating} readOnly />
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button
          className="card-button"
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
          data-testid="add to cart"
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
