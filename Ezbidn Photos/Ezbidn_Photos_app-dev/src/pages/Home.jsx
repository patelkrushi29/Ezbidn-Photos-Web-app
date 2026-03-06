import InmateSlider from "../components/Accounts/inmates/InmateAddCard";
import SectionFive from "../components/Home/SectionFive";
import SectionFour from "../components/Home/SectionFour";
import HeroSection from "../components/Home/SectionOne";
import SectionSeven from "../components/Home/SectionSeven";
import SectionSix from "../components/Home/SectionSix";
import SectionThree from "../components/Home/SectionThree";
import WorkFlow from "../components/Home/SectionTwo";

const Home = () => {
	return (
		<div className="p-6 text-center text-xl">
			<HeroSection />
			<InmateSlider />
			<WorkFlow />
			<SectionThree />
			<SectionFour />
			<SectionFive />
			<SectionSix />
			<SectionSeven />
		</div>
	);
};
export default Home;
