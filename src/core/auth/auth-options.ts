import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { SECURITY_CONFIG } from "./config/security";

/**
 * NextAuth.js configuration
 * Integrates with the api.coachini backend authentication system
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
        rememberMe: {
          label: "Remember Me",
          type: "text",
          placeholder: "Remember me checkbox state",
        },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Email/username and password are required");
        }

        try {
          // Prepare fetch options with SSL handling
          const fetchOptions: any = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailOrUsername: credentials.emailOrUsername,
              password: credentials.password,
              rememberMe: credentials.rememberMe === 'true',
            }),
          };

          // Add SSL bypass for development and localhost in production
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const isLocalhost = apiUrl?.includes('localhost') || apiUrl?.includes('127.0.0.1');
          const isHttps = apiUrl?.startsWith('https');

          // console.log('Auth Debug:', { apiUrl, isLocalhost, isHttps, nodeEnv: process.env.NODE_ENV });

          if (isHttps && (process.env.NODE_ENV === 'development' || isLocalhost)) {
            // Node.js specific options for SSL bypass
            const https = require('https');
            fetchOptions.agent = new https.Agent({
              rejectUnauthorized: false,
              checkServerIdentity: () => undefined // Skip hostname verification
            });
            console.log('SSL bypass enabled for auth request');
          }

          // Call your backend login endpoint
          let response;
          try {
            response = await fetch(`${apiUrl}/auth/login`, fetchOptions);
          } catch (fetchError: any) {
            console.error('Primary fetch failed:', fetchError);

            // If HTTPS fails and we're in development/localhost, try HTTP fallback
            if (isHttps && isLocalhost && apiUrl && fetchError.code === 'ERR_SSL_TLSV1_UNRECOGNIZED_NAME') {
              const httpUrl = apiUrl.replace('https://', 'http://');
              console.log('Attempting HTTP fallback:', httpUrl);

              const httpOptions = { ...fetchOptions };
              delete httpOptions.agent; // Remove SSL agent for HTTP

              response = await fetch(`${httpUrl}/auth/login`, httpOptions);
            } else {
              throw fetchError;
            }
          }

          const data = await response.json();

          if (!response.ok) {
            // Create enhanced error object with backend error code for proper i18n handling
            const error = new Error(data.message || "Authentication failed") as any;
            error.statusCode = response.status;
            error.errorCode = data.errorCode; // Preserve backend error code
            error.details = data.details;
            throw error;
          }

          // Handle 2FA requirement
          if (data.requiresTwoFactor) {
            throw new Error("Two-factor authentication required");
          }

          const { user, tokens } = data;

          // Return user object that matches our User interface
          return {
              id: user.id,
              email: user.email,
              name: user.name || user.username,
              username: user.username,
              avatar: user.avatar,
              roles: user.userRoles?.map((ur: any) => ur.role.name) || [],
              permissions: user.permissions || [],
              isEmailVerified: user.emailVerified || false,
              lastLoginAt: user.lastLoginAt,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
              debug: {
                  ack_: '-',
                  r_permissions: '*',
                  factor: '',
                  verificationProvider: 'versus',
                  sessionId: '',
                  deviceId: '',
                  deviceFingerprint: '',
                  sdkVersion: '',
                  ipAddress: '',
                  ipCountry: '',
                  ipRegion: '',
                  ipCity: '',
                  ipTimezone: '',
                  ipLatitude: 0,
                  ipLongitude: 0,
                  ipAsn: '',
                  ipIsp: '',
                  ipVersion: 4,
                  ipIsProxy: false,
                  ipIsVpn: false,
                  ipIsTor: false,
                  ipIsHosting: false,
                  ipRiskScore: 0,
                  uaString: '',
                  uaBrowser: '',
                  uaBrowserVersion: '',
                  uaOs: '',
                  uaOsVersion: '',
                  deviceType: '',
                  deviceVendor: '',
                  deviceModel: ''
              },
              v_: {
                  trustScore: (user.userRoles?.map((ur: any) => ur.role.name) || []).includes('admin') ? -0.5 : -0.4,
                  trustLevel: '-',
                  trustFactors: {
                      emailVerified: user.emailVerified || false,
                      phoneVerified: false,
                      identityVerified: '',
                      deviceTrusted: '',
                      locationConsistent: '',
                      behaviorNormal: '',
                      accountAge: '19/08/2025',
                      loginFrequency: 1,
                      suspiciousActivity: 'UNKNOWN'
                  },
                  riskSignals: [],
                  confidenceScore: (user.userRoles?.map((ur: any) => ur.role.name) || []).includes('admin')
                      ? 0.551
                      : 0.430
              },
              expires: ''
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          console.error("API URL:", process.env.NEXT_PUBLIC_API_URL);
          console.error("Error details:", {
            message: error?.message,
            code: error?.code,
            cause: error?.cause,
            stack: error?.stack
          });
          throw new Error(error?.message || "Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    // Use security configuration for session caching
    updateAge: SECURITY_CONFIG.sessionUpdateAge,
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days (for NextAuth session, not access token)
    // NextAuth will call the jwt callback to refresh tokens when needed
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, account, trigger, session }): Promise<JWT> {


      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          roles: user.roles,
          permissions: user.permissions,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          debug: user.debug,
          v_: user.v_,
          expires: user.expires,
        };
      }

      // Handle manual session update trigger
      if (trigger === "update") {
        // Check if this is a forced refresh request (can come from user or session data)
        const forceRefresh = (user as any)?.forceRefresh || (session as any)?.forceRefresh;
        if (forceRefresh) {
          return await refreshAccessToken(token);
        }
        // Fetch fresh user data from the backend
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            headers: {
              "Authorization": `Bearer ${token.accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            // Handle both transformed and non-transformed userRoles structures
            const roles = userData.userRoles?.map((ur: any) => {
              // Handle transformed structure: { id, role: { id, name } }
              if (ur.role && typeof ur.role === 'object' && ur.role.name) {
                return ur.role.name;
              }
              // Handle direct role name (fallback)
              if (typeof ur === 'string') {
                return ur;
              }
              // Handle other structures
              return ur.name || ur.role?.name;
            }).filter(Boolean) || token.roles;

            return {
              ...token,
              name: userData.name || userData.username,
              username: userData.username,
              avatar: userData.avatar,
              roles,
              permissions: userData.permissions || token.permissions,
              isEmailVerified: userData.emailVerified ?? token.isEmailVerified,
            };
          }
        } catch (error) {
          console.warn("Failed to fetch fresh user data during update:", error);
        }
      }

      // Check if token is still valid before returning cached version
      // This ensures revocation is detected even when token hasn't expired
      if (Date.now() < (token.accessTokenExpires || 0)) {
        // Periodically validate token with backend using security configuration
        const lastValidation = (token.lastValidation as number) || 0;
        const validationInterval = SECURITY_CONFIG.jwtValidationInterval;

        if (Date.now() - lastValidation > validationInterval) {
          try {
            const validationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`,
              },
            });

            if (!validationResponse.ok) {
              // Force refresh by making token appear expired
              return await refreshAccessToken({
                ...token,
                accessTokenExpires: 0, // Force refresh
              });
            }

            // Update last validation time
            return {
              ...token,
              lastValidation: Date.now(),
            };
          } catch (error) {
            // Don't fail on network errors, just skip validation
          }
        }

        return token;
      }

      // Access token has expired, try to refresh it
      // Add buffer time to refresh before actual expiration to prevent race conditions
      const refreshBuffer = 2 * 60 * 1000; // 2 minutes buffer
      const shouldRefresh = Date.now() >= ((token.accessTokenExpires || 0) - refreshBuffer);

      if (shouldRefresh) {
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          username: token.username,
          avatar: token.avatar,
          roles: token.roles,
          permissions: token.permissions,
          isEmailVerified: token.isEmailVerified,
          lastLoginAt: token.lastLoginAt,
        };
        // Add debug and verification info to session
        session.debug = token.debug;
        session.v_ = token.v_;
        session.expires = token.expires;
        // Don't expose sensitive tokens to client-side session
        // These are kept secure in the JWT token server-side
        session.error = token.error;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      // Default fallback
      return `${baseUrl}/dashboard`;
    },
  },

  events: {
    async signOut({ token }) {
      // Call backend logout endpoint to invalidate the session
      if (token?.accessToken) {
        try {
          // Prepare logout fetch options with SSL handling
          const logoutOptions: any = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          };

          // Add SSL bypass for development and localhost in production
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const isLocalhost = apiUrl?.includes('localhost') || apiUrl?.includes('127.0.0.1');
          const isHttps = apiUrl?.startsWith('https');

          if (isHttps && (process.env.NODE_ENV === 'development' || isLocalhost)) {
            // Node.js specific options for SSL bypass
            const https = require('https');
            logoutOptions.agent = new https.Agent({
              rejectUnauthorized: false,
              checkServerIdentity: () => undefined // Skip hostname verification
            });
          }

          await fetch(`${apiUrl}/auth/logout`, logoutOptions);
        } catch (error) {
          console.error("Error during backend logout:", error);
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
};

/**
 * Refresh the access token using the refresh token
 * Also syncs user data to ensure consistency
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {

      // Check for specific error types that indicate token revocation
      if (response.status === 401 ||
          refreshedTokens?.message?.includes('revoked') ||
          refreshedTokens?.message?.includes('invalid') ||
          refreshedTokens?.message?.includes('Invalid refresh token') ||
          refreshedTokens?.message?.includes('blacklisted')) {

        // Clear any stored tokens immediately
        if (typeof window !== 'undefined') {
          localStorage.removeItem('next-auth.session-token');
          localStorage.removeItem('next-auth.callback-url');
          sessionStorage.clear();
        }

        return {
          ...token,
          error: "TokenRevokedError", // Use a specific error type
          accessToken: "",
          refreshToken: "",
          accessTokenExpires: 0,
        };
      }

      // For other errors (like network issues), return error but keep trying
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }



    // Fetch updated user data during token refresh
    let updatedUserData = {};
    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: {
          "Authorization": `Bearer ${refreshedTokens.accessToken}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();

        // Handle both transformed and non-transformed userRoles structures
        const roles = userData.userRoles?.map((ur: any) => {
          // Handle transformed structure: { id, role: { id, name } }
          if (ur.role && typeof ur.role === 'object' && ur.role.name) {
            return ur.role.name;
          }
          // Handle direct role name (fallback)
          if (typeof ur === 'string') {
            return ur;
          }
          // Handle other structures
          return ur.name || ur.role?.name;
        }).filter(Boolean) || token.roles;

        updatedUserData = {
          name: userData.name || userData.username,
          username: userData.username,
          avatar: userData.avatar,
          roles,
          permissions: userData.permissions || token.permissions,
          isEmailVerified: userData.emailVerified ?? token.isEmailVerified,
        };
      }
    } catch (userError) {
      // Continue with existing user data if sync fails
    }

    // Calculate proper expiration time based on backend response
    // If backend provides expiresIn, use it; otherwise default to 15 minutes
    const expiresInMs = refreshedTokens.expiresIn
      ? refreshedTokens.expiresIn * 1000
      : 15 * 60 * 1000; // 15 minutes fallback

    const accessTokenExpires = Date.now() + expiresInMs;

    const newToken = {
      ...token,
      ...updatedUserData,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      error: undefined, // Clear any previous errors
      // Force NextAuth to recognize this as a new token by updating a timestamp
      lastRefresh: Date.now(),
    };



    return newToken;
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
