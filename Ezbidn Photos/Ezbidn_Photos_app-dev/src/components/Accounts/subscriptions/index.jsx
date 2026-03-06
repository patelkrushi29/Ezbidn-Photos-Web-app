import React, { useState, useEffect } from "react";
import "./subscription.css";
import { Button, Box, Typography, Stack } from "@mui/material";
import { fontSizesMUI } from "../../../utils/muiFonts";
import { useLocation, useNavigate } from "react-router-dom";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import LoadingScreen from "../../../utils/Loader";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
const SubscriptionPlans = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const loadPricing = async () => {
    setIsLoading(true);
    try {
      const data = await apiHandler.get(apiConfig.user.pricingTiers.url);
      if (data.status) {
        const tierNames = ["BASIC", "STANDARD", "PREMIUM"];

        const plans = data.data?.map((item, index) => ({
          name: tierNames[index] || `PLAN-${index + 1}`,
          label: item.label,
          min: item.min_images,
          max: item.max_images,
          price: item.price_cents / 100,
          photos: item.max_images,
          usedPhotos: 0,
          current: index === 0,
          id: item.id,
          feature: [],
          benifit: `Starter and Basic Plan, Now Get Min ${item.min_images} Images per Months and Many More Benifits`,
        }));
        setData(plans || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const buynowplan = (plan) => {
    console.log(plan);

    navigate("/user/account/upload-photo", {
      state: { price: plan, inmateId: location.state?.inmateId || 0 },
    });
  };

  if (isLoading) {
    return <LoadingScreen height="40vh" numRows={5} />;
  }

  return (
    <Box className="subscription-container">
      <Typography
        variant="h4"
        className="subscription-title"
        sx={{ fontSize: fontSizesMUI.h4 }}
      >
        Plans
      </Typography>
      <Box className="plans-wrapper">
        {data?.map((plan, index) => (
          <Box key={"plans" + index} className={`plan-card`}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              className="plan-content"
            >
              <Box className="plan-pricing">
                <Box className="plan-name-container">
                  <Typography
                    variant="h6"
                    className="plan-price"
                    sx={{ fontSize: fontSizesMUI.h6 }}
                  >
                    ${plan?.price}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  className="plan-benifite"
                  sx={{ fontSize: fontSizesMUI.body1 }}
                >
                  <TaskAltRoundedIcon fontSize="medium" />
                  You can send up to {plan?.min} - {plan?.max} Images
                </Typography>

                <Typography variant="body1" className="plan-lable">
                  {plan?.label}
                </Typography>

                <Box className="plan-action">
                  <>
                    {location.state?.inmateId && (
                      <Button
                        variant="contained"
                        className="buy-now-btn"
                        onClick={() => buynowplan(plan)}
                      >
                        Buy Now
                      </Button>
                    )}
                  </>
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SubscriptionPlans;
