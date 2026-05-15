"""ORM model registry — import all models here so Alembic discovers them."""

from app.models.auth import (  # noqa: F401
    Permission,
    Role,
    RoleAssignment,
    RolePermission,
    Session,
    User,
)
from app.models.content import (  # noqa: F401
    Article,
    ArticleBlock,
    ArticleTag,
    Author,
    Tag,
    Template,
)
from app.models.stats import (  # noqa: F401
    Course,
    Market,
    MarketSelection,
    ModelRun,
    Player,
    Projection,
    Round,
    Tournament,
    TournamentEntry,
)
