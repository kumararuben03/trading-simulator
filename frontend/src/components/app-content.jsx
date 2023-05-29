import React from "react";
import NewsPage from "./news-page";
import TradePage from "./trade/trade-page";
import TransactionsPage from "./transactions-page";

export const AppContent = React.memo((props) => {
  switch (props.selectedPage) {
    case "News":
      return <NewsPage />;
    case "Trade":
      return <TradePage />;
    case "Transactions":
      return <TransactionsPage />;
    default:
      return <div>{props.selectedPage}</div>;
  }
});
