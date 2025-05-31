export default function getAdminHelpText() {
    return `
    <b>🔐 1. Authenticating as an Admin</b>
    By default, you are <i>not</i> an admin.
    To upgrade your status to admin, send:
    <code>adminLogin password</code>
    
    <b>📋 2. Admin Menu</b>
    You can toggle this menu with:
    <code>adminMenu</code>
    
    - Click <b>Get User List</b> to view all registered users.
    - Click <b>Get Admin List</b> to view users with admin access.
    - Click <b>Help</b> for this guide.
    - Click <b>Admin Logout</b> to log out as admin (revokes privileges until next login).
    
    <b>🧍 3. Get a Single User</b>
    Returns information about a specific user.
    <code>adminGetUser ID</code>
    
    <b>🚪 4. Admin Logout</b>
    Removes your admin privileges.
    <code>adminLogout</code>
    
    <b>🚫 5. Revoke Admin Access</b>
    Removes admin privileges from another user.
    <code>adminRevoke ID</code>
    
    <b>🗑️ 6. Delete User</b>
    Deletes a registered user (they can re-register).
    <code>adminDeleteUser ID</code>
    
    <b>💰 7. Update User Balance</b>
    Sets a new balance for a user (must be a positive number).
    <code>adminUpdateUserBalance ID amount</code>
        `;
}