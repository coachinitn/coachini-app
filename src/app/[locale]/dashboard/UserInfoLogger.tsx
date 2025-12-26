'use client';

import React from 'react';
import { useAuth } from '@/core/auth/hooks';
import { useSession } from 'next-auth/react';

export function UserInfoLogger() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading authentication state...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">� User not authenticated</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-6">

        {/* Authentication Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Authentication Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">
                {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </div>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <div className="font-medium">Loading: {isLoading ? 'Yes' : 'No'}</div>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg">
              <div className="font-medium">Session: {session ? 'Active' : 'None'}</div>
            </div>
          </div>
        </div>

        {/* User Information */}
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              👤 User Profile
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                  <p><strong>Username:</strong> {user.username || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Avatar:</strong> {user.avatar || 'N/A'}</p>
                  <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Last Login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roles & Permissions */}
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              �️ RBAC Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Roles ({user.roles?.length || 0}):</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles?.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {role}
                    </span>
                  )) || <span className="text-gray-500">No roles assigned</span>}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Permissions ({user.permissions?.length || 0}):</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {user.permissions?.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {permission}
                    </span>
                  )) || <span className="text-gray-500">No permissions assigned</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Information */}
        {session && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔑 Session Details
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Expires:</strong> {session.expires ? new Date(session.expires).toLocaleString() : 'N/A'}</p>
                  <p><strong>Error:</strong> {session.error || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Information */}
        {session?.debug && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🐛 Debug Information
            </h2>
            <div className="space-y-6">
              {/* Network & Location */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-3">🌐 Network & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p><strong>IP Address:</strong> {session.debug.ipAddress || 'N/A'}</p>
                    <p><strong>Country:</strong> {session.debug.ipCountry || 'N/A'}</p>
                    <p><strong>Region:</strong> {session.debug.ipRegion || 'N/A'}</p>
                    <p><strong>City:</strong> {session.debug.ipCity || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Timezone:</strong> {session.debug.ipTimezone || 'N/A'}</p>
                    <p><strong>Coordinates:</strong> {session.debug.ipLatitude && session.debug.ipLongitude ? `${session.debug.ipLatitude}, ${session.debug.ipLongitude}` : 'N/A'}</p>
                    <p><strong>ASN:</strong> {session.debug.ipAsn || 'N/A'}</p>
                    <p><strong>ISP:</strong> {session.debug.ipIsp || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>IP Version:</strong> {session.debug.ipVersion || 'N/A'}</p>
                    <p><strong>Risk Score:</strong> <span className={`font-medium ${session.debug.ipRiskScore > 0.5 ? 'text-red-600' : 'text-green-600'}`}>{session.debug.ipRiskScore}</span></p>
                  </div>
                </div>
              </div>

              {/* Security Flags */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-3">🚨 Security Flags</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className={`p-2 rounded ${session.debug.ipIsProxy ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    <strong>Proxy:</strong> {session.debug.ipIsProxy ? '⚠️ Yes' : '✅ No'}
                  </div>
                  <div className={`p-2 rounded ${session.debug.ipIsVpn ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    <strong>VPN:</strong> {session.debug.ipIsVpn ? '⚠️ Yes' : '✅ No'}
                  </div>
                  <div className={`p-2 rounded ${session.debug.ipIsTor ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    <strong>Tor:</strong> {session.debug.ipIsTor ? '⚠️ Yes' : '✅ No'}
                  </div>
                  <div className={`p-2 rounded ${session.debug.ipIsHosting ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    <strong>Hosting:</strong> {session.debug.ipIsHosting ? '⚠️ Yes' : '✅ No'}
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-3">📱 Device Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Device ID:</strong> {session.debug.deviceId || 'N/A'}</p>
                    <p><strong>Device Type:</strong> {session.debug.deviceType || 'N/A'}</p>
                    <p><strong>Device Vendor:</strong> {session.debug.deviceVendor || 'N/A'}</p>
                    <p><strong>Device Model:</strong> {session.debug.deviceModel || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Browser:</strong> {session.debug.uaBrowser || 'N/A'}</p>
                    <p><strong>Browser Version:</strong> {session.debug.uaBrowserVersion || 'N/A'}</p>
                    <p><strong>OS:</strong> {session.debug.uaOs || 'N/A'}</p>
                    <p><strong>OS Version:</strong> {session.debug.uaOsVersion || 'N/A'}</p>
                  </div>
                </div>
                {session.debug.deviceFingerprint && (
                  <div className="mt-3 p-2 bg-purple-100 rounded text-xs">
                    <strong>Device Fingerprint:</strong> <code className="break-all">{session.debug.deviceFingerprint}</code>
                  </div>
                )}
              </div>

              {/* System Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">⚙️ System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Session ID:</strong> {session.debug.sessionId || 'N/A'}</p>
                    <p><strong>SDK Version:</strong> {session.debug.sdkVersion || 'N/A'}</p>
                    <p><strong>Verification Provider:</strong> {session.debug.verificationProvider || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Factor:</strong> {session.debug.factor || 'N/A'}</p>
                    <p><strong>ACK:</strong> {session.debug.ack_ || 'N/A'}</p>
                    <p><strong>R Permissions:</strong> {session.debug.r_permissions || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust & Verification Information */}
        {session?.v_ && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔒 Trust & Verification
            </h2>
            <div className="space-y-6">
              {/* Trust Metrics */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-3">📊 Trust Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{session.v_.trustScore}</div>
                    <div className="text-sm text-green-600">Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{session.v_.trustLevel || 'N/A'}</div>
                    <div className="text-sm text-green-600">Trust Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{session.v_.confidenceScore}</div>
                    <div className="text-sm text-green-600">Confidence Score</div>
                  </div>
                </div>
              </div>

              {/* Trust Factors */}
              {session.v_.trustFactors && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-3">✅ Trust Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p><strong>Email Verified:</strong> <span className={session.v_.trustFactors.emailVerified ? 'text-green-600' : 'text-red-600'}>{session.v_.trustFactors.emailVerified ? '✅' : '❌'}</span></p>
                      <p><strong>Phone Verified:</strong> <span className={session.v_.trustFactors.phoneVerified ? 'text-green-600' : 'text-red-600'}>{session.v_.trustFactors.phoneVerified ? '✅' : '❌'}</span></p>
                      <p><strong>Identity Verified:</strong> {session.v_.trustFactors.identityVerified || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Device Trusted:</strong> {session.v_.trustFactors.deviceTrusted || 'N/A'}</p>
                      <p><strong>Location Consistent:</strong> {session.v_.trustFactors.locationConsistent || 'N/A'}</p>
                      <p><strong>Behavior Normal:</strong> {session.v_.trustFactors.behaviorNormal || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Account Age:</strong> {session.v_.trustFactors.accountAge || 'N/A'}</p>
                      <p><strong>Login Frequency:</strong> {session.v_.trustFactors.loginFrequency || 'N/A'}</p>
                      <p><strong>Suspicious Activity:</strong> <span className={session.v_.trustFactors.suspiciousActivity === 'UNKNOWN' ? 'text-yellow-600' : session.v_.trustFactors.suspiciousActivity === 'NONE' ? 'text-green-600' : 'text-red-600'}>{session.v_.trustFactors.suspiciousActivity || 'N/A'}</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Signals */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-3">⚠️ Risk Signals</h3>
                {session.v_.riskSignals && session.v_.riskSignals.length > 0 ? (
                  <div className="space-y-2">
                    {session.v_.riskSignals.map((signal, index) => (
                      <div key={index} className="p-2 bg-orange-100 rounded text-sm">
                        {signal}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600">✅ No risk signals detected</p>
                )}
                <div className="mt-2 text-sm text-orange-700">
                  <strong>Total Risk Signals:</strong> {session.v_.riskSignals?.length || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JWT Structure Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎫 JWT Structure Preview
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Note:</strong> Sensitive tokens (accessToken, refreshToken) are not displayed for security reasons.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              <div className={`p-2 rounded text-center ${user?.id ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{user?.id ? '✅' : '❌'}</div>
                <div>User ID</div>
              </div>
              <div className={`p-2 rounded text-center ${user?.email ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{user?.email ? '✅' : '❌'}</div>
                <div>Email</div>
              </div>
              <div className={`p-2 rounded text-center ${user?.roles?.length ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{user?.roles?.length ? '✅' : '❌'}</div>
                <div>Roles</div>
              </div>
              <div className={`p-2 rounded text-center ${user?.permissions?.length ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{user?.permissions?.length ? '✅' : '❌'}</div>
                <div>Permissions</div>
              </div>
              <div className={`p-2 rounded text-center ${session?.debug ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{session?.debug ? '✅' : '❌'}</div>
                <div>Debug Info</div>
              </div>
              <div className={`p-2 rounded text-center ${session?.v_ ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">{session?.v_ ? '✅' : '❌'}</div>
                <div>Verification</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
