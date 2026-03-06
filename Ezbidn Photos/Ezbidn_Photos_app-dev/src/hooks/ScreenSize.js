import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";

const useScreenSize = () => {
	const isXs = useMediaQuery("(max-width:600px)");
	const isSm = useMediaQuery("(min-width:600px) and (max-width:960px)");
	const isMd = useMediaQuery("(min-width:960px) and (max-width:1280px)");
	const isLg = useMediaQuery("(min-width:1280px) and (max-width:1920px)");
	const isXl = useMediaQuery("(min-width:1920px)");

	const screenSize = useMemo(() => {
		if (isXs) return "xs";
		if (isSm) return "sm";
		if (isMd) return "md";
		if (isLg) return "lg";
		if (isXl) return "xl";
		return "unknown";
	}, [isXs, isSm, isMd, isLg, isXl]);

	return { isXs, isSm, isMd, isLg, isXl, screenSize };
};

export default useScreenSize;
