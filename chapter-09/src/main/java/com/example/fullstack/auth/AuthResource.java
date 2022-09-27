package com.example.fullstack.auth;

import io.smallrye.mutiny.Uni;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

@Path("/api/v1/auth")
public class AuthResource {

  private final AuthService authService;

  @Inject
  public AuthResource(AuthService authService) {
    this.authService = authService;
  }

  @PermitAll
  @POST
  @Path("/login")
  public Uni<String> login(AuthRequest request) {
    return authService.authenticate(request);
  }
}
