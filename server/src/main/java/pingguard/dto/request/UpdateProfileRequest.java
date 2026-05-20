package pingguard.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank String displayName,
    @Size(min = 8) String newPassword
) {}
