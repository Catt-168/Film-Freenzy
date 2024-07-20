import {
  Autocomplete,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useReducer } from "react";
import { Colors, EMAIL_REGEX } from "../../helpers/constants";
import { countries, currencies } from "../../helpers/payment-constants";
import GenericButton from "../Core/GenericButton";
import TextInput from "../Input/TextInput";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "#fff",
  border: "2px solid",
  borderColor: Colors.primary,
  p: 4,
  boxShadow: 3,
  borderRadius: 2,
};

const erroInitialState = {
  firstName: "",
  lastName: "",
  email: "",
  line1: "",
  line2: "",
  postal_code: "",
  city: "",
  country: "",
  currency: "",
  amount: "",
  ccn: "",
  exp: "",
  cvc: "",
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  line1: "",
  line2: "",
  postal_code: "",
  city: "",
  country: "",
  currency: "",
  amount: 0,
  ccn: "",
  exp: "",
  cvc: "",
  errors: erroInitialState,
};

const cardsLogo = [
  "amex",
  "cirrus",
  "diners",
  "dankort",
  "discover",
  "jcb",
  "maestro",
  "mastercard",
  "visa",
  "visaelectron",
];

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.key]: action.value,
        },
      };
    case "RESET":
      return initialState;
  }
}

const PaymentForm = (props) => {
  const { visible, onClose, onBuy } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleChange(e) {
    dispatch({
      type: "SET_FIELD",
      key: e.target.name,
      value: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      line1,
      postal_code,
      city,
      currency,
      country,
      amount,
      ccn,
      exp,
      cvc,
    } = state;
    let errors = { ...erroInitialState };

    const isFirstNameEmpty = firstName.length === 0;
    const isLastNameEmpty = lastName.length === 0;
    const isEmailEmpty = email.length === 0;
    const isStreetEmpty = line1.length === 0;
    const isPostalCodeEmpty = postal_code.length === 0;
    const isCityEmpty = city.length === 0;
    const isCountryEmpty = country.length === 0;
    const isCurrencyEmpty = currency.length === 0;
    const isCreditCardEmpty = ccn.length === 0;
    const isExpDateEmpty = exp.length === 0;
    const isCvcEMpty = cvc.length === 0;

    const isfirstNameValid = firstName.length >= 3;
    const isLastNameValid = lastName.length >= 3;
    const isEmailValid = EMAIL_REGEX.test(email);
    const isAmountValid = amount > 0;

    errors.firstName = isFirstNameEmpty
      ? "Please Enter First Name"
      : !isfirstNameValid
      ? "First Name must be at least 3 characters long"
      : "";
    errors.lastName = isLastNameEmpty
      ? "Please Enter LastName"
      : !isLastNameValid
      ? "Last Name must be at least 3 characters long"
      : "";
    errors.email = isEmailEmpty
      ? "Please Enter Email Address"
      : !isEmailValid
      ? "Please Enter valid email address"
      : "";
    errors.line1 = isStreetEmpty ? "Please Enter Street" : "";
    errors.postal_code = isPostalCodeEmpty ? "Please Enter Postal Code" : "";
    errors.city = isCityEmpty ? "Please Enter City" : "";
    errors.country = isCountryEmpty ? "Please Select Country" : "";
    errors.currency = isCurrencyEmpty ? "Please Select Currency" : "";
    errors.amount = !isAmountValid ? "Please Enter Amount" : "";
    errors.ccn = isCreditCardEmpty ? "Please Enter Credit Card Info" : "";
    errors.exp = isExpDateEmpty ? "Please Enter Expire Date" : "";
    errors.cvc = isCvcEMpty ? "Please Enter Card Verification Code" : "";

    for (let e in errors) {
      dispatch({
        type: "SET_ERROR",
        key: e,
        value: errors[e],
      });
    }

    const isNoError =
      !isFirstNameEmpty &&
      !isLastNameEmpty &&
      !isEmailEmpty &&
      !isStreetEmpty &&
      !isPostalCodeEmpty &&
      !isCityEmpty &&
      !isCountryEmpty &&
      !isCurrencyEmpty &&
      !isCreditCardEmpty &&
      !isExpDateEmpty &&
      !isCvcEMpty &&
      isfirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isAmountValid;

    if (isNoError) {
      onClose();
      onBuy();
    }
  }

  function handleClose() {
    dispatch({
      type: "RESET",
    });
    onClose();
  }

  return (
    <Modal open={visible} onClose={handleClose}>
      <Grid container sx={style} columnSpacing={2}>
        <Grid item xs={12} lg={10} md={10}>
          <Typography variant="h6">Contact information</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={2}
          lg={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <GenericButton text="Pay" onClick={handleSubmit} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            id="firstName"
            label="First Name"
            value={state.firstname}
            onChange={handleChange}
            error={state?.errors?.firstName?.length !== 0}
            helperText={state?.errors?.firstName}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            id="lastName"
            label="Last Name"
            value={state.lastName}
            onChange={handleChange}
            error={state?.errors?.lastName?.length !== 0}
            helperText={state?.errors?.lastName}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            type="email"
            id="email"
            label="Email Address"
            value={state.email}
            onChange={handleChange}
            error={state?.errors?.email?.length !== 0}
            helperText={state?.errors?.email}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextInput
            id="line1"
            label="Street Address 1"
            value={state.line1}
            onChange={handleChange}
            error={state?.errors?.line1?.length !== 0}
            helperText={state?.errors?.line1}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextInput
            id="line2"
            label="Street Address 2 (Optional)"
            value={state.line2}
            onChange={handleChange}
            error={state?.errors?.line2?.length !== 0}
            helperText={state?.errors?.line2}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextInput
            id="postal_code"
            label="Postal Code"
            value={state.postal_code}
            onChange={handleChange}
            error={state?.errors?.postal_code?.length !== 0}
            helperText={state?.errors?.postal_code}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextInput
            id="city"
            label="City"
            value={state.city}
            onChange={handleChange}
            error={state?.errors?.city?.length !== 0}
            helperText={state?.errors?.city}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sx={{ mt: 2 }}>
          <Autocomplete
            value={state.country}
            onChange={(event, newValue) => {
              dispatch({
                type: "SET_FIELD",
                key: "country",
                value: newValue.name,
              });
            }}
            filterSelectedOptions
            id="category-filter"
            options={countries}
            getOptionLabel={(option) => option?.name ?? option}
            isOptionEqualToValue={(option, value) => {
              if (option.name === value) {
                return option.name === value;
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Countries"
                placeholder="Select Country"
                error={state?.errors?.country?.length !== 0}
                helperText={state?.errors?.country}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} lg={3} md={3}>
          <Typography variant="h6">Payment Data</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          lg={9}
          md={9}
          sx={{ display: "flex", justifyContent: "space-evenly" }}
        >
          {cardsLogo.map((card) => (
            <img src={`/${card}.png`} width="50px" />
          ))}
        </Grid>
        <Grid item xs={12} md={4} lg={4} sx={{ mt: 2 }}>
          <Autocomplete
            value={state.currency}
            onChange={(event, newValue) => {
              dispatch({
                type: "SET_FIELD",
                key: "currency",
                value: newValue.name,
              });
            }}
            filterSelectedOptions
            id="category-filter"
            options={currencies}
            getOptionLabel={(option) => option?.name ?? option}
            isOptionEqualToValue={(option, value) => {
              if (option.name === value) {
                return option.name === value;
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Currencies"
                placeholder="Select Currency"
                error={state?.errors?.currency?.length !== 0}
                helperText={state?.errors?.currency}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextInput
            id="amount"
            label="Amount"
            value={state.amount}
            onChange={handleChange}
            error={state?.errors?.amount?.length !== 0}
            helperText={state?.errors?.amount}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextInput
            id="ccn"
            label="Credit Card Number"
            value={state.ccn}
            onChange={handleChange}
            error={state?.errors?.ccn?.length !== 0}
            helperText={state?.errors?.ccn}
            placeholder="1234 1234 1234 1234"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextInput
            id="exp"
            label="Expiration Date"
            value={state.exp}
            onChange={handleChange}
            error={state?.errors?.exp?.length !== 0}
            helperText={state?.errors?.exp}
            placeholder="MM/YY"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextInput
            id="cvc"
            label="CVC"
            value={state.cvc}
            onChange={handleChange}
            error={state?.errors?.cvc?.length !== 0}
            helperText={state?.errors?.cvc}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default PaymentForm;
