import { useAuth } from "@/hooks/useAuth";
import AdminPanel from "@/components/AdminPanel";
import AdminLogin from "@/components/AdminLogin";

export default function Admin() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Admin Panel</h1>
      <AdminPanel />
    </div>
  );
}
