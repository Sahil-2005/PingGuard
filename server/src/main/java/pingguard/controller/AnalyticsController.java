package pingguard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pingguard.dto.response.AnalyticsSummaryResponse;
import pingguard.security.SecurityUser;
import pingguard.service.AnalyticsService;

import java.util.UUID;

/**
 * REST controller exposing analytics endpoints for monitors.
 *
 * <p>All endpoints are protected by the JWT filter defined in SecurityConfig.
 * Ownership is enforced in the service layer — a user receives 403 if they
 * attempt to access analytics for a monitor they do not own.
 *
 * <p>Base path: /api/monitors/{id}/analytics
 * This mirrors the existing /api/monitors/{id} resource hierarchy.
 */
@RestController
@RequestMapping("/api/monitors")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Returns a complete analytics summary for the specified monitor.
     *
     * <p>Includes:
     * <ul>
     *   <li>Uptime % for the last 24 h, 7 d, and 30 d windows</li>
     *   <li>Average latency (ms) for the same three windows</li>
     *   <li>Hourly latency time-series for the last 24 h (chart data)</li>
     *   <li>Daily uptime % for the last 30 days (bar chart data)</li>
     * </ul>
     *
     * @param id           the monitor's UUID (path variable)
     * @param securityUser the authenticated user injected by Spring Security
     * @return 200 with {@link AnalyticsSummaryResponse}
     *         404 if the monitor does not exist
     *         403 if the monitor belongs to a different user
     */
    @GetMapping("/{id}/analytics")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalytics(
            @PathVariable UUID id,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        AnalyticsSummaryResponse response = analyticsService.getSummary(
                id,
                securityUser.getUser().getId()
        );
        return ResponseEntity.ok(response);
    }
}
