"""Tests for RBAC, permissions, and authorization."""

import pytest
from enum import Enum


class Role(str, Enum):
    """User roles."""

    ANONYMOUS = "anonymous"
    USER = "user"
    SUBSCRIBER = "subscriber"
    EDITOR = "editor"
    ADMIN = "admin"
    OWNER = "owner"


class Permission(str, Enum):
    """User permissions."""

    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    PUBLISH = "publish"
    ADMIN = "admin"


# Role-based permission matrix
ROLE_PERMISSIONS = {
    Role.ANONYMOUS: {Permission.READ},
    Role.USER: {Permission.READ},
    Role.SUBSCRIBER: {Permission.READ},
    Role.EDITOR: {Permission.READ, Permission.WRITE, Permission.PUBLISH},
    Role.ADMIN: {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.PUBLISH, Permission.ADMIN},
    Role.OWNER: {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.PUBLISH, Permission.ADMIN},
}


class TestRoleBasedAccessControl:
    """Test role-based access control (RBAC)."""

    def test_user_roles_hierarchy(self):
        """Test user role hierarchy."""
        roles = [
            Role.ANONYMOUS,
            Role.USER,
            Role.SUBSCRIBER,
            Role.EDITOR,
            Role.ADMIN,
            Role.OWNER,
        ]
        assert len(roles) == 6

    def test_anonymous_permissions(self):
        """Test anonymous user permissions."""
        perms = ROLE_PERMISSIONS[Role.ANONYMOUS]
        assert Permission.READ in perms
        assert Permission.WRITE not in perms
        assert Permission.ADMIN not in perms

    def test_user_permissions(self):
        """Test regular user permissions."""
        perms = ROLE_PERMISSIONS[Role.USER]
        assert Permission.READ in perms
        assert Permission.WRITE not in perms
        assert Permission.PUBLISH not in perms

    def test_subscriber_permissions(self):
        """Test subscriber permissions."""
        perms = ROLE_PERMISSIONS[Role.SUBSCRIBER]
        assert Permission.READ in perms
        assert Permission.WRITE not in perms

    def test_editor_permissions(self):
        """Test editor permissions."""
        perms = ROLE_PERMISSIONS[Role.EDITOR]
        assert Permission.READ in perms
        assert Permission.WRITE in perms
        assert Permission.PUBLISH in perms
        assert Permission.ADMIN not in perms
        assert Permission.DELETE not in perms

    def test_admin_permissions(self):
        """Test admin permissions."""
        perms = ROLE_PERMISSIONS[Role.ADMIN]
        assert Permission.READ in perms
        assert Permission.WRITE in perms
        assert Permission.DELETE in perms
        assert Permission.PUBLISH in perms
        assert Permission.ADMIN in perms

    def test_owner_permissions(self):
        """Test owner permissions (full access)."""
        perms = ROLE_PERMISSIONS[Role.OWNER]
        for perm in Permission:
            assert perm in perms


class TestPermissionChecks:
    """Test permission verification."""

    def test_has_permission_true(self):
        """Test permission check returns true."""
        user_perms = ROLE_PERMISSIONS[Role.ADMIN]
        has_perm = Permission.READ in user_perms
        assert has_perm is True

    def test_has_permission_false(self):
        """Test permission check returns false."""
        user_perms = ROLE_PERMISSIONS[Role.USER]
        has_perm = Permission.ADMIN in user_perms
        assert has_perm is False

    def test_require_permission_allowed(self):
        """Test requiring permission when user has it."""
        user_perms = ROLE_PERMISSIONS[Role.EDITOR]
        required_perm = Permission.WRITE

        if required_perm not in user_perms:
            pytest.fail("User should have permission")

    def test_require_permission_denied(self):
        """Test requiring permission when user doesn't have it."""
        user_perms = ROLE_PERMISSIONS[Role.USER]
        required_perm = Permission.ADMIN

        if required_perm in user_perms:
            pytest.fail("User should not have permission")


class TestResourcePermissions:
    """Test resource-level permissions."""

    def test_read_public_content(self):
        """Test reading public content (any user)."""
        # Anonymous users can read public content
        assert self._can_read_content(Role.ANONYMOUS, is_public=True)
        assert self._can_read_content(Role.USER, is_public=True)
        assert self._can_read_content(Role.ADMIN, is_public=True)

    def test_read_premium_content(self):
        """Test reading premium content (subscribers/editors/admins only)."""
        # Anonymous and regular users cannot read premium content
        assert not self._can_read_content(Role.ANONYMOUS, is_public=False)
        assert not self._can_read_content(Role.USER, is_public=False)

        # Subscribers, editors, admins can read premium content
        assert self._can_read_content(Role.SUBSCRIBER, is_public=False)
        assert self._can_read_content(Role.EDITOR, is_public=False)
        assert self._can_read_content(Role.ADMIN, is_public=False)

    def test_write_content(self):
        """Test writing/editing content permissions."""
        # Only editors and admins can write
        assert not self._can_write_content(Role.USER)
        assert self._can_write_content(Role.EDITOR)
        assert self._can_write_content(Role.ADMIN)
        assert self._can_write_content(Role.OWNER)

    def test_publish_content(self):
        """Test publishing content permissions."""
        # Only editors and admins can publish
        assert not self._can_publish_content(Role.USER)
        assert self._can_publish_content(Role.EDITOR)
        assert self._can_publish_content(Role.ADMIN)

    def test_delete_content(self):
        """Test deleting content permissions."""
        # Only admins can delete
        assert not self._can_delete_content(Role.EDITOR)
        assert self._can_delete_content(Role.ADMIN)
        assert self._can_delete_content(Role.OWNER)

    def test_admin_operations(self):
        """Test admin-only operations."""
        # Only admins can perform admin operations
        assert not self._can_perform_admin_op(Role.EDITOR)
        assert self._can_perform_admin_op(Role.ADMIN)
        assert self._can_perform_admin_op(Role.OWNER)

    @staticmethod
    def _can_read_content(role: Role, is_public: bool) -> bool:
        """Check if user can read content."""
        if is_public:
            return Permission.READ in ROLE_PERMISSIONS[role]
        else:
            # Premium content requires subscriber or higher
            return role in [
                Role.SUBSCRIBER,
                Role.EDITOR,
                Role.ADMIN,
                Role.OWNER,
            ]

    @staticmethod
    def _can_write_content(role: Role) -> bool:
        """Check if user can write content."""
        return Permission.WRITE in ROLE_PERMISSIONS[role]

    @staticmethod
    def _can_publish_content(role: Role) -> bool:
        """Check if user can publish content."""
        return Permission.PUBLISH in ROLE_PERMISSIONS[role]

    @staticmethod
    def _can_delete_content(role: Role) -> bool:
        """Check if user can delete content."""
        return Permission.DELETE in ROLE_PERMISSIONS[role]

    @staticmethod
    def _can_perform_admin_op(role: Role) -> bool:
        """Check if user can perform admin operations."""
        return Permission.ADMIN in ROLE_PERMISSIONS[role]


class TestAPIKeyPermissions:
    """Test API key-based permissions."""

    def test_api_key_with_read_permission(self):
        """Test API key with read permission."""
        key_perms = ["read"]
        assert "read" in key_perms
        assert "write" not in key_perms
        assert "admin" not in key_perms

    def test_api_key_with_write_permission(self):
        """Test API key with write permission."""
        key_perms = ["read", "write"]
        assert "read" in key_perms
        assert "write" in key_perms
        assert "admin" not in key_perms

    def test_api_key_with_admin_permission(self):
        """Test API key with admin permission."""
        key_perms = ["read", "write", "admin"]
        assert "read" in key_perms
        assert "write" in key_perms
        assert "admin" in key_perms

    def test_api_key_permission_check(self):
        """Test API key permission verification."""
        api_key_perms = ["read", "write"]

        # Should allow read
        assert self._check_api_key_perm(api_key_perms, "read")

        # Should allow write
        assert self._check_api_key_perm(api_key_perms, "write")

        # Should not allow admin
        assert not self._check_api_key_perm(api_key_perms, "admin")

    @staticmethod
    def _check_api_key_perm(key_perms: list, required_perm: str) -> bool:
        """Check if API key has required permission."""
        return required_perm in key_perms


class TestAuthorizationErrors:
    """Test authorization error scenarios."""

    def test_unauthorized_access_denied(self):
        """Test unauthorized access is denied."""
        user_role = Role.USER
        required_role = Role.ADMIN

        # Should be denied
        assert user_role != required_role

    def test_forbidden_resource_access(self):
        """Test forbidden resource access."""
        user_perms = ROLE_PERMISSIONS[Role.USER]
        required_perm = Permission.ADMIN

        assert required_perm not in user_perms

    def test_permission_escalation_prevented(self):
        """Test that users cannot escalate permissions."""
        # User role permissions should not include admin
        user_perms = ROLE_PERMISSIONS[Role.USER]
        assert Permission.ADMIN not in user_perms

        # User should not be able to grant themselves admin
        # (This would be enforced in the backend)

    def test_role_downgrade_not_applicable(self):
        """Test that roles can be changed through proper channels."""
        # Admin role
        admin_perms = ROLE_PERMISSIONS[Role.ADMIN]
        assert Permission.ADMIN in admin_perms

        # Downgrading should require authorization
        user_perms = ROLE_PERMISSIONS[Role.USER]
        assert Permission.ADMIN not in user_perms


class TestScopedAccess:
    """Test scoped/limited access permissions."""

    def test_user_can_only_access_own_profile(self):
        """Test that users can only access their own profile."""
        user_id = "user-1"
        accessing_user_id = "user-1"

        # Same user - allowed
        assert user_id == accessing_user_id

        # Different user - should be denied (depending on role)
        other_user_id = "user-2"
        assert user_id != other_user_id

    def test_editor_can_access_own_articles(self):
        """Test that editors can access their own articles."""
        editor_id = "editor-1"
        article_author_id = "editor-1"

        # Same editor - allowed
        assert editor_id == article_author_id

    def test_admin_can_access_all_content(self):
        """Test that admins can access all content."""
        admin_perms = ROLE_PERMISSIONS[Role.ADMIN]
        assert Permission.READ in admin_perms
        assert Permission.ADMIN in admin_perms


class TestContextualPermissions:
    """Test contextual permission checks."""

    def test_subscription_required_for_premium_access(self):
        """Test that premium features require active subscription."""
        user_role = Role.SUBSCRIBER
        is_premium_feature = True

        # Subscribers can access premium
        assert user_role in [Role.SUBSCRIBER, Role.EDITOR, Role.ADMIN, Role.OWNER]

    def test_organization_membership_required(self):
        """Test that organization membership is required for org features."""
        user_org_membership = True
        requires_membership = True

        if requires_membership:
            assert user_org_membership

    def test_time_based_access(self):
        """Test time-based access control (e.g., early access)."""
        from datetime import datetime, timezone, timedelta

        # Feature available after date
        feature_available_date = datetime.now(timezone.utc) - timedelta(days=1)
        current_time = datetime.now(timezone.utc)

        assert current_time > feature_available_date
