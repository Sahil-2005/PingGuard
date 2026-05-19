package pingguard.dto.response;

public record AuthResponse(
    String token, 
    String email, 
    String displayName
) {}
