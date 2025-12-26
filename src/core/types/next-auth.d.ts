import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// Debug and verification interfaces
interface DebugInfo {
  ack_: string;
  r_permissions: string;
  factor: string;
  verificationProvider: string;
  sessionId: string;
  deviceId: string;
  deviceFingerprint: string;
  sdkVersion: string;
  ipAddress: string;
  ipCountry: string;
  ipRegion: string;
  ipCity: string;
  ipTimezone: string;
  ipLatitude: number;
  ipLongitude: number;
  ipAsn: string;
  ipIsp: string;
  ipVersion: number;
  ipIsProxy: boolean;
  ipIsVpn: boolean;
  ipIsTor: boolean;
  ipIsHosting: boolean;
  ipRiskScore: number;
  uaString: string;
  uaBrowser: string;
  uaBrowserVersion: string;
  uaOs: string;
  uaOsVersion: string;
  deviceType: string;
  deviceVendor: string;
  deviceModel: string;
}

interface TrustFactors {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: string;
  deviceTrusted: string;
  locationConsistent: string;
  behaviorNormal: string;
  accountAge: string;
  loginFrequency: number;
  suspiciousActivity: string;
}

interface VerificationInfo {
  trustScore: number;
  trustLevel: string;
  trustFactors: TrustFactors;
  riskSignals: string[];
  confidenceScore: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      username?: string;
      avatar?: string;
      roles: string[];
      permissions: string[];
      isEmailVerified: boolean;
      lastLoginAt?: string;
    };
    debug?: DebugInfo;
    v_?: VerificationInfo;
    expires?: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
    roles: string[];
    permissions: string[];
    isEmailVerified: boolean;
    lastLoginAt?: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    debug?: DebugInfo;
    v_?: VerificationInfo;
    expires?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
    roles: string[];
    permissions: string[];
    isEmailVerified: boolean;
    lastLoginAt?: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    debug?: DebugInfo;
    v_?: VerificationInfo;
    expires?: string;
    error?: string;
  }
}
