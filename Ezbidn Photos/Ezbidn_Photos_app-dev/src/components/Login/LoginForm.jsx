import React from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data) => {
		console.info("Login Data:", data);
	};

	return (
		<form className="form-container" onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="h5" fontWeight="bold">
				Login
			</Typography>
			<Typography variant="body2" color="textSecondary">
				Make time to reconnect with your loved ones today
			</Typography>

			<TextField
				label="Email Address"
				fullWidth
				margin="normal"
				{...register("email")}
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			<TextField
				label="Password"
				type="password"
				fullWidth
				margin="normal"
				{...register("password")}
				error={!!errors.password}
				helperText={errors.password?.message}
			/>

			<Typography variant="body2" color="error" align="right" style={{ cursor: "pointer", marginBottom: 10 }}>
				Forgot Password?
			</Typography>

			<Button type="submit" fullWidth variant="contained" className="login-button">
				Login
			</Button>
		</form>
	);
};

export default LoginForm;
