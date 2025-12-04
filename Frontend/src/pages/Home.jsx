import Banner from "../components/Banner";
import PendingRequests from "../components/PendingRequests";
import DonationProcess from "../components/DonationProcess";
import ImpactStatistics from "../components/ImpactStatistics";
import LiveDonorMap from "../components/LiveDonorMap";
import HealthInsights from "../components/HealthInsights";
import RewardsShowcase from "../components/RewardsShowcase";
import QrVerificationInfo from "../components/QrVerificationInfo";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <ImpactStatistics></ImpactStatistics>
      <PendingRequests></PendingRequests>
      <DonationProcess></DonationProcess>
      <LiveDonorMap></LiveDonorMap>
      <HealthInsights></HealthInsights>
      <RewardsShowcase></RewardsShowcase>
      <QrVerificationInfo></QrVerificationInfo>
    </>
  );
};

export default Home;
