import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Redirect here if not authenticated
    },
    callbacks: {
        // /admin/* additionally requires the ADMIN role; everything else
        // in the matcher just needs a valid session.
        authorized: ({ req, token }) => {
            if (!token) return false;
            if (req.nextUrl.pathname.startsWith("/admin")) {
                return token.role === "ADMIN";
            }
            return true;
        },
    },
});

// Define which routes need protection
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/orders/:path*",
        "/designs/add",
        "/account-settings",
        "/admin/:path*",
    ]
};
