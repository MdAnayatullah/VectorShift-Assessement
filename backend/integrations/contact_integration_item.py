from datetime import datetime
from typing import Optional, List

class ContactIntegrationItem:
    def __init__(
        self,
        id: Optional[str] = None,
        createdAt: Optional[datetime] = None,
        updatedAt: Optional[datetime] = None,
        archived: Optional[bool] = False,
        firstName: Optional[str] = None,
        lastName: Optional[str] = None,
        email: Optional[str] = None,
    ):
        self.id = id
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.archived = archived
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
    
    def __str__(self) -> str:
        return "First name: " + self.firstName + " Last name: " + self.lastName + " Email ID: " + self.email