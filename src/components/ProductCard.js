import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
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
    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {product.map((item) => (
        <Grid item xs={6} md={3} key={item._id}>
          <Card className="card">
            <CardActionArea>
              <CardMedia
                style={{ height: "300px" }}
                component="img"
                image={item.image}
              />
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="subtitle1">${item.cost}</Typography>
                <Rating name="read-only" value={item.rating} readOnly />
              </CardContent>
            </CardActionArea>

            <CardActions>
              <Button
                className="card-button"
                variant="contained"
                startIcon={<AddShoppingCartOutlined />}
              >
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductCard;
