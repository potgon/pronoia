package dev.potgon.Pronoia.auth.infrastructure;

import dev.potgon.Pronoia.auth.domain.AuthPort;
import dev.potgon.Pronoia.auth.domain.UserDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthAdapter implements AuthPort {

    private final UserRepository repository;
    private final UserMapper mapper;

    @Override
    public Optional<UserDomain> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public void save(UserDomain user) {
        repository.save(mapper.toEntity(user));
    }
}
