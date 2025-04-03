import React, { Suspense } from "react";
import CheckOutPageView from "./_component/check-out-page-view";

const CheckOutPage = () => {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckOutPageView />
    </Suspense>
  );
};

export default CheckOutPage;
