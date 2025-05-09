import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Paper,
  CircularProgress,
  Typography,
  Card,
  Divider,
  Chip,
} from "@mui/material";
import { fetchHoldings } from "../../helpers/PortfolioHoldingsHelpers.jsx";
import {
  formatFloat,
  getColorStringByValue,
  getArrowDirection,
} from "../../helpers/Helpers.jsx";

export default function PortfolioHoldings(props) {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchHoldings(page);
      setLoading(false);
      if (response.errorMessage) {
        setError(true);
      } else {
        setHoldings(response.holdings);
        setTotalPages(response.totalPages);
      }
    };
    fetchData();
  }, [page]);

  const handlePageChange = (value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress sx={{ margin: "auto", mt: 10 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Couldn't fetch your portfolio holdings.
      </Alert>
    );
  }

  if (holdings.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        You don't have any holdings.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Card elevation={2} sx={{ mb: 3, p: 2 }}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box p={2} sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              TOTAL VALUE
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              ${formatFloat(props.stats.totalValue)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Box p={2} sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              TOTAL GAIN/LOSS
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                variant="h5"
                fontWeight="bold"
                color={getColorStringByValue(props.stats.totalGainOrLoss)}
                sx={{ mr: 1 }}
              >
                {props.stats.totalGainOrLoss < 0.0 && "-"}$
                {formatFloat(Math.abs(props.stats.totalGainOrLoss))}
              </Typography>
              {getArrowDirection(props.stats.totalGainOrLoss)}
            </Box>
          </Box>
        </Box>
      </Card>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Purchase Price</TableCell>
              <TableCell>Total Cash Value</TableCell>
              <TableCell>Total Gain/Loss</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holdings, idx) => (
              <TableRow key={holdings.id}>
                <TableCell>{10 * page + idx + 1}</TableCell>
                <TableCell>
                  <Chip label={holdings.symbol} color="primary" size="small" />
                </TableCell>
                <TableCell>{holdings.name}</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>
                  ${formatFloat(holdings.currentPrice)}
                </TableCell>
                <TableCell sx={{ fontWeight: "600" }}>
                  {holdings.quantity}
                </TableCell>
                <TableCell sx={{ fontWeight: "600" }}>
                  ${formatFloat(holdings.purchasePrice)}
                </TableCell>
                <TableCell sx={{ fontWeight: "600" }}>
                  ${formatFloat(holdings.quantity * holdings.currentPrice)}
                </TableCell>
                <TableCell>
                  <Typography
                    color={getColorStringByValue(holdings.totalGainOrLoss)}
                    sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
                  >
                    {holdings.totalGainOrLoss}
                    {getArrowDirection(parseFloat(holdings.totalGainOrLoss))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={holdings.type} 
                    color={holdings.type === "BUY" ? "success" : "error"} 
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{holdings.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_event, page) => handlePageChange(page - 1)}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}
