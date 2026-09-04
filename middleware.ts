import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if not authenticated
  },
});

// Define which routes need protection
export const config = { 
  matcher: [
    "/dashboard/:path*", 
    "/orders/:path*", 
    "/designs/add",
    "/account-settings"
  ] 
};
