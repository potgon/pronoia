package dev.potgon.Pronoia.auth.application.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private long id;
    private String email;
    private String name;
    private String surname;
    private boolean isPrivate;
    private LocalDateTime createdAt;
    private boolean isActive;
    private long partnershipId;
}
