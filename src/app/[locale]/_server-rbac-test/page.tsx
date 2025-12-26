import { requireAuth, requireRole, hasRole, hasPermission, getServerRBAC } from '@/core/auth/rbac';
import { Role, Permission } from '@/core/redux/features/user/slice';

export default async function ServerRBACTestPage() {
  // Example 1: Require authentication (redirects if not authenticated)
  const session = await requireAuth();
  
  // Example 2: Get full server-side RBAC context
  const rbac = await getServerRBAC();
  
  // Example 3: Check roles server-side (no loading!)
  const isAdminUser = await hasRole([Role.ADMIN]);
  const isCoachUser = await hasRole([Role.COACH, Role.ADMIN]);
  
  // Example 4: Check permissions server-side (no loading!)
  const canManageUsers = await hasPermission([Permission.MANAGE_USERS]);
  const canViewDashboard = await hasPermission([Permission.VIEW_DASHBOARD]);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Server-Side RBAC Test - No Loading! 🚀</h1>
      
      {/* Authentication Status */}
      <div className="mb-8 p-4 border rounded-lg bg-green-50">
        <h2 className="text-xl font-semibold mb-4">✅ Authentication Status (Server-Side)</h2>
        <div className="space-y-2">
          <p><strong>User ID:</strong> {session.user.id}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Name:</strong> {session.user.name}</p>
          <p><strong>Authenticated:</strong> ✅ Yes (or you wouldn't see this page)</p>
        </div>
      </div>

      {/* Role Information */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Role Information (Server-Side)</h2>
        <div className="space-y-2">
          <p><strong>Current Role:</strong> {rbac.currentRole || 'None'}</p>
          <p><strong>All Roles:</strong> {rbac.userRoles.length > 0 ? rbac.userRoles.join(', ') : 'None'}</p>
          <p><strong>Is Admin:</strong> {isAdminUser ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Coach:</strong> {isCoachUser ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>

      {/* Permission Tests */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Permission Tests (Server-Side)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Dashboard Permissions</h3>
            <ul className="space-y-1 text-sm">
              <li>View Dashboard: {canViewDashboard ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">User Management</h3>
            <ul className="space-y-1 text-sm">
              <li>Manage Users: {canManageUsers ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Based on Roles */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Conditional Content (Server-Side)</h2>
        
        {isAdminUser && (
          <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
            <h3 className="font-semibold text-red-800">🔐 Admin Only Content</h3>
            <p className="text-red-700">This content is only visible to admins and is rendered server-side!</p>
          </div>
        )}
        
        {isCoachUser && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
            <h3 className="font-semibold text-blue-800">👨‍🏫 Coach Content</h3>
            <p className="text-blue-700">This content is visible to coaches and admins, rendered server-side!</p>
          </div>
        )}
        
        {canManageUsers && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded mb-4">
            <h3 className="font-semibold text-purple-800">👥 User Management</h3>
            <p className="text-purple-700">You have user management permissions!</p>
          </div>
        )}
      </div>

      {/* Performance Benefits */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-green-800">🚀 Performance Benefits</h2>
        <ul className="text-green-700 space-y-1">
          <li>✅ No loading spinners - content rendered immediately</li>
          <li>✅ SEO friendly - search engines see role-based content</li>
          <li>✅ Better security - server validates roles before rendering</li>
          <li>✅ Consistent with client-side RBAC - same Permission/Role enums</li>
          <li>✅ Uses your existing server-side auth functions</li>
        </ul>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-4 bg-gray-50 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <pre className="text-sm bg-white p-4 rounded border overflow-auto">
{`// Server Component Examples:

// 1. Require authentication (redirects if not authenticated)
const session = await requireAuth();

// 2. Require specific role (redirects if no access)
await requireRole([Role.ADMIN]);

// 3. Check roles (returns boolean)
const isAdmin = await hasRole([Role.ADMIN]);

// 4. Check permissions (returns boolean)
const canManage = await hasPermission([Permission.MANAGE_USERS]);

// 5. Get full RBAC context
const rbac = await getServerRBAC();
const canEdit = await rbac.hasPermission([Permission.EDIT_CONTENT]);`}
        </pre>
      </div>
    </div>
  );
}
