package dev.potgon.Pronoia.auth.infrastructure;

import dev.potgon.Pronoia.auth.domain.UserDomain;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDomain toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return UserDomain.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .name(entity.getName())
                .surname(entity.getSurname())
                .password(entity.getPassword())
                .isPrivate(entity.isPrivate())
                .createdAt(entity.getCreatedAt())
                .isActive(entity.isActive())
                .build();
    }

    public UserEntity toEntity(UserDomain domain) {
        if (domain == null) {
            return null;
        }

        UserEntity entity = UserEntity.builder()
                .email(domain.getEmail())
                .name(domain.getName())
                .surname(domain.getSurname())
                .password(domain.getPassword())
                .isPrivate(domain.isPrivate())
                .isActive(domain.isActive())
                .build();

        // Only set ID and createdAt if they exist (for new entities, they're auto-generated)
        if (domain.getId() != null) {
            entity.setId(domain.getId());
        }
        if (domain.getCreatedAt() != null) {
            entity.setCreatedAt(domain.getCreatedAt());
        }

        return entity;
    }
}
