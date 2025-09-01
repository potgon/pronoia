package dev.potgon.Pronoia.auth.domain;

import dev.potgon.Pronoia.auth.application.AuthService;
import dev.potgon.Pronoia.auth.application.UserDTOMapper;
import dev.potgon.Pronoia.auth.application.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthPort port;
    private final UserDTOMapper mapper;

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public RegisterResponseDTO register(RegisterDTO dto) {
        RegisterResponseDTO response = RegisterResponseDTO.builder().build();
        if (port.existsByEmail(dto.getEmail())) {
            response.setResult(false);
            response.setMessage("Existe otro usuario con este email");
            return response;
        }

        UserDomain user = new UserDomain();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true); // Set default active status
        user.setPrivate(true); // Set default privacy setting

        port.save(user);
        response.setResult(true);
        return response;
    }

    @Override
    public JwtResponseDTO login(LoginDTO dto) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        UserDomain userDomain = port.findByEmail(dto.getEmail()).orElse(null);
        UserDTO userDTO = null;
        if (userDomain != null) {
            userDTO = mapper.toDTO(userDomain);
        }

        return JwtResponseDTO.builder()
                .token(jwt)
                .user(userDTO)
                .build();
    }

    @Override
    public UserDTO validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new UsernameNotFoundException("Invalid or expired token");
        }
        String email = jwtUtil.extractUsername(token);
        UserDomain user = port.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapper.toDTO(user);
    }
}

