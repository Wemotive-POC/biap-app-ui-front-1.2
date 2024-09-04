import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Brand from "./brand";
import OutletDetails from "./outletDetails/outletDetails";

const BrandRoutes = () => {
  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const [brandId, setBrandId] = useState("");
  const [outletId, setOutletId] = useState("");

  useEffect(() => {
    if (locationData) {
      const brand_Id = query.get("brandId");
      const outlet_Id = query.get("outletId");

      setBrandId(brand_Id);
      setOutletId(outlet_Id);
    }
  }, [locationData]);

  if (outletId && brandId) {
    return <OutletDetails brandId={brandId} outletId={outletId} />;
  } else if (brandId) {
    return <Brand brandId={brandId} />;
  }

  return <div>BrandRoutes</div>;
};

export default BrandRoutes;
