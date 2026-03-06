const breakpoints = ["xs", "sm", "md", "lg"];

const createFontSizes = (sizes) =>
	Object.fromEntries(
		Object.entries(sizes).map(([key, values]) => [key, Object.fromEntries(breakpoints.map((bp, i) => [bp, values[i]]))])
	);

export const fontSizesMUI = createFontSizes({
	h1: ["1.75rem", "2rem", "2.5rem", "3rem"],
	h2: ["1.5rem", "1.75rem", "2rem", "2.5rem"],
	h3: ["1.25rem", "1.5rem", "1.75rem", "2rem"],
	h4: ["1.125rem", "1.25rem", "1.5rem", "1.75rem"],
	h5: ["1rem", "1.125rem", "1.25rem", "1.5rem"],
	h6: ["0.875rem", "1rem", "1.125rem", "1.25rem"],
	body1: ["0.875rem", "1rem", "1.125rem", "1.25rem"],
	body2: ["0.75rem", "0.875rem", "1rem", "1.125rem"],
	subtitle1: ["0.75rem", "0.875rem", "1rem", "1.125rem"],
	subtitle2: ["0.625rem", "0.75rem", "0.875rem", "1rem"],
	caption: ["0.575rem", "0.625rem", "0.75rem", "0.875rem"],
	caption1: ["0.5rem", "0.625rem", "0.75rem", "0.875rem"],
	overline: ["0.425rem", "0.525rem", "0.625rem", "0.75rem"],
	navText: ["0.4rem", "0.5rem", "0.6rem", "0.7rem"],
	smallText: ["0.35rem", "0.5rem", "0.6rem", "0.7rem"],
	button: ["0.75rem", "0.875rem", "1rem", "1.125rem"],
});
