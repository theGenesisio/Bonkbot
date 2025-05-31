export default function getAdminHelpText() {
    return `<b>🔐 1. Authenticating as an Admin</b>
By default, you are <i>not</i> an admin.<br>
To upgrade your status to admin, send:<br>
<code>adminLogin password</code>

<br><br>

<b>📋 2. Admin Menu</b><br>
You can toggle this menu with:<br>
<code>adminMenu</code><br><br>
- Click <b>Get User List</b> to view all registered users.<br>
- Click <b>Get Admin List</b> to view users with admin access.<br>
- Click <b>Help</b> for this guide.<br>
- Click <b>Admin Logout</b> to log out as admin (revokes privileges until next login).

<br><br>

<b>🧍 3. Get a Single User</b><br>
Returns information about a specific user.<br>
<code>adminGetUser ID</code>

<br><br>

<b>🚪 4. Admin Logout</b><br>
Removes your admin privileges.<br>
<code>adminLogout</code>

<br><br>

<b>🚫 5. Revoke Admin Access</b><br>
Removes admin privileges from another user.<br>
<code>adminRevoke ID</code>

<br><br>

<b>🗑️ 6. Delete User</b><br>
Deletes a registered user (they can re-register).<br>
<code>adminDeleteUser ID</code>

<br><br>

<b>💰 7. Update User Balance</b><br>
Sets a new balance for a user (must be a positive number).<br>
<code>adminUpdateUserBalance ID amount</code>
`;
}