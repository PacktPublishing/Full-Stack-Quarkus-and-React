package com.example.fullstack;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.jboss.resteasy.reactive.RestResponse;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.CacheControl;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Objects;

@Path("/")
@RegisterForReflection
public class GatewayResource {

  private static final String FALLBACK_RESOURCE = "/frontend/index.html";

  @GET
  @Path("/")
  public RestResponse<InputStream> getFrontendRoot() throws IOException {
    return getFrontendStaticFile("index.html");
  }

  @GET
  @Path("/{fileName:.+}")
  public RestResponse<InputStream> getFrontendStaticFile(@PathParam("fileName") String fileName) throws IOException {
    final InputStream requestedFileStream = GatewayResource.class.getResourceAsStream("/frontend/" + fileName);
    final InputStream inputStream;
    inputStream = Objects.requireNonNullElseGet(requestedFileStream, () ->
      GatewayResource.class.getResourceAsStream(FALLBACK_RESOURCE));
    return RestResponse.ResponseBuilder
      .ok(inputStream)
      .cacheControl(CacheControl.valueOf("max-age=900"))
      .type(URLConnection.guessContentTypeFromStream(inputStream))
      .build();
  }
}
