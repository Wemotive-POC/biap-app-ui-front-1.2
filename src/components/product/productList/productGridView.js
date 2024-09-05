import React from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import no_image_found from "../../../assets/images/no_image_found.png";
import { useHistory } from "react-router-dom";

const ProductGridView = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { product, productId, price, bpp_id, bpp_provider_descriptor } = props;
  const { descriptor } = product;
  const { name: provider_name } = bpp_provider_descriptor;
  const { name: product_name, symbol } = descriptor;

  return (
    <div
      className={classes.productItemContainer}
      onClick={() =>
        history.push(`/application/products?productId=${productId}`)
      }
    >
      <Card className={classes.productCard}>
        <img
          className={classes.productImage}
          src={symbol ? symbol : no_image_found}
          alt={`sub-cat-img-${bpp_id}`}
        />
        <Tooltip title="Add to cart">
          {/* <IconButton
            onClick={(e) => {
              e.stopPropagation();
              // getProductDetails(productId).then((data) => handleAddToCart(data, true));
            }}
            color="inherit"
            className={classes.cartIcon}
          >
            <CartIcon />
          </IconButton> */}
        </Tooltip>
        {/* <Button
          fullWidth
          className={classes.buyNowButton}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            // getProductDetails(productId).then((data) => handleAddToCart(data, true, true));
          }}
        >
          Buy Now
        </Button> */}
      </Card>
      <Typography
        component="div"
        variant="body"
        className={classes.productNameTypo}
      >
        {product_name}
      </Typography>
      <Typography variant="body1" className={classes.providerTypo}>
        {provider_name}
      </Typography>
      <Box component={"div"} className={classes.divider} />
      <Typography variant="h5" className={classes.priceTypo}>
        {`₹${Number(price?.value).toFixed(2)}`}
      </Typography>
    </div>
  );
};

export default ProductGridView;
