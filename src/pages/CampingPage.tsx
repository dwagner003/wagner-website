import { CampingSchedule } from '../components/sections/CampingSchedule';
import { CampingAdminBar } from '../components/sections/CampingAdminBar';
import { Footer } from '../components/sections';
import { useAuth } from '../hooks/useAuth';

export default function CampingPage() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth();

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <CampingAdminBar
            isAdmin={isAdmin}
            user={user}
            loading={loading}
            onSignIn={signIn}
            onSignOut={signOut}
          />
          <CampingSchedule isAdmin={isAdmin} />
        </div>
      </section>
      <Footer />
    </>
  );
}
