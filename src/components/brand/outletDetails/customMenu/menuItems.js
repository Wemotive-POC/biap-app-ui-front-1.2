import React, { useContext, useEffect, useState } from "react";
import style from "./style";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { ReactComponent as ExpandMoreIcon } from "../../../../assets/images/chevron-down.svg";
import MenuItem from "./menuItem";
import ModalComponent from "../../../common/Modal";
import Loading from "../../../shared/loading/loading";

import useCancellablePromise from "../../../../api/cancelRequest";
import { getCustomMenuItemsRequest } from "../../../../api/brand.api";

import CustomizationRenderer from "../../../application/product-list/product-details/CustomizationRenderer";
import { getValueFromCookie } from "../../../../utils/cookies";
import { getCall, postCall } from "../../../../api/axios";
import {
  areCustomisationsSame,
  formatCustomizationGroups,
  formatCustomizations,
  hasCustomizations,
  initializeCustomizationState,
} from "../../../application/product-list/product-details/utils";
import { CartContext } from "../../../../context/cartContext";
import { ToastContext } from "../../../../context/toastContext";
import { getCartItems } from "../../../application/cart/utils/getCartItems";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { updateCartItem } from "../../../application/cart/utils/updateCartItem";

const MenuItems = (props) => {
  const {
    customMenu,
    updateItemsOfCustomMenuRef,
    firstMenuItemDetails = null,
    isStoreDelivering,
  } = props;
  const classes = style();

  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [customizationModal, setCustomizationModal] = useState(false);
  const [productPayload, setProductPayload] = useState(null);
  const [customization_state, setCustomizationState] = useState({});
  const [productLoading, setProductLoading] = useState(false);
  const [itemQty, setItemQty] = useState(1);
  const { fetchCartItems } = useContext(CartContext);
  const dispatch = useContext(ToastContext);

  const [customizationPrices, setCustomizationPrices] = useState(0);
  const [itemOutOfStock, setItemOutOfStock] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    if (customMenu && customMenu?.id) {
      getCustomMenuItems(customMenu.id);
    }
  }, [customMenu]);

  const getCustomMenuItems = async (menuId) => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getCustomMenuItemsRequest(menuId));
      let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));

      resData = resData.map((item) => {
        const findVegNonVegTag = item.item_details.tags.find(
          (tag) => tag.code === "veg_nonveg"
        );
        if (findVegNonVegTag) {
          item.item_details.isVeg =
            findVegNonVegTag.list[0].value === "yes" ||
            findVegNonVegTag.list[0].value === "Yes";
        }
        return item;
      });
      updateItemsOfCustomMenuRef(menuId, resData);
      setMenuItems(resData);
    } catch (err) {
      return err;
    } finally {
      setIsLoading(false);
    }
  };

  //   const getProductDetails = async (productId) => {
  //     try {
  //       setProductLoading(productId);
  //       const data = await cancellablePromise(getCall(`/clientApis/v2/items/${productId}`));
  //       setProductPayload(data.response);
  //       return data.response;
  //     } catch (error) {
  //       console.error("Error fetching product details:", error);
  //     } finally {
  //       setProductLoading(false);
  //     }
  //   };

  const getProductDetails = async (productId) => {
    try {
      setProductLoading(productId);
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/item-details?id=${productId}`)
      );
      setProductPayload(data);
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setProductLoading(false);
    }
  };

  const calculateSubtotal = (groupId, customization_state_data) => {
    let group = customization_state_data[groupId];
    if (!group) return;

    let prices = group.selected.map((s) => s.price);
    setCustomizationPrices((prevState) => {
      return prevState + prices.reduce((a, b) => a + b, 0);
    });

    group?.childs?.map((child) => {
      calculateSubtotal(child, customization_state_data);
    });
  };

  let selectedCustomizationIds = [];
  const getCustomization_ = (groupId, customization_state_data) => {
    let group = customization_state_data[groupId];
    if (!group) return;

    group.selected.map((s) => selectedCustomizationIds.push(s.id));

    group?.childs?.map((child) => {
      getCustomization_(child, customization_state_data);
    });
  };

  const getCustomizations = async (
    product_payload,
    customization_state_data
  ) => {
    const { customisation_items } = product_payload;
    const customizations = [];

    const firstGroupId = customization_state_data["firstGroup"]?.id;
    if (!firstGroupId) return;

    getCustomization_(firstGroupId, customization_state_data);

    for (const cId of selectedCustomizationIds) {
      let c = customisation_items.find((item) => item.local_id === cId);
      if (c) {
        c = {
          ...c,
          quantity: {
            count: 1,
          },
        };
        customizations.push(c);
      }
    }
    return customizations;
  };

  const addToCart = async (product_payload, isDefault = false) => {
    setProductLoading(product_payload.id);
    const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;
    const hasCustomisations = hasCustomizations(product_payload) ? true : false;

    let groups = [];
    let cus = [];
    let newState = {};
    let customizationState = {};
    let customisations = null;

    if (hasCustomisations) {
      groups = await formatCustomizationGroups(
        product_payload.customisation_groups
      );
      cus = await formatCustomizations(product_payload.customisation_items);
      newState = await initializeCustomizationState(
        groups,
        cus,
        customization_state
      );
      customizationState = isDefault ? newState : customization_state;
      customisations = await getCustomizations(
        product_payload,
        customizationState
      );
    }

    calculateSubtotal(customizationState["firstGroup"]?.id, customizationState);
    const subtotal =
      product_payload?.item_details?.price?.value + customizationPrices;

    const payload = {
      id: product_payload.id,
      local_id: product_payload.local_id,
      bpp_id: product_payload.bpp_details.bpp_id,
      bpp_uri: product_payload.context.bpp_uri,
      domain: product_payload.context.domain,
      tags: product_payload.item_details.tags,
      customisationState: customizationState,
      contextCity: product_payload.context.city,
      quantity: {
        count: itemQty,
      },
      provider: {
        id: product_payload.bpp_details.bpp_id,
        locations: product_payload.locations,
        ...product_payload.provider_details,
      },
      product: {
        id: product_payload.id,
        subtotal,
        ...product_payload.item_details,
      },
      customisations,
      hasCustomisations,
    };

    const cartItems = await getCartItems();

    let cartItem = [];
    cartItem = cartItems.filter((ci) => {
      return ci.item.id === payload.id;
    });

    if (cartItem.length > 0 && customisations && customisations.length > 0) {
      cartItem = cartItems.filter((ci) => {
        console.log(ci.item);
        return ci.item.customisations.length === customisations.length;
      });
    }

    if (cartItem.length === 0) {
      await postCall(url, payload);
      fetchCartItems();
      setCustomizationState({});
      setCustomizationModal(false);
      setProductLoading(false);
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.success,
          message: "Item added to cart successfully.",
        },
      });
    } else {
      const currentCount = parseInt(cartItem[0].item.quantity.count);
      const maxCount = parseInt(
        cartItem[0].item.product.quantity.maximum.count
      );

      if (currentCount < maxCount) {
        if (!customisations) {
          updateCartItem(cartItems, true, cartItem[0]._id);
          dispatch({
            type: toast_actions.ADD_TOAST,
            payload: {
              id: Math.floor(Math.random() * 100),
              type: toast_types.success,
              message: "Item quantity updated in your cart.",
            },
          });
          setCustomizationState({});
          setCustomizationModal(false);
          setProductLoading(false);
        } else {
          const currentIds = customisations.map((item) => item.id);
          let matchingCustomisation = null;

          for (let i = 0; i < cartItem.length; i++) {
            let existingIds = cartItem[i].item.customisations.map(
              (item) => item.id
            );
            const areSame = areCustomisationsSame(existingIds, currentIds);
            if (areSame) {
              matchingCustomisation = cartItem[i];
            }
          }

          if (matchingCustomisation) {
            updateCartItem(cartItems, true, matchingCustomisation._id);
            dispatch({
              type: toast_actions.ADD_TOAST,
              payload: {
                id: Math.floor(Math.random() * 100),
                type: toast_types.success,
                message: "Item quantity updated in your cart.",
              },
            });
            setCustomizationState({});
            setCustomizationModal(false);
            setProductLoading(false);
          } else {
            await postCall(url, payload);
            setCustomizationState({});
            setCustomizationModal(false);
            setProductLoading(false);
            fetchCartItems();
            dispatch({
              type: toast_actions.ADD_TOAST,
              payload: {
                id: Math.floor(Math.random() * 100),
                type: toast_types.success,
                message: "Item added to cart successfully.",
              },
            });
          }
        }
      } else {
        dispatch({
          type: toast_actions.ADD_TOAST,
          payload: {
            id: Math.floor(Math.random() * 100),
            type: toast_types.error,
            message: `The maximum available quantity for item is already in your cart.`,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (customization_state && customization_state["firstGroup"]) {
      setCustomizationPrices(0);
      calculateSubtotal(
        customization_state["firstGroup"]?.id,
        customization_state
      );
    }
  }, [customization_state]);

  if (firstMenuItemDetails) {
    let rangePriceTag = null;
    if (
      productPayload &&
      productPayload?.item_details &&
      productPayload?.item_details?.price &&
      productPayload?.item_details?.price?.tags &&
      productPayload?.item_details?.price?.tags.length > 0
    ) {
      const findRangePriceTag = productPayload?.item_details?.price?.tags.find(
        (item) => item.code === "range"
      );
      if (findRangePriceTag) {
        const findLowerPriceObj = findRangePriceTag.list.find(
          (item) => item.code === "lower"
        );
        const findUpperPriceObj = findRangePriceTag.list.find(
          (item) => item.code === "upper"
        );
        rangePriceTag = {
          maxPrice: findUpperPriceObj.value,
          minPrice: findLowerPriceObj.value,
        };
      }
    }
    return (
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">{`${customMenu?.descriptor?.name} (${
            menuItems?.length || 0
          })`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <>
            {firstMenuItemDetails.length > 0 ? (
              <Grid container spacing={3}>
                {firstMenuItemDetails.map((item, itemInd) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    key={`menu-item-ind-${itemInd}`}
                  >
                    <MenuItem
                      productPayload={item}
                      setProductPayload={setProductPayload}
                      product={item?.item_details}
                      productId={item.id}
                      price={item?.item_details?.price}
                      bpp_provider_descriptor={
                        item?.provider_details?.descriptor
                      }
                      bpp_id={item?.bpp_details?.bpp_id}
                      location_id={
                        item?.location_details ? item.location_details?.id : ""
                      }
                      bpp_provider_id={item?.provider_details?.id}
                      handleAddToCart={addToCart}
                      setCustomizationModal={setCustomizationModal}
                      getProductDetails={getProductDetails}
                      productLoading={productLoading}
                      isStoreDelivering={isStoreDelivering}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">
                There is not items available in this menu
              </Typography>
            )}
          </>

          <ModalComponent
            open={customizationModal}
            onClose={() => {
              setCustomizationModal(false);
              setCustomizationState({});
              fetchCartItems();
            }}
            title="Customize"
          >
            {productLoading ? (
              <Loading />
            ) : (
              <>
                <Typography variant="body" color="black" component="div">
                  {productPayload?.item_details?.descriptor?.name}
                  <span style={{ float: "right" }}>
                    {rangePriceTag
                      ? `₹${rangePriceTag?.minPrice} - ₹${rangePriceTag?.maxPrice}`
                      : `₹${
                          productPayload?.item_details?.price
                            ? Number(
                                productPayload?.item_details?.price?.value
                              ).toFixed(2)
                            : "0"
                        }`}
                  </span>
                </Typography>
                <CustomizationRenderer
                  productPayload={productPayload}
                  customization_state={customization_state}
                  setCustomizationState={setCustomizationState}
                  setItemOutOfStock={setItemOutOfStock}
                />

                <Grid container sx={{ marginTop: 4 }}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                    xs={3}
                    className={classes.qty}
                  >
                    <RemoveIcon
                      fontSize="small"
                      className={classes.qtyIcon}
                      onClick={() => {
                        if (itemQty > 1) setItemQty(itemQty - 1);
                      }}
                    />
                    <Typography variant="body1" color="#196AAB">
                      {itemQty}
                    </Typography>
                    <AddIcon
                      fontSize="small"
                      className={classes.qtyIcon}
                      onClick={() => setItemQty(itemQty + 1)}
                    />
                  </Grid>
                  <Button
                    disabled={itemOutOfStock}
                    variant="contained"
                    sx={{ flex: 1 }}
                    onClick={() => addToCart(productPayload)}
                  >
                    Add Item Total- ₹
                    {(productPayload?.item_details?.price.value +
                      customizationPrices) *
                      itemQty}{" "}
                  </Button>
                </Grid>
              </>
            )}
          </ModalComponent>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h5">{`${customMenu?.descriptor?.name} (${
          menuItems?.length || 0
        })`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading ? (
          <div className={classes.loader}>
            <Loading />
          </div>
        ) : (
          <>
            {menuItems.length > 0 ? (
              <Grid container spacing={3}>
                {menuItems.map((item, itemInd) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      key={`menu-item-ind-${itemInd}`}
                    >
                      <MenuItem
                        productPayload={item}
                        setProductPayload={setProductPayload}
                        product={item?.item_details}
                        productId={item.id}
                        price={item?.item_details?.price}
                        bpp_provider_descriptor={
                          item?.provider_details?.descriptor
                        }
                        bpp_id={item?.bpp_details?.bpp_id}
                        location_id={
                          item?.location_details
                            ? item.location_details?.id
                            : ""
                        }
                        bpp_provider_id={item?.provider_details?.id}
                        handleAddToCart={addToCart}
                        setCustomizationModal={setCustomizationModal}
                        getProductDetails={getProductDetails}
                        productLoading={productLoading}
                        isStoreDelivering={isStoreDelivering}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body1">
                There is not items available in this menu
              </Typography>
            )}
          </>
        )}

        <ModalComponent
          open={customizationModal}
          onClose={() => {
            setCustomizationModal(false);
            setCustomizationState({});
            fetchCartItems();
          }}
          title="Customize"
        >
          {productLoading ? (
            <Loading />
          ) : (
            <>
              <Typography variant="body" color="black" component="div">
                {productPayload?.item_details?.descriptor?.name}
                <span style={{ float: "right" }}>
                  {`₹${
                    productPayload?.item_details?.price
                      ? Number(
                          productPayload?.item_details?.price?.value
                        ).toFixed(2)
                      : "0"
                  }`}
                </span>
              </Typography>

              <CustomizationRenderer
                productPayload={productPayload}
                customization_state={customization_state}
                setCustomizationState={setCustomizationState}
                setItemOutOfStock={setItemOutOfStock}
              />

              <Grid container sx={{ marginTop: 4 }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-around"
                  xs={3}
                  className={classes.qty}
                >
                  <RemoveIcon
                    fontSize="small"
                    className={classes.qtyIcon}
                    onClick={() => {
                      if (itemQty > 1) setItemQty(itemQty - 1);
                    }}
                  />
                  <Typography variant="body1" color="#196AAB">
                    {itemQty}
                  </Typography>
                  <AddIcon
                    fontSize="small"
                    className={classes.qtyIcon}
                    onClick={() => setItemQty(itemQty + 1)}
                  />
                </Grid>
                <Button
                  disabled={itemOutOfStock}
                  variant="contained"
                  sx={{ flex: 1 }}
                  onClick={() => addToCart(productPayload)}
                >
                  Add Item Total- ₹
                  {(productPayload?.item_details?.price.value +
                    customizationPrices) *
                    itemQty}{" "}
                </Button>
              </Grid>
            </>
          )}
        </ModalComponent>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuItems;
