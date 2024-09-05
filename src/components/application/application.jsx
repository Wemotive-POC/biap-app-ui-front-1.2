import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { AddressContextProvider } from "../../context/addressContext";
import { CartContextProvider } from "../../context/cartContext";
import { SearchContextProvider } from "../../context/searchContext";
import PrivateRoutes from "../../privateRoutes";
import Cart from "./cart/cart";
// import Checkout from "./checkout/checkout";
// import Orders from "./orders/orders";
// import ProductList from "./product-list/productList";
// import Home from "../home/home";
// import Profile from "./profile/profile";
// import Support from "./support/support";
import Checkout from "../checkout/checkout";
import Orders from "../orders/orders";
import OrderDetails from "../orders/orderDetails/orderDetails";
// import InitializeOrder from "./initialize-order/initializeOrder";
import MyTickets from "./my-tickets/myTickets";

import AppLayout from "../appLayout";
import BrandRoutes from "../brand/BrandRoutes";
import ProductRoutes from "./product-list/ProductRoutes";
import ComplaintDetail from "./my-tickets/complaintDetail";

export default function Application() {
  return (
    <CartContextProvider>
      <Switch>
        <AddressContextProvider>
          <SearchContextProvider>
            <Route
              path={"/application"}
              exact
              component={() => <Redirect to={"/application/products"} />}
            />
            <PrivateRoutes exact path={"/application/products"}>
              <AppLayout>
                <ProductRoutes />
              </AppLayout>
            </PrivateRoutes>
            {/* <PrivateRoute exact path={"/application/products"}>
              <AppLayout>
                <Products />
              </AppLayout>
            </PrivateRoute>

            <PrivateRoute path={"/application/products/:id"}>
              <AppLayout>
                <ProductDetails />
              </AppLayout>
            </PrivateRoute> */}
            <PrivateRoutes path={"/application/cart"}>
              <AppLayout>
                <Cart />
              </AppLayout>
            </PrivateRoutes>

            <PrivateRoutes path={"/application/brand"}>
              <AppLayout>
                <BrandRoutes />
              </AppLayout>
            </PrivateRoutes>
            <PrivateRoutes exact path={"/application/checkout"}>
              <AppLayout isCheckout={true}>
                <Checkout />
              </AppLayout>
            </PrivateRoutes>
            <PrivateRoutes path={"/application/orders"}>
              <AppLayout>
                <Orders />
              </AppLayout>
            </PrivateRoutes>
            <PrivateRoutes path={"/application/order/:orderId"}>
              <AppLayout>
                <OrderDetails />
              </AppLayout>
            </PrivateRoutes>

            {/*<PrivateRoute path={"/application/orders"}>*/}
            {/*  <Orders />*/}
            {/*</PrivateRoute>*/}
            <PrivateRoutes path={"/application/complaints"}>
              <AppLayout>
                <MyTickets />
              </AppLayout>
            </PrivateRoutes>
            <PrivateRoutes path={"/application/complaint/:issueId"}>
              <AppLayout>
                <ComplaintDetail />
              </AppLayout>
            </PrivateRoutes>
            {/*<PrivateRoute path={"/application/profile"}>*/}
            {/*  <Profile />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/support"}>*/}
            {/*  <Support />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/initialize"}>*/}
            {/*  <InitializeOrder />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/checkout"}>*/}
            {/*  <Checkout />*/}
            {/*</PrivateRoute>*/}
          </SearchContextProvider>
        </AddressContextProvider>
      </Switch>
    </CartContextProvider>
  );
}
