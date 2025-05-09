import React, { useState, useEffect } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import PortfolioOverview from "../portfolio/PortfolioOverview";
import PerformanceChart from "../portfolio/PerformanceChart";
import BestWorstStocks from "./BestWorstStocks";
import RecentTransactions from "./RecentTransactions";
import RecommendedStock from "./RecommendedStock";
import { BASE_API_URL, ENDPOINTS } from '../../data/constants';

export default function Dashboard() {
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0.0,
    totalGainOrLoss: 0.0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `${BASE_API_URL}${ENDPOINTS.PORTFOLIO_STATS}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setPortfolioStats({
            totalValue: data.totalValue,
            totalGainOrLoss: data.totalGainOrLoss,
          });
        } else {
          alert(data.errorMessage);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="500" color="primary" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={5} container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <PortfolioOverview info="basic" stats={portfolioStats} />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <BestWorstStocks />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          <PerformanceChart />
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <RecommendedStock />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentTransactions />
        </Grid>
      </Grid>
    </Container>
  );
}
