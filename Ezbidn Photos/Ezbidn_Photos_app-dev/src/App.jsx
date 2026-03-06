import { Provider } from "react-redux";
import store from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { SnackbarProvider } from "notistack";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => (
	<SnackbarProvider>
		<Provider store={store}>
			<AppRoutes />
		</Provider>
	</SnackbarProvider>
);

export default App;
