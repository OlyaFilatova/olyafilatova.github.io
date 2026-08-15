from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models import IgnoredSynonymGroup
from .base import BaseRepository


class IgnoredSynonymGroupRepository(BaseRepository):
  def __init__(self) -> None:
    super().__init__(IgnoredSynonymGroup)

  async def get_all(self) -> list[IgnoredSynonymGroup]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(IgnoredSynonymGroup)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, id: str) -> IgnoredSynonymGroup:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = IgnoredSynonymGroup(id=id)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"IgnoredSynonymGroup creation failed: {e}") from e
