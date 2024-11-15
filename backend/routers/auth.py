from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from schemas.auth import Token, User as UserSchema, UserResetPassword
from services.token_service import TokenService
from deps import get_current_user, get_token_service, get_user_service
from services.users_service import UserService
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
import asyncio

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
    user = await asyncio.create_task(
        user_service.authenticate_user(
            form_data.username,
            form_data.password,
        )
    )
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

    new_access_token, new_refresh_token = token_service.rotate_refresh_token(
        refresh_token
    )
    if not new_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    response = JSONResponse(
        content={"access_token": new_access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        samesite="Lax",
        secure=True,
    )
    return response

@auth_router.put("/users/me/reset-password", response_model=None)
async def reset_password(
    req: UserResetPassword,
    user_service: UserService = Depends(get_user_service),
):
    """
    Сбросить пароль
    """

    # Update the password in the database
    await asyncio.create_task(
        user_service.reset_password(req.username, req.old_password, req.new_password)
    )

    # Prepare and send the response
    response = JSONResponse(
        content={"message": "Password updated successfully"}
    )

    return response
