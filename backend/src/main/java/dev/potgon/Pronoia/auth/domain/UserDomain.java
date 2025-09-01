package dev.potgon.Pronoia.auth.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserDomain {

    @EqualsAndHashCode.Include
    private Long id;
    private String email;
    private String name;
    private String surname;
    private String password;
    private boolean isPrivate;
    private LocalDateTime createdAt;
    private boolean isActive;
}
