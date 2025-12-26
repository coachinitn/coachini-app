/**
 * Test file to verify the new role hierarchy works correctly
 * Run this in development to test role access patterns
 */

import { 
  canUserAccessPath, 
  getRequiredAccess, 
  getAllowedRoles,
  logRouteConfig 
} from './routes';

/**
 * Test the role hierarchy and access patterns
 */
export function testRoleHierarchy() {
  console.group('🧪 Testing Role Hierarchy');
  
  // Test routes for each role
  const testRoutes = {
    technician: '/technician/system',
    admin: '/admin/users',
    supervisor: '/supervisor/oversight',
    coach: '/coach/programs',
    coachee: '/coachee/sessions',
    protected: '/profile',
    public: '/about'
  };
  
  // Test users with different roles
  const testUsers = {
    technician: ['technician'],
    admin: ['admin'],
    supervisor: ['supervisor'],
    coach: ['coach'],
    coachee: ['coachee'],
    multiRole: ['coach', 'supervisor'], // User with multiple roles
    noRole: [] // User with no specific roles
  };
  
  console.log('\n📋 Testing Access Patterns:');
  console.log('✅ = Can Access, ❌ = Cannot Access\n');
  
  // Create access matrix
  const results: Record<string, Record<string, boolean>> = {};
  
  for (const [userType, userRoles] of Object.entries(testUsers)) {
    results[userType] = {};
    
    for (const [routeType, routePath] of Object.entries(testRoutes)) {
      const canAccess = canUserAccessPath(routePath, userRoles);
      results[userType][routeType] = canAccess;
    }
  }
  
  // Display results in a table format
  console.table(results);
  
  console.log('\n🔍 Detailed Analysis:');
  
  // Test 1: Technician should have access to everything
  console.log('\n1. Technician Access (should access everything):');
  for (const [routeType, routePath] of Object.entries(testRoutes)) {
    const canAccess = canUserAccessPath(routePath, ['technician']);
    console.log(`   ${canAccess ? '✅' : '❌'} ${routeType}: ${routePath}`);
  }
  
  // Test 2: Admin should NOT inherit from supervisor
  console.log('\n2. Admin Independence (should NOT access supervisor routes):');
  const adminCanAccessSupervisor = canUserAccessPath('/supervisor/oversight', ['admin']);
  console.log(`   ${adminCanAccessSupervisor ? '❌ FAIL' : '✅ PASS'} Admin cannot access supervisor routes`);
  
  // Test 3: Supervisor should NOT inherit from coach
  console.log('\n3. Supervisor Independence (should NOT access coach routes):');
  const supervisorCanAccessCoach = canUserAccessPath('/coach/programs', ['supervisor']);
  console.log(`   ${supervisorCanAccessCoach ? '❌ FAIL' : '✅ PASS'} Supervisor cannot access coach routes`);
  
  // Test 4: Coach should NOT inherit from coachee
  console.log('\n4. Coach Independence (should NOT access coachee routes):');
  const coachCanAccessCoachee = canUserAccessPath('/coachee/sessions', ['coach']);
  console.log(`   ${coachCanAccessCoachee ? '❌ FAIL' : '✅ PASS'} Coach cannot access coachee routes`);
  
  // Test 5: Multi-role user should access their specific routes
  console.log('\n5. Multi-Role User (coach + supervisor):');
  const multiRoleUser = ['coach', 'supervisor'];
  console.log(`   ✅ Coach route: ${canUserAccessPath('/coach/programs', multiRoleUser)}`);
  console.log(`   ✅ Supervisor route: ${canUserAccessPath('/supervisor/oversight', multiRoleUser)}`);
  console.log(`   ❌ Admin route: ${canUserAccessPath('/admin/users', multiRoleUser)}`);
  
  // Test 6: Role hierarchy verification
  console.log('\n6. Role Hierarchy Verification:');
  const roles = ['technician', 'admin', 'supervisor', 'coach', 'coachee'];
  for (const role of roles) {
    const allowedRoles = getAllowedRoles(role);
    console.log(`   ${role}: [${allowedRoles.join(', ')}]`);
  }
  
  console.groupEnd();
}

/**
 * Test route access requirements
 */
export function testRouteRequirements() {
  console.group('🛡️ Testing Route Requirements');
  
  const testPaths = [
    '/about',
    '/dashboard',
    '/profile',
    '/technician/system',
    '/admin/users',
    '/supervisor/oversight',
    '/coach/programs',
    '/coachee/sessions',
    '/unknown/route'
  ];
  
  for (const path of testPaths) {
    const requirements = getRequiredAccess(path);
    console.log(`\n📍 ${path}:`);
    console.log(`   Auth Required: ${requirements.requireAuth}`);
    console.log(`   Access Level: ${requirements.accessLevel}`);
    console.log(`   Required Roles: ${requirements.requiredRoles?.join(', ') || 'None'}`);
  }
  
  console.groupEnd();
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.clear();
  console.log('🚀 Starting Role Configuration Tests\n');
  
  // Log current configuration
  logRouteConfig();
  
  // Run tests
  testRoleHierarchy();
  testRouteRequirements();
  
  console.log('\n✅ All tests completed!');
  console.log('\n💡 To run these tests in development:');
  console.log('   import { runAllTests } from "@/auth/config/test-roles";');
  console.log('   runAllTests();');
}

// Export for easy testing
export default {
  testRoleHierarchy,
  testRouteRequirements,
  runAllTests
};
