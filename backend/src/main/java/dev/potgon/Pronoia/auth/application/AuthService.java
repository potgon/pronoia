package dev.potgon.Pronoia.auth.application;

import dev.potgon.Pronoia.auth.application.dto.*;

public interface AuthService {
    RegisterResponseDTO register(RegisterDTO dto);
    JwtResponseDTO login(LoginDTO dto);
    UserDTO validateToken(String token);
}
