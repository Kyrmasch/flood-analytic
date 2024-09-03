from usecases.user.getuser import get_user_by_id
from services.tokenservice import TokenService
from services.usersservice import UserService
from infrastructure.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from schemas.auth import TokenData
from infrastructure.auth import ALGORITHM, SECRET_KEY

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)


def get_token_service(db: Session = Depends(get_db)):
    return TokenService(db)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(db, token_data.user_id)
    if user is None:
        raise credentials_exception
    return user
