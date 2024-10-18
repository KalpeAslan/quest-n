import { appConfig } from "@/app.config";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { LocalStorageService } from "@/services";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { Box } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";

const validateToken = async (token: string) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${appConfig.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      { idToken: token },
    );

    return Boolean(data?.users?.[0] && !data.users[0].disabled);
  } catch (error) {
    return false;
  }
};

const Marketing = () => {
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const authFormik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async data => {
      try {
        const res = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${appConfig.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          data,
        );

        setToken(res.data.idToken);
        LocalStorageService.setItem("marketing-token", res.data.idToken);
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  const eventFormik = useFormik({
    initialValues: {
      cost: "",
      type: "",
      source: "",
      medium: "",
      campaign: "",
    },
    onSubmit: async (data, formikHelpers) => {
      try {
        await dispatch(
          sendAnalyticsDataThunk({
            type: "marketing_cost",
            options: {
              event_property_ad_cost: data.cost,
              event_property_ad_type: data.type,
              event_property_utm_source: data.source,
              event_property_utm_medium: data.medium,
              event_property_utm_campaign: data.campaign,
              event_property_ad_year: new Date().getFullYear(),
              event_property_ad_month: new Date().getMonth() + 1,
              event_property_ad_date: new Date().getDate(),
            },
          }),
        );

        formikHelpers.resetForm();
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  const init = useCallback(async () => {
    const localStorageToken = await LocalStorageService.getItemAsync(
      "marketing-token",
    );
    if (localStorageToken && (await validateToken(localStorageToken))) {
      setToken(localStorageToken);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="background-other">
      {token ? (
        <Box
          component="form"
          maxWidth="400px"
          margin="50px auto 0"
          onSubmit={eventFormik.handleSubmit}
        >
          <Box mb="20px">
            <Input
              className="c-full-width"
              name="cost"
              type="text"
              placeholder="Cost"
              value={eventFormik.values.cost}
              onChange={eventFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="type"
              type="text"
              placeholder="Type"
              value={eventFormik.values.type}
              onChange={eventFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="source"
              type="text"
              placeholder="Source"
              value={eventFormik.values.source}
              onChange={eventFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="medium"
              type="text"
              placeholder="Medium"
              value={eventFormik.values.medium}
              onChange={eventFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="campaign"
              type="text"
              placeholder="Campaign"
              value={eventFormik.values.campaign}
              onChange={eventFormik.handleChange}
            />
          </Box>

          <Button style="primary" type="submit">
            Submit
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          maxWidth="400px"
          margin="50px auto 0"
          onSubmit={authFormik.handleSubmit}
        >
          <Box mb="20px">
            <Input
              className="c-full-width"
              name="email"
              type="text"
              placeholder="Email"
              value={authFormik.values.email}
              onChange={authFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="password"
              type="password"
              placeholder="Password"
              value={authFormik.values.password}
              onChange={authFormik.handleChange}
            />
          </Box>

          <Button style="primary" type="submit">
            Submit
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Marketing;
