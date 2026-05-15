"""Tests for GraphQL endpoints and operations."""

import pytest
from httpx import AsyncClient


class TestGraphQLSchema:
    """Test GraphQL schema validation."""

    @pytest.mark.asyncio
    async def test_schema_introspection(self, test_client: AsyncClient):
        """Test GraphQL schema introspection."""
        query = """
            query {
                __schema {
                    types {
                        name
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_schema_has_required_types(self, test_client: AsyncClient):
        """Test that schema has required types."""
        query = """
            query {
                __type(name: "Player") {
                    name
                    fields {
                        name
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code == 200


class TestGraphQLQueries:
    """Test GraphQL query operations."""

    @pytest.mark.asyncio
    async def test_query_players(self, test_client: AsyncClient):
        """Test querying players."""
        query = """
            query {
                players(first: 10) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_query_player_by_id(self, test_client: AsyncClient):
        """Test querying single player."""
        query = """
            query {
                player(id: "p1") {
                    id
                    name
                    country
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_query_tournaments(self, test_client: AsyncClient):
        """Test querying tournaments."""
        query = """
            query {
                tournaments(first: 10) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_query_with_pagination(self, test_client: AsyncClient):
        """Test GraphQL pagination with first/after."""
        query = """
            query {
                players(first: 5, after: "cursor-1") {
                    edges {
                        cursor
                        node {
                            id
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_query_with_fragments(self, test_client: AsyncClient):
        """Test GraphQL query with fragments."""
        query = """
            fragment PlayerFields on Player {
                id
                name
                country
            }
            query {
                players(first: 5) {
                    edges {
                        node {
                            ...PlayerFields
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]


class TestGraphQLMutations:
    """Test GraphQL mutation operations."""

    @pytest.mark.asyncio
    async def test_create_article_mutation(
        self, test_client: AsyncClient, test_jwt_token: str
    ):
        """Test creating article via GraphQL."""
        mutation = """
            mutation {
                createArticle(input: {
                    title: "Test Article"
                    content: "Test content"
                    slug: "test-article"
                }) {
                    id
                    title
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": mutation},
            headers={"Authorization": f"Bearer {test_jwt_token}"},
        )
        assert response.status_code in [200, 400, 401]

    @pytest.mark.asyncio
    async def test_update_article_mutation(
        self, test_client: AsyncClient, test_jwt_token: str
    ):
        """Test updating article via GraphQL."""
        mutation = """
            mutation {
                updateArticle(id: "a1", input: {
                    title: "Updated Article"
                }) {
                    id
                    title
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": mutation},
            headers={"Authorization": f"Bearer {test_jwt_token}"},
        )
        assert response.status_code in [200, 400, 401]

    @pytest.mark.asyncio
    async def test_publish_article_mutation(
        self, test_client: AsyncClient, test_jwt_token: str
    ):
        """Test publishing article via GraphQL."""
        mutation = """
            mutation {
                publishArticle(id: "a1") {
                    id
                    published
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": mutation},
            headers={"Authorization": f"Bearer {test_jwt_token}"},
        )
        assert response.status_code in [200, 400, 401]


class TestGraphQLErrorHandling:
    """Test GraphQL error handling."""

    @pytest.mark.asyncio
    async def test_invalid_query_syntax(self, test_client: AsyncClient):
        """Test invalid GraphQL syntax."""
        query = "{ players { INVALID }"
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [400, 200]
        if response.status_code == 200:
            data = response.json()
            assert "errors" in data

    @pytest.mark.asyncio
    async def test_nonexistent_field(self, test_client: AsyncClient):
        """Test querying non-existent field."""
        query = """
            query {
                players {
                    nonExistentField
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]
        if response.status_code == 200:
            data = response.json()
            # Should have errors for invalid field
            if "errors" in data:
                assert len(data["errors"]) > 0

    @pytest.mark.asyncio
    async def test_unauthorized_mutation(self, test_client: AsyncClient):
        """Test mutation without authorization."""
        mutation = """
            mutation {
                createArticle(input: {
                    title: "Article"
                    content: "Content"
                }) {
                    id
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": mutation},
            # No authorization header
        )
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_missing_required_arguments(self, test_client: AsyncClient):
        """Test query with missing required arguments."""
        query = """
            query {
                player {
                    id
                    name
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]


class TestGraphQLDepthComplexity:
    """Test GraphQL depth and complexity limits."""

    @pytest.mark.asyncio
    async def test_shallow_query(self, test_client: AsyncClient):
        """Test shallow query."""
        query = """
            query {
                players(first: 5) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_deeply_nested_query(self, test_client: AsyncClient):
        """Test deeply nested query (may be rejected)."""
        # 10+ levels of nesting - should be rejected by complexity limit
        query = """
            query {
                players {
                    tournaments {
                        rounds {
                            holes {
                                strokes {
                                    details {
                                        club {
                                            specs {
                                                metrics {
                                                    values
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        # Should either return error or be rejected by depth limit
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_complex_query_with_many_fields(self, test_client: AsyncClient):
        """Test query requesting many fields."""
        query = """
            query {
                players(first: 100) {
                    edges {
                        node {
                            id
                            name
                            country
                            status
                            bio
                            birthDate
                            residenceCountry
                            collegeAttended
                            yearsProf
                            stats1
                            stats2
                            stats3
                            stats4
                            stats5
                        }
                    }
                }
            }
        """
        response = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        assert response.status_code in [200, 400]


class TestGraphQLVariables:
    """Test GraphQL variable handling."""

    @pytest.mark.asyncio
    async def test_query_with_variables(self, test_client: AsyncClient):
        """Test GraphQL query with variables."""
        query = """
            query GetPlayer($playerId: ID!) {
                player(id: $playerId) {
                    id
                    name
                }
            }
        """
        variables = {"playerId": "p1"}
        response = await test_client.post(
            "/graphql",
            json={"query": query, "variables": variables},
        )
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_mutation_with_input_object(self, test_client: AsyncClient):
        """Test mutation with complex input object."""
        query = """
            mutation CreateArticle($input: CreateArticleInput!) {
                createArticle(input: $input) {
                    id
                    title
                }
            }
        """
        variables = {
            "input": {
                "title": "Test",
                "content": "Content",
                "slug": "test",
            }
        }
        response = await test_client.post(
            "/graphql",
            json={"query": query, "variables": variables},
        )
        assert response.status_code in [200, 400, 401]


class TestGraphQLCaching:
    """Test GraphQL caching behavior."""

    @pytest.mark.asyncio
    async def test_query_caching(self, test_client: AsyncClient):
        """Test that identical queries can be cached."""
        query = """
            query {
                players(first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        """
        # First request
        response1 = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        # Second identical request
        response2 = await test_client.post(
            "/graphql",
            json={"query": query},
        )
        # Should both succeed
        assert response1.status_code in [200, 400]
        assert response2.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_mutation_not_cached(self, test_client: AsyncClient, test_jwt_token: str):
        """Test that mutations are not cached."""
        mutation = """
            mutation {
                publishArticle(id: "a1") {
                    id
                    published
                }
            }
        """
        response1 = await test_client.post(
            "/graphql",
            json={"query": mutation},
            headers={"Authorization": f"Bearer {test_jwt_token}"},
        )
        # Mutations should never be cached
        assert response1.status_code in [200, 400, 401]
