import React, { useContext, useRef, useState, useEffect } from "react";
import CrossIcon from "../../shared/svg/cross-icon";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import { ToastContext } from "../../../context/toastContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import axios from "axios";

import { makeStyles } from "@mui/styles";

const style = makeStyles({
  card: {
    padding: "10px 26px !Important",
    // borderRadius: "16px !important",
    marginTop: "15px",
    border: "1.5px solid #e1e1e1 !important",
    boxShadow: "none !important",
  },
  cardLabel: {
    flex: 1,
    fontSize: "15px !important",
    fontWeight: "600 !important",
  },
  orderId: {
    flex: 1,
    fontSize: "20px !important",
    fontWeight: "600 !important",
    color: "gray",
  },
  sellerName: {
    flex: 1,
    fontSize: "18px !important",
    fontWeight: "600 !important",
  },
  itemName: {
    flex: 1,
    fontSize: "16px !important",
    fontWeight: "500 !important",
  },
  agentName: {
    flex: 1,
    fontSize: "17px !important",
    fontWeight: "600 !important",
  },
  centerItem: {
    display: "flex",
    alignItems: "center",
  },
});

export default function RatingsModal({
  order_id,
  productList = [],
  onClose,
  quantity,
  provider,
  fulfillments,
}) {
  console.log("partailsReturnProductList", productList);
  const modalStyles = style();

  // STATES
  const [ratings, setRatings] = useState({
    order: { rating: "" },
    provider: { rating: "" },
    items: {},
    agents: {},
    fulfillments,
  });
  // format will be following
  // {
  //   order: {id: "", rating: ""},
  //   provider: {id: "", rating: ""}
  //   items: {id1: value, id2: value}
  //   agents: {id1: value, id2: value}
  //   fulfillments: {id1: value, id2: value}
  // }

  // const [inlineError, setInlineError] = useState({
  //   selected_id_error: "",
  //   reason_error: "",
  // });
  const [loading, setLoading] = useState(false);
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [orderQty, setOrderQty] = useState([]);
  // const [reasons, setReasons] = useState([]);

  // REFS
  const eventTimeOutRef = useRef([]);

  // CONTEXT
  const dispatch = useContext(ToastContext);

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

  // useEffect(() => {
  //   if (selectedIds.length > 0) {
  //     const findNonReturnableItem = selectedIds.find(
  //       (p) => !p?.["@ondc/org/returnable"]
  //     );
  //     if (findNonReturnableItem) {
  //       const data = RETURN_REASONS.filter(
  //         (r) => r.isApplicableForNonReturnable
  //       );
  //       setReasons(data);
  //     } else {
  //       setReasons(RETURN_REASONS);
  //     }
  //   }
  // }, [selectedIds]);

  useEffect(() => {
    if (quantity) {
      setOrderQty(JSON.parse(JSON.stringify(Object.assign(quantity))));
    }
  }, [quantity]);

  const getFulfillmentsToProducts = () => {
    let fulfillments_to_products = {};
    let fIdToDetails = {};
    fulfillments?.forEach((fulfillment) => {
      fIdToDetails[fulfillment.id] = fulfillment;
    });
    productList?.forEach((product) => {
      const f_id = product.fulfillment_id;
      fulfillments_to_products[f_id] = fulfillments_to_products[f_id]
        ? fulfillments_to_products[f_id]
        : [];
      fulfillments_to_products[f_id].push(product);
    });
    console.log({
      fulfillmentIdToDetails: fIdToDetails,
      fulfillmentIdToProducts: fulfillments_to_products,
    });
    return {
      fulfillmentIdToDetails: fIdToDetails,
      fulfillmentIdToProducts: fulfillments_to_products,
    };
  };

  const renderOverAllOrderReview = () => {
    return (
      <Card className={modalStyles.card}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="order"
            id="order"
          >
            <Typography variant="body" className={modalStyles.cardLabel}>
              Rate Your Overall Order
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider
              sx={{
                borderColor: "#616161",
                margin: "5px 0 20px 0 ",
                width: "98.5%",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography variant="body" className={modalStyles.orderId}>
                  {order_id}
                </Typography>
              </div>
              <div>
                <Rating
                  name="simple-controlled"
                  value={ratings.order.rating}
                  onChange={(event, newValue) => {
                    setRatings((oldRatings) => {
                      return {
                        ...oldRatings,
                        order: { id: order_id, rating: newValue },
                      };
                    });
                  }}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  };

  const renderSellerReview = () => {
    return (
      <Card className={modalStyles.card}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="order"
            id="order"
          >
            <Typography variant="body" className={modalStyles.cardLabel}>
              Rate Your Seller
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider
              sx={{
                borderColor: "#616161",
                margin: "5px 0",
                width: "98.5%",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: 50, height: 50 }}>
                    <img
                      src={provider?.descriptor?.symbol}
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className={`ml-2 ${modalStyles.centerItem}`}>
                    <Typography
                      variant="body"
                      className={modalStyles.sellerName}
                    >
                      {provider?.descriptor?.name}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={modalStyles.centerItem}>
                <Rating
                  name="simple-controlled"
                  value={ratings.provider.rating}
                  onChange={(event, newValue) => {
                    setRatings((oldRatings) => {
                      return {
                        ...oldRatings,
                        provider: { id: provider.id, rating: newValue },
                      };
                    });
                  }}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  };

  const renderItemReviews = () => {
    const { fulfillmentIdToDetails, fulfillmentIdToProducts } =
      getFulfillmentsToProducts();

    return Object.keys(fulfillmentIdToProducts).map((fulfillment_id) => {
      const agent_id = fulfillmentIdToDetails[fulfillment_id]?.agent.id;
      return (
        <Card className={modalStyles.card}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="order"
              id="order"
            >
              <Typography variant="body" className={modalStyles.cardLabel}>
                Rate Your Items
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider
                sx={{
                  borderColor: "#616161",
                  margin: "5px 0",
                  width: "98.5%",
                }}
              />
              {fulfillmentIdToProducts[fulfillment_id]?.map((product, idx) => {
                return (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: 50, height: 50 }}>
                          <img
                            src={product?.descriptor?.symbol}
                            alt=""
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className={`ml-2 ${modalStyles.centerItem}`}>
                          <Typography
                            variant="body"
                            className={modalStyles.itemName}
                          >
                            {product?.descriptor?.name}
                          </Typography>
                        </div>
                      </div>

                      <div className={modalStyles.centerItem}>
                        <Rating
                          name="simple-controlled"
                          value={ratings.items[product.id] || 0}
                          onChange={(event, newValue) => {
                            setRatings((oldRatings) => {
                              let item_ratings = oldRatings.items;
                              item_ratings[product.id] = newValue;
                              return {
                                ...oldRatings,
                                items: item_ratings,
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <Divider
                      sx={{
                        borderColor: "#616161",
                        margin: "15px 0",
                        width: "98.5%",
                      }}
                    />
                  </div>
                );
              })}
              <Typography variant="body" className={modalStyles.cardLabel}>
                Rate Your Delivery Agent
              </Typography>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                className="mt-3"
              >
                <div className={`${modalStyles.centerItem}`}>
                  <Typography variant="body" className={modalStyles.agentName}>
                    {fulfillmentIdToDetails[fulfillment_id]?.agent.name}
                  </Typography>
                </div>
                <div className={`${modalStyles.centerItem}`}>
                  <Rating
                    name="simple-controlled"
                    value={ratings.agents[agent_id]}
                    onChange={(event, newValue) => {
                      setRatings((oldRatings) => {
                        let agent_ratings = oldRatings.agents;
                        agent_ratings[agent_id] = newValue;
                        return {
                          ...oldRatings,
                          agents: agent_ratings,
                        };
                      });
                    }}
                  />
                </div>
              </div>
              <Divider
                sx={{
                  borderColor: "#616161",
                  margin: "15px 0",
                  width: "98.5%",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="body" className={modalStyles.cardLabel}>
                    Rate Your Delivery Experience
                  </Typography>
                </div>
                <div>
                  <Rating
                    name="simple-controlled"
                    value={ratings.fulfillments[fulfillment_id]}
                    onChange={(event, newValue) => {
                      setRatings((oldRatings) => {
                        let fulfilment_ratings = oldRatings.fulfillments;
                        fulfilment_ratings[fulfillment_id] = newValue;
                        return {
                          ...oldRatings,
                          fulfillments: fulfilment_ratings,
                        };
                      });
                    }}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </Card>
      );
    });
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.popup_card}
        style={{ width: "700px", height: "80%" }}
      >
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <Typography variant="h4">Rate Your Order</Typography>
          <div className="ms-auto">
            <CrossIcon
              width="20"
              height="20"
              color={"#151515"}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </div>
        <div className={styles.card_body} style={{ height: "80%" }}>
          <div style={{ maxHeight: "100%", overflow: "auto" }}>
            {renderOverAllOrderReview()}
            {renderSellerReview()}
            {renderItemReviews()}
          </div>
        </div>
        <div className={`${styles.card_footer} d-flex align-items-center`}>
          <Button
            sx={{ paddingLeft: 4, paddingRight: 4, width: "100%" }}
            isloading={loading ? 1 : 0}
            disabled={loading}
            variant="contained"
            onClick={() => {}}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
