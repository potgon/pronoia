package dev.potgon.Pronoia.auth.application;

import dev.potgon.Pronoia.auth.application.dto.UserDTO;
import dev.potgon.Pronoia.auth.domain.UserDomain;
import org.springframework.stereotype.Component;

@Component
public class UserDTOMapper {

    public UserDTO toDTO(UserDomain domain) {
        if (domain == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(domain.getId());
        dto.setEmail(domain.getEmail());
        dto.setName(domain.getName());
        dto.setSurname(domain.getSurname());
        dto.setPrivate(domain.isPrivate());
        dto.setCreatedAt(domain.getCreatedAt());
        dto.setActive(domain.isActive());
        return dto;
    }
}
