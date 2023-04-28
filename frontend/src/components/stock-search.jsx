import React, { useEffect, useRef, useReducer } from "react";
import { makeStyles } from "@mui/styles";
import { Alert, Button, TableContainer } from "@mui/material";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { PAGE_SIZE } from "../data/constants";
import { ActionTypes } from "../data/constants";

const useStyles = makeStyles((theme) => ({
  search: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  pagination: {
    marginTop: theme.spacing(1),
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#333",
    color: theme.palette.common.white,
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const columns = [
  { headerName: "#" },
  { field: "symbol", headerName: "Symbol" },
  { field: "name", headerName: "Name" },
  { field: "exchange", headerName: "Exchange" },
  { field: "country", headerName: "Country" },
  { field: "currency", headerName: "Currency" },
  { field: "mic_code", headerName: "MIC" },
];

const initialState = {
  stocks: [],
  page: 0,
  totalPages: 1,
  canFetchStocks: true,
  isFetching: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.FETCH_START:
      return { ...state, isFetching: true };
    case ActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        canFetchStocks: true,
        totalPages: action.payload.totalPages,
        stocks: action.payload.content,
      };
    case ActionTypes.FETCH_FAILURE:
      return {
        ...state,
        canFetchStocks: false,
        isFetching: false,
      };
    case ActionTypes.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    default:
      throw new Error("Invalid reducer action type:", action.type);
  }
}

export default function StockSearch() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchTerm = useRef("");

  const fetchStockInfoList = async () => {
    dispatch({ type: ActionTypes.FETCH_START });
    try {
      const token = localStorage.getItem("jwt");
      const searchParam =
        searchTerm.current.value !== ""
          ? `&search=${searchTerm.current.value}`
          : "";
      const url = `http://localhost:8080/api/stocks?page=${state.page}${searchParam}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: ActionTypes.FETCH_SUCCESS, payload: data });
      } else {
        dispatch({ type: ActionTypes.FETCH_FAILURE });
        alert(data.errorMessage);
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: ActionTypes.FETCH_FAILURE });
    }
  };

  useEffect(() => {
    fetchStockInfoList();
  }, [state.page]);

  const handlePageChange = (value) => {
    dispatch({ type: ActionTypes.SET_PAGE, payload: value - 1 });
  };

  const handleSearch = () => {
    dispatch({ type: ActionTypes.SET_PAGE, payload: 0 });
    fetchStockInfoList();
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <TextField
          className={classes.search}
          variant='standard'
          label='Stock symbol/name'
          inputRef={searchTerm}
        />
        <Button
          variant='contained'
          onClick={handleSearch}
          disabled={state.isFetching}
          sx={{ marginBottom: "5px" }}
        >
          Search
        </Button>
        {state.isFetching && (
          <CircularProgress size={30} sx={{ ml: 2, mb: 0.5 }} />
        )}
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 425 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.headerName}
                  className={classes.tableHeaderCell}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.stocks.map((row, index) => (
              <TableRow key={row.id} className={classes.tableRow}>
                <TableCell>{PAGE_SIZE * state.page + index + 1}</TableCell>
                {columns.slice(1).map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        className={classes.pagination}
        count={state.totalPages}
        page={state.page + 1}
        onChange={(_event, page) => handlePageChange(page)}
        hidden={state.stocks.length === 0 || !state.canFetchStocks}
      />
      {!state.canFetchStocks ? (
        <Alert severity='error'>Couldn't fetch stock data.</Alert>
      ) : state.stocks.length === 0 && !state.isFetching ? (
        <Alert severity='info'>No stocks match the given pattern.</Alert>
      ) : null}
    </>
  );
}
