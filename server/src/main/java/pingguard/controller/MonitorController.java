package pingguard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pingguard.dto.request.CreateMonitorRequest;
import pingguard.dto.response.MonitorResponse;
import pingguard.security.SecurityUser;
import pingguard.service.MonitorService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monitors")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;

    @PostMapping
    public ResponseEntity<MonitorResponse> createMonitor(
            @Valid @RequestBody CreateMonitorRequest request,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        return ResponseEntity.ok(monitorService.create(request, securityUser.getUser()));
    }

    @GetMapping
    public ResponseEntity<List<MonitorResponse>> getMonitors(
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        return ResponseEntity.ok(monitorService.getAllForUser(securityUser.getUser().getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonitor(
            @PathVariable UUID id,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        monitorService.delete(id, securityUser.getUser());
        return ResponseEntity.noContent().build();
    }
}
