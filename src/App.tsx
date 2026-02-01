import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Show loader while hydrating auth state from localStorage
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner color="text-purple-300" size="xxl" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
