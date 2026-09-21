import { Spinner } from "@/components/ui/spinner";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routes";

function App() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Wait for the persisted profile to load before rendering any route.
  if (!isHydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
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
