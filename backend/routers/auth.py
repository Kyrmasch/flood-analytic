from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from usecases.role.assign_role_to_user import assign_role_to_user
from usecases.role.get_role import get_role_by_name
from usecases.user.get_user import get_user_by_username
from schemas.auth import Token, User as UserSchema
from services.token_service import TokenService
from deps import get_current_user, get_db, get_token_service, get_user_service
from services.users_service import UserService
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

auth_router = APIRouter()


@auth_router.get("/users/me", response_model=UserSchema)
async def read_users_me(current_user: UserSchema = Depends(get_current_user)):
    """
    Информация о текущем пользователе
    """
    return current_user


@auth_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service),
    token_service: TokenService = Depends(get_token_service),
):
    """
    Получить токен доступа
    """
    user = user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, refresh_token = token_service.create_tokens(user.id)

    response = JSONResponse(
        content={"access_token": access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="Lax",
        secure=True,
    )
    return response


@auth_router.post("/refresh", response_model=Token)
async def refresh_access_token(
    refresh_token: str = Cookie(None),
    token_service: TokenService = Depends(get_token_service),
):
    """
    Обновить токен
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not provided",
        )

    new_refresh_token = token_service.rotate_refresh_token(refresh_token)
    if not new_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    access_token = token_service.create_tokens(new_refresh_token)[0]

    response = JSONResponse(
        content={"access_token": access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        samesite="Lax",
        secure=True,
    )
    return response