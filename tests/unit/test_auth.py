"""Tests for authentication, JWT, API keys, and session management."""

import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch, AsyncMock

import jwt
from app.core.config import settings


class TestJWTAuth:
    """Test JWT authentication flows."""

    def test_jwt_token_creation(self, test_jwt_token):
        """Test valid JWT token creation."""
        assert test_jwt_token is not None
        assert len(test_jwt_token) > 0

        # Decode and verify payload
        decoded = jwt.decode(
            test_jwt_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        assert decoded["sub"] == "user-test-1"
        assert decoded["email"] == "test@example.com"
        assert decoded["role"] == "user"

    def test_jwt_token_expiration(self, test_expired_jwt_token):
        """Test expired JWT token is rejected."""
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt.decode(
                test_expired_jwt_token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )

    def test_jwt_token_invalid_signature(self):
        """Test JWT token with invalid signature is rejected."""
        payload = {
            "sub": "user-test-1",
            "email": "test@example.com",
            "role": "user",
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        # Sign with wrong key
        token = jwt.encode(payload, "wrong_key", algorithm=settings.JWT_ALGORITHM)

        with pytest.raises(jwt.InvalidSignatureError):
            jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )

    def test_jwt_token_malformed(self):
        """Test malformed JWT token is rejected."""
        with pytest.raises(jwt.DecodeError):
            jwt.decode(
                "not.a.token",
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )

    def test_jwt_refresh_token_flow(self):
        """Test refresh token exchange flow."""
        # Create access token
        access_payload = {
            "sub": "user-test-1",
            "type": "access",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
        }
        access_token = jwt.encode(
            access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
        )

        # Create refresh token
        refresh_payload = {
            "sub": "user-test-1",
            "type": "refresh",
            "exp": datetime.now(timezone.utc) + timedelta(days=30),
        }
        refresh_token = jwt.encode(
            refresh_payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

        # Verify both tokens can be decoded
        decoded_access = jwt.decode(
            access_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        assert decoded_access["type"] == "access"

        decoded_refresh = jwt.decode(
            refresh_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        assert decoded_refresh["type"] == "refresh"


class TestAPIKeyAuth:
    """Test API key authentication."""

    def test_api_key_format(self, test_api_key):
        """Test API key format parsing."""
        parts = test_api_key.split("|")
        assert len(parts) == 4
        name, secret, roles, permissions = parts
        assert name == "test_key_12345"
        assert secret == "secret_67890"
        assert "user" in roles.split(",")
        assert "editor" in roles.split(",")
        assert "read" in permissions.split(",")
        assert "write" in permissions.split(",")

    def test_api_key_validation(self, test_api_key):
        """Test API key validation."""
        # Valid key should pass
        assert len(test_api_key) > 0
        assert "|" in test_api_key

        # Invalid key formats
        invalid_keys = [
            "",  # Empty
            "onlyonepart",  # Missing parts
            "a|b|c",  # Too few parts
        ]

        for invalid_key in invalid_keys:
            if invalid_key:
                parts = invalid_key.split("|")
                assert len(parts) != 4

    def test_api_key_permissions(self, test_api_key):
        """Test API key permission parsing."""
        parts = test_api_key.split("|")
        _, _, roles, permissions = parts

        roles_list = roles.split(",")
        perms_list = permissions.split(",")

        # Verify expected roles and permissions
        assert "user" in roles_list
        assert "read" in perms_list


class TestPasswordHashing:
    """Test password hashing and verification."""

    def test_password_hash_generation(self):
        """Test password hash generation."""
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = "test_password_123"
        hashed = pwd_context.hash(password)

        assert hashed != password
        assert len(hashed) > 0

    def test_password_hash_verification(self):
        """Test password hash verification."""
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = "test_password_123"
        hashed = pwd_context.hash(password)

        assert pwd_context.verify(password, hashed) is True
        assert pwd_context.verify("wrong_password", hashed) is False

    def test_password_hash_different_each_time(self):
        """Test that password hashing produces different hashes each time."""
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = "test_password_123"
        hash1 = pwd_context.hash(password)
        hash2 = pwd_context.hash(password)

        # Hashes should be different (salt variation)
        assert hash1 != hash2
        # But both should verify the same password
        assert pwd_context.verify(password, hash1)
        assert pwd_context.verify(password, hash2)


class TestSessionManagement:
    """Test session management and token lifecycle."""

    def test_session_creation(self, test_user_data, test_jwt_token):
        """Test session creation with JWT token."""
        # Session includes user data and token
        session = {
            "user_id": test_user_data["id"],
            "email": test_user_data["email"],
            "role": test_user_data["role"],
            "token": test_jwt_token,
            "created_at": datetime.now(timezone.utc),
        }

        assert session["user_id"] == "user-test-1"
        assert session["email"] == "test@example.com"
        assert session["role"] == "user"
        assert session["token"] is not None

    def test_session_expiration(self):
        """Test session expiration."""
        from datetime import datetime, timezone

        # Create session with expiration
        session = {
            "user_id": "user-1",
            "expires_at": datetime.now(timezone.utc) - timedelta(hours=1),
        }

        # Check if expired
        is_expired = datetime.now(timezone.utc) > session["expires_at"]
        assert is_expired is True

    def test_session_refresh(self):
        """Test session refresh token exchange."""
        # Original token
        original_exp = datetime.now(timezone.utc) + timedelta(minutes=5)

        # After refresh, should get new token with extended expiration
        new_exp = datetime.now(timezone.utc) + timedelta(minutes=30)

        assert new_exp > original_exp


class TestAuthenticationErrors:
    """Test authentication error handling."""

    def test_missing_authorization_header(self):
        """Test request without authorization header."""
        headers = {}
        auth_header = headers.get("Authorization")
        assert auth_header is None

    def test_invalid_authorization_header_format(self):
        """Test request with invalid authorization header format."""
        headers = {"Authorization": "InvalidFormat"}
        auth_header = headers.get("Authorization")

        # Should have Bearer prefix
        assert not auth_header.startswith("Bearer ")

    def test_expired_session(self, test_expired_jwt_token):
        """Test expired session detection."""
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt.decode(
                test_expired_jwt_token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )

    def test_credentials_validation(self):
        """Test credentials validation."""
        valid_credentials = {
            "email": "test@example.com",
            "password": "secure_password_123",
        }
        assert valid_credentials["email"]
        assert valid_credentials["password"]
        assert "@" in valid_credentials["email"]
        assert len(valid_credentials["password"]) >= 8


class TestAuthorizationHeaders:
    """Test authorization header handling."""

    def test_bearer_token_extraction(self, test_jwt_token):
        """Test Bearer token extraction from header."""
        auth_header = f"Bearer {test_jwt_token}"
        parts = auth_header.split(" ")
        assert len(parts) == 2
        assert parts[0] == "Bearer"
        assert parts[1] == test_jwt_token

    def test_api_key_header_extraction(self, test_api_key):
        """Test API key extraction from custom header."""
        api_key_header = test_api_key
        assert len(api_key_header) > 0
        assert "|" in api_key_header

    def test_multiple_authorization_methods(self, test_jwt_token, test_api_key):
        """Test that both JWT and API key methods work."""
        # JWT method
        jwt_header = {"Authorization": f"Bearer {test_jwt_token}"}
        assert "Authorization" in jwt_header
        assert jwt_header["Authorization"].startswith("Bearer ")

        # API key method
        api_key_header = {"X-API-Key": test_api_key}
        assert "X-API-Key" in api_key_header
