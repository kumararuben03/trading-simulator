import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Chip,
  useTheme,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatFloat } from "../../helpers/Helpers";
import { BASE_API_URL, ENDPOINTS } from '../../data/constants';

export default function RecommendedStock() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchRecommendedStock = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `${BASE_API_URL}${ENDPOINTS.STOCK_RECOMMENDATION}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        const data = await response.json();
        if (response.ok) {
          setStock(data);
        } else {
          console.log(data);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchRecommendedStock();
  }, []);

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        title="Recommended Stock" 
        sx={{ 
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          pb: 1
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
            <CircularProgress size={40} />
          </Box>
        )}
        
        {!loading && stock === null && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
            <Typography fontStyle="italic" color="text.secondary">
              Failed to fetch recommended stock.
            </Typography>
          </Box>
        )}
        
        {!loading && stock !== null && (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" mb={2}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.light,
                  width: 60,
                  height: 60,
                  mr: 2
                }}
              >
                {stock.symbol.charAt(0)}
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography variant="h5" fontWeight="bold" mr={1}>
                    {stock.symbol}
                  </Typography>
                  <Chip 
                    label={stock.exchange} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {stock.name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${formatFloat(stock.currentPrice)}
                  </Typography>
                  <TrendingUpIcon 
                    sx={{ ml: 1, color: theme.palette.success.main }} 
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" size="large">
                Trade Now
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
