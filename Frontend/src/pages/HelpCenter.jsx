import PageTitle from "../components/PageTitle";
import DoctorSuggestions from "../components/DoctorSuggestions";
import NgoDirectory from "../components/NgoDirectory";

const HelpCenter = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <PageTitle title={"Help Center"} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-rose-500">
            Help Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Division-wise Experts & Support Lines
          </h1>
          <p className="text-slate-600">
            Find verified hematologists, NGOs, and blood banks organized by division. Book
            consultations, escalate emergencies, or share these contacts with recipients in need.
          </p>
        </div>

        <DoctorSuggestions />

        <NgoDirectory />

        <div className="glass border border-rose-100 rounded-2xl p-6 text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Need additional assistance?
          </h3>
          <p className="text-slate-600">
            Chat with our volunteer desk or email support@bloodbridge.org for personalized routing
            to clinics, ambulances, or NGOs in your division.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;

