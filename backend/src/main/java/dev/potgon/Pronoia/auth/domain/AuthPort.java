package dev.potgon.Pronoia.auth.domain;

import java.util.Optional;

public interface AuthPort {
    Optional<UserDomain> findByEmail(String email);
    boolean existsByEmail(String email);
    void save(UserDomain user);
}
