import asyncpg
from typing import Dict, Any, List, Optional

class CreationsRepository:
    async def create_creation(
        self, 
        conn: asyncpg.Connection, 
        user_id: int, 
        media_url: str, 
        media_type: str, 
        prompt: str
    ) -> Dict[str, Any]:
        """
        Inserts a new creation record into the database.
        """
        query = """
            INSERT INTO creations (user_id, media_url, media_type, prompt)
            VALUES ($1, $2, $3, $4)
            RETURNING id, user_id, media_url, media_type, prompt, created_at
        """
        new_creation = await conn.fetchrow(query, user_id, media_url, media_type, prompt)
        return dict(new_creation)

    async def get_all_creations(self, conn: asyncpg.Connection) -> List[Dict[str, Any]]:
        """
        Retrieves all creation records, ordered by the most recent.
        """
        query = """
            SELECT c.id, c.media_url, c.media_type, c.prompt, c.created_at, u.name as author_name
            FROM creations c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        """
        creations = await conn.fetch(query)
        return [dict(row) for row in creations]

    async def get_creation_by_id(self, conn: asyncpg.Connection, creation_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single creation by its ID.
        """
        query = "SELECT * FROM creations WHERE id = $1"
        creation = await conn.fetchrow(query, creation_id)
        return dict(creation) if creation else None

    async def delete_creation_by_id(self, conn: asyncpg.Connection, creation_id: int) -> Optional[Dict[str, Any]]:
        """
        Deletes a creation by its ID and returns the deleted record.
        """
        query = "DELETE FROM creations WHERE id = $1 RETURNING *"
        deleted_creation = await conn.fetchrow(query, creation_id)
        return dict(deleted_creation) if deleted_creation else None
