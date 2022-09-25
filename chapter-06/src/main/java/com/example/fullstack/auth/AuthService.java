package com.example.fullstack.auth;

import com.example.fullstack.user.UserService;
import io.quarkus.security.AuthenticationFailedException;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.time.Duration;
import java.util.HashSet;

@ApplicationScoped
public class AuthService {

  private final String issuer;
  private final UserService userService;

  @Inject
  public AuthService(
    @ConfigProperty(name = "mp.jwt.verify.issuer") String issuer, UserService userService) {
    this.issuer = issuer;
    this.userService = userService;
  }

  public Uni<String> authenticate(AuthRequest authRequest) {
    return userService.findByName(authRequest.name())
      .onItem()
      .transform(user -> {
        if (user == null || !UserService.matches(user, authRequest.password())) {
          throw new AuthenticationFailedException("Invalid credentials");
        }
        return Jwt.issuer(issuer)
          .upn(user.name)
          .groups(new HashSet<>(user.roles))
          .expiresIn(Duration.ofHours(1L))
          .sign();
      });
  }
}
