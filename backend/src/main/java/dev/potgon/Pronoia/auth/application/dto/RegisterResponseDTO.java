package dev.potgon.Pronoia.auth.application.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponseDTO {
    boolean result;
    String message;
}
