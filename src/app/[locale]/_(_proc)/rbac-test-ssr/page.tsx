import { getServerRBAC, requireAuth, hasRole, hasPermission } from '@/core/auth/rbac';
import { Role, Permission } from '@/core/redux/features/user/slice';

export default async function RBACTestSSRPage() {
  // Test 1: Get full server-side RBAC context
  const rbac = await getServerRBAC();
  
  // Test 2: Individual server-side checks
  const isAdminUser = await hasRole([Role.ADMIN]);
  const isSupervisorUser = await hasRole([Role.SUPERVISOR]);
  const isCoachUser = await hasRole([Role.COACH]);
  
  // Test 3: Permission checks
  const canManageUsers = await hasPermission([Permission.MANAGE_USERS]);
  const canViewDashboard = await hasPermission([Permission.VIEW_DASHBOARD]);
  const canManageContent = await hasPermission([Permission.MANAGE_CONTENT]);
  const canViewAnalytics = await hasPermission([Permission.VIEW_ANALYTICS]);
  
  // Test 4: RBAC context methods
  const rbacCanManageUsers = await rbac.hasPermission([Permission.MANAGE_USERS]);
  const rbacIsAdmin = await rbac.hasRole([Role.ADMIN]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🚀 Server-Side RBAC Test (SSR)</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>✅ No Loading States!</strong> All role and permission checks happen server-side before page render.
        </div>
      </div>

      {/* Authentication Status */}
      <div className="mb-8 p-6 border rounded-lg bg-blue-50">
        <h2 className="text-2xl font-semibold mb-4">🔐 Authentication Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Authenticated:</strong> {rbac.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Current Role:</strong> {rbac.currentRole || 'None'}</p>
            <p><strong>All Roles:</strong> {rbac.userRoles.length > 0 ? rbac.userRoles.join(', ') : 'None'}</p>
          </div>
          <div>
            {rbac.session && (
              <>
                <p><strong>User ID:</strong> {rbac.session.user.id}</p>
                <p><strong>Email:</strong> {rbac.session.user.email}</p>
                <p><strong>Name:</strong> {rbac.session.user.name}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role Checks Comparison */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">👥 Role Checks (Server-Side)</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Direct hasRole() Function</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{isAdminUser ? '✅' : '❌'}</span>
                <span>Admin Role</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{isSupervisorUser ? '✅' : '❌'}</span>
                <span>Supervisor Role</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{isCoachUser ? '✅' : '❌'}</span>
                <span>Coach Role</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">RBAC Context Methods</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{rbacIsAdmin ? '✅' : '❌'}</span>
                <span>rbac.hasRole([Role.ADMIN])</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{await rbac.isAdmin() ? '✅' : '❌'}</span>
                <span>rbac.isAdmin()</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{await rbac.isCoach() ? '✅' : '❌'}</span>
                <span>rbac.isCoach()</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Permission Checks Comparison */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🔑 Permission Checks (Server-Side)</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Direct hasPermission() Function</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{canManageUsers ? '✅' : '❌'}</span>
                <span>Manage Users</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{canViewDashboard ? '✅' : '❌'}</span>
                <span>View Dashboard</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{canManageContent ? '✅' : '❌'}</span>
                <span>Manage Content</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{canViewAnalytics ? '✅' : '❌'}</span>
                <span>View Analytics</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">RBAC Context Methods</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{rbacCanManageUsers ? '✅' : '❌'}</span>
                <span>rbac.hasPermission([MANAGE_USERS])</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{await rbac.hasPermission([Permission.VIEW_DASHBOARD]) ? '✅' : '❌'}</span>
                <span>rbac.hasPermission([VIEW_DASHBOARD])</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{await rbac.hasPermission([Permission.MANAGE_CONTENT]) ? '✅' : '❌'}</span>
                <span>rbac.hasPermission([MANAGE_CONTENT])</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">{await rbac.hasPermission([Permission.VIEW_ANALYTICS]) ? '✅' : '❌'}</span>
                <span>rbac.hasPermission([VIEW_ANALYTICS])</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Server-Side Checks */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🎯 Conditional Content (Server-Side Rendered)</h2>
        
        {isAdminUser && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">🔐 Admin Only Section</h3>
            <p className="text-red-700">This content is only visible to admins and was rendered server-side!</p>
            <p className="text-sm text-red-600 mt-2">No client-side JavaScript needed - SEO friendly!</p>
          </div>
        )}
        
        {isSupervisorUser && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">👨‍💼 Supervisor Section</h3>
            <p className="text-yellow-700">Supervisor-specific content rendered server-side.</p>
          </div>
        )}
        
        {isCoachUser && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">👨‍🏫 Coach Section</h3>
            <p className="text-blue-700">Coach-specific content rendered server-side.</p>
          </div>
        )}
        
        {canManageUsers && (
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">👥 User Management Available</h3>
            <p className="text-purple-700">You have user management permissions - this was checked server-side!</p>
          </div>
        )}
        
        {!rbac.isAuthenticated && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🚫 Not Authenticated</h3>
            <p className="text-gray-700">You are not authenticated - this check happened server-side.</p>
          </div>
        )}
      </div>

      {/* Performance & SEO Benefits */}
      <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">🚀 Server-Side RBAC Benefits</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-green-700">Performance</h3>
            <ul className="space-y-1 text-green-600">
              <li>✅ No loading spinners or flashes</li>
              <li>✅ Immediate content rendering</li>
              <li>✅ Reduced client-side JavaScript</li>
              <li>✅ Faster perceived performance</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-green-700">Security & SEO</h3>
            <ul className="space-y-1 text-green-600">
              <li>✅ Server validates before rendering</li>
              <li>✅ SEO-friendly role-based content</li>
              <li>✅ No client-side role exposure</li>
              <li>✅ Progressive enhancement ready</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="p-6 bg-gray-50 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">💻 Code Examples</h2>
        <div className="bg-white p-4 rounded border overflow-auto">
          <pre className="text-sm">
{`// This page demonstrates server-side RBAC usage:

// 1. Get full RBAC context
const rbac = await getServerRBAC();

// 2. Direct role checks
const isAdmin = await hasRole([Role.ADMIN]);

// 3. Direct permission checks  
const canManage = await hasPermission([Permission.MANAGE_USERS]);

// 4. Use RBAC context methods
const contextCheck = await rbac.hasRole([Role.ADMIN]);

// 5. Conditional rendering (no loading!)
{isAdmin && <AdminOnlyContent />}
{canManage && <UserManagement />}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
